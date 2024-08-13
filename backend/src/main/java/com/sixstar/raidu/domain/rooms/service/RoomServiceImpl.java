package com.sixstar.raidu.domain.rooms.service;

import com.sixstar.raidu.domain.dictionary.entity.Dictionary;
import com.sixstar.raidu.domain.dictionary.repository.DictionaryRepository;
import com.sixstar.raidu.domain.main.dto.RegionResponseDto;
import com.sixstar.raidu.domain.main.entity.Region;
import com.sixstar.raidu.domain.main.entity.Season;
import com.sixstar.raidu.domain.main.entity.SeasonRegionScore;
import com.sixstar.raidu.domain.main.repository.SeasonRegionScoreRepository;
import com.sixstar.raidu.domain.main.repository.SeasonRepository;
import com.sixstar.raidu.domain.main.service.MainpageServiceImpl;
import com.sixstar.raidu.domain.rooms.dto.*;
import com.sixstar.raidu.domain.rooms.entity.*;
import com.sixstar.raidu.domain.rooms.repository.*;
import com.sixstar.raidu.domain.rooms.repository.specification.RoomSpecification;
import com.sixstar.raidu.domain.userpage.dto.UserProfileResponseDto;
import com.sixstar.raidu.domain.userpage.entity.Monster;
import com.sixstar.raidu.domain.userpage.entity.UserMonster;
import com.sixstar.raidu.domain.userpage.entity.UserProfile;
import com.sixstar.raidu.domain.userpage.repository.MonsterRepository;
import com.sixstar.raidu.domain.userpage.repository.UserMonsterRepository;
import com.sixstar.raidu.domain.userpage.repository.UserProfileRepository;
import com.sixstar.raidu.global.response.BaseException;
import com.sixstar.raidu.global.response.BaseFailureResponse;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import jakarta.annotation.PostConstruct;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;

@Service
public class RoomServiceImpl implements RoomService{

    private MainpageServiceImpl mainpageService;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    public RoomServiceImpl(MainpageServiceImpl mainpageService, RoomRepository roomRepository,
        UserProfileRepository userProfileRepository, RoomUserRepository roomUserRepository,
        SeasonRepository seasonRepository, SeasonRegionScoreRepository seasonRegionScoreRepository,
        SeasonUserScoreRepository seasonUserScoreRepository,
        ExerciseRoomRecordRepository exerciseRoomRecordRepository,
        RoundRecordRepository roundRecordRepository, DictionaryRepository dictionaryRepository,
        MonsterRepository monsterRepository, UserMonsterRepository userMonsterRepository) {
        this.mainpageService = mainpageService;
        this.roomRepository = roomRepository;
        this.userProfileRepository = userProfileRepository;
        this.roomUserRepository = roomUserRepository;
        this.seasonRepository = seasonRepository;
        this.seasonRegionScoreRepository = seasonRegionScoreRepository;
        this.seasonUserScoreRepository = seasonUserScoreRepository;
        this.exerciseRoomRecordRepository = exerciseRoomRecordRepository;
        this.roundRecordRepository = roundRecordRepository;
        this.dictionaryRepository = dictionaryRepository;
        this.monsterRepository = monsterRepository;
        this.userMonsterRepository = userMonsterRepository;
    }

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }
    private final RoomRepository roomRepository;
    private final UserProfileRepository userProfileRepository;
    private final RoomUserRepository roomUserRepository;
    private final SeasonRepository seasonRepository;
    private final SeasonRegionScoreRepository seasonRegionScoreRepository;
    private final SeasonUserScoreRepository seasonUserScoreRepository;
    private final ExerciseRoomRecordRepository exerciseRoomRecordRepository;
    private final RoundRecordRepository roundRecordRepository;
    private final DictionaryRepository dictionaryRepository;
    private final MonsterRepository monsterRepository;
    private final UserMonsterRepository userMonsterRepository;

    public Room findRoomByIdOrThrow(Long roomId) {
        return roomRepository.findById(roomId)
            .orElseThrow(() -> new BaseException(BaseFailureResponse.ROOM_NOT_FOUND));
    }

    public UserProfile findUserProfileByEmailOrThrow(String email){
        return userProfileRepository.findByEmail(email)
            .orElseThrow(()->new BaseException(BaseFailureResponse.USER_NOT_FOUND));
    }

    @Override
    public Map<String, Object> createRoom(RoomCreateRequest request) {
        UserProfile userProfile = findUserProfileByEmailOrThrow(request.getHostEmail());

        Room room = request.toEntity(request, userProfile);
        Room savedRoom = roomRepository.save(room);

        RoomUser roomUser = new RoomUser(room, userProfile);
        roomUserRepository.save(roomUser);

        Map<String, Object> map = new HashMap<>();
        map.put("hostEmail", request.getHostEmail());
        map.put("roomId", savedRoom.getId());
        map.put("title", savedRoom.getTitle());
        return map;
    }

    @Override
    public Map<String, Object> enterRoom(Long roomId, String email) {
        Room room = findRoomByIdOrThrow(roomId);
        UserProfile userProfile = findUserProfileByEmailOrThrow(email);

        RoomUser roomUser = new RoomUser(room, userProfile);
        Boolean isExist = roomUserRepository.existsByRoomIdAndUserProfileId(roomId, userProfile.getId());
        if(isExist){
            throw new BaseException(BaseFailureResponse.ENTER_ROOM_FAIL);
        }

        int currentParticipantsCount = roomUserRepository.countByRoomId(roomId);
        if(currentParticipantsCount>=room.getMaxParticipants()){
            throw new BaseException(BaseFailureResponse.FULL_ROOM);
        }

        roomUserRepository.save(roomUser);
        RoomEnterResponse enteredUser = new RoomEnterResponse().fromEntity(userProfile);

        Map<String, Object> map = new HashMap<>();

        map.put("enteredUser", enteredUser);
        return map;
    }

    @Override
    public Map<String, Object> findAllWaitingRooms(
        Integer roundTime,
        Integer restTime,
        Integer totalRounds,
        String title) {

        Specification<Room> spec = RoomSpecification.baseWaitingRoomSpec();

        if(roundTime != null){
            spec = spec.and(RoomSpecification.findByRoundTime(roundTime));
        }
        if(restTime != null){
            spec = spec.and(RoomSpecification.findByRestTime(restTime));
        }
        if(totalRounds != null){
            spec = spec.and(RoomSpecification.findByTotalRounds(totalRounds));
        }
        if(title != null){
            spec = spec.and(RoomSpecification.likeTitle(title));
        }

        List<RoomResponse> waitingRoomList = roomRepository.findAll(spec)
                .stream()
                .map(RoomResponse::fromEntity)
                .toList();

        Map<String, Object> map = new HashMap<>();
        if (waitingRoomList.isEmpty()) {
            map.put("message", "No waiting rooms available.");
        } else {
            map.put("waitingRoomList", waitingRoomList);
        }
        return map;
    }

    @Transactional
    @Override
    public Map<String, Object> exitRoom(Long roomId, String email) {
        Room room = findRoomByIdOrThrow(roomId);
        UserProfile requestUser = findUserProfileByEmailOrThrow(email);

        String hostEmail = room.getUserProfile().getEmail();

        Map<String, Object> map = new HashMap<>();
        // 방장이라면 그 방의 roomUser 모두 삭제한 뒤 room도 삭제
        if(hostEmail.equals(requestUser.getEmail())){
            roomUserRepository.deleteByRoom(room);
            roomRepository.delete(room);
            map.put("roomId", roomId);
        }else{
            RoomUser roomUser = (RoomUser) roomUserRepository.findByRoomAndUserProfile(room, requestUser)
                    .orElseThrow(() -> new BaseException(BaseFailureResponse.ROOM_USER_NOT_FOUND));
            roomUserRepository.delete(roomUser);
        }
        map.put("email", email);
        return map;
    }

    @Transactional
    @Override
    public Map<String, Object> updateRoomSettings(Long roomId, UpdateRoomSettingsRequest request) {
        Room room = findRoomByIdOrThrow(roomId);

        room.update(request.getRoundTime(), request.getRestTime(), request.getTotalRounds());
        entityManager.flush();

        RoomResponse updatedRoom = RoomResponse.fromEntity(room);

        Map<String, Object> map = new HashMap<>();
        map.put("updatedRoom", updatedRoom);
        return map;
    }

    @Transactional
    @Override
    public Map<String, Object> updateRoomStatus(Long roomId) {
        Room room = findRoomByIdOrThrow(roomId);

        String status = room.getStatus();
        if(status.equals("waiting")){
            room.update("exercise");
        }else if(status.equals("exercise")){
            room.update("completed");
        }

        Map<String, Object> map = new HashMap<>();
        map.put("updatedStatus", room.getStatus());
        return map;
    }

    @Override
    public Map<String, Object> initializeSession(Map<String, Object> params)
        throws OpenViduJavaClientException, OpenViduHttpException {
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);

        Map<String, Object> map = new HashMap<>();
        map.put("sessionId", session.getSessionId());
        System.out.println("sessionId           "+session.getSessionId());
        return map;
    }

    @Override
    public Map<String, Object> createConnection(String sessionId, Map<String, Object> params)
        throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            throw new BaseException(BaseFailureResponse.SESSION_NOT_FOUND);
        }
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);
        Map<String, Object> map = new HashMap<>();
        map.put("token", connection.getToken());
        System.out.println("token           "+connection.getToken());

        return map;
    }

    @Transactional
    @Override
    public Map<String, Object> completeRoom(Long roomId, RoomCompleteRequest request) {
        // 방 상태 업데이트
        Room room = findRoomByIdOrThrow(roomId);
        room.update("completed");

        // 경험치, 레벨, 최고기록 업데이트
        UserProfile userProfile = findUserProfileByEmailOrThrow(request.getEmail());
        int gainedExp = ((room.getRoundTime()*room.getTotalRounds())/60)*50;

        boolean isLevelUp = false;
        if(userProfile.getExp()+gainedExp >= 750){
            isLevelUp = true;
        }
        userProfile.updateExp(gainedExp);

        boolean isBestScoreUpdated = false;
        if(userProfile.getBestScore() < request.getPersonalCombatPower())
        {
            userProfile.updateBestScore(request.getPersonalCombatPower(), request.getEndTime());
            isBestScoreUpdated = true;
        }

        // 시즌지역점수, 시즌사용자점수 누적
        Season season = seasonRepository.findSeasonByEndTime(request.getEndTime())
                .orElseThrow(() -> new BaseException(BaseFailureResponse.SEASON_NOT_FOUND));
        SeasonRegionScore updatedSeasonRegionScore = updateSeasonScores(season, userProfile.getRegion(), userProfile, request.getPersonalCombatPower());

        // exerciseRoom 저장
        ExerciseRoomRecord exerciseRoomRecord = ExerciseRoomRecordSaveRequest.toEntity(userProfile, room, request);
        ExerciseRoomRecord savedExerciseRoomRecord = exerciseRoomRecordRepository.save(exerciseRoomRecord);

        List<RoundRecord> roundRecordList = request.getRoundRecordList().stream()
                .map(roundRecordSaveRequest -> {
                    Dictionary dictionary = dictionaryRepository.findByName(roundRecordSaveRequest.getDictionaryName());
                    return RoundRecordSaveRequest.toEntity(savedExerciseRoomRecord, dictionary, roundRecordSaveRequest);
                }).toList();
        roundRecordRepository.saveAll(roundRecordList);

        // roundRecord 저장
        if(request.getRoundRecordList().isEmpty()){
            throw new BaseException(BaseFailureResponse.ROUND_RECORD_NOT_FOUND);
        }

        Long totalContribute = mainpageService.getTotalContribute(season);

        // 업데이트된 레벨, 경험치 반환
        Map<String, Object> map = new HashMap<>();
        map.put("region", RegionResponseDto.fromEntity(updatedSeasonRegionScore.getRegion()));
        map.put("updatedRegionScore", updatedSeasonRegionScore.getScore());
        map.put("updatedLevel", userProfile.getLevel());
        map.put("updatedExp", userProfile.getExp());
        map.put("isLevelUp", isLevelUp);
        map.put("isBestScoreUpdated", isBestScoreUpdated);
        map.put("totalContribute", totalContribute);

        return map;
    }

    public Monster getRandomMonster(List<Monster> monsterList) {
        if (monsterList == null || monsterList.isEmpty()) {
            return null; // 또는 적절한 예외 처리
        }
        Random random = new Random();
        int randomIndex = random.nextInt(monsterList.size());
        return monsterList.get(randomIndex);
    }

    @Override
    public Map<String, Object> getCapturedMonster(MonsterCaptureRequest request) {
        List<Monster> monsterList = monsterRepository.findByStageLessThanEqual(request.getStage());
        System.out.println("EMAIL           "+ request.getEmail() );
        System.out.println("STAGee          "+ request.getStage());
        Monster capturedMonster = getRandomMonster(monsterList);
        UserProfile userProfile = findUserProfileByEmailOrThrow(request.getEmail());

        boolean isNew = !userMonsterRepository.existsByUserProfileAndMonster(userProfile, capturedMonster);
        if(isNew){
            userMonsterRepository.save(new UserMonster(userProfile, capturedMonster));
        }

        MonsterCaptureResponse monsterCaptureResponse = MonsterCaptureResponse.fromEntity(capturedMonster, isNew);
        Map<String, Object> map = new HashMap<>();
        map.put("capturedMonster", monsterCaptureResponse);
        return map;
    }

    @Override
    public Map<String, Object> getRoomInfo(Long roomId) {
        Room room = findRoomByIdOrThrow(roomId);
        UserProfile host = findRoomByIdOrThrow(roomId).getUserProfile();

        List<UserProfileResponseDto> guestList = roomUserRepository.findByRoomId(roomId).stream()
            .filter(roomUser -> !Objects.equals(roomUser.getUserProfile().getId(), host.getId()))
            .map(roomUser -> UserProfileResponseDto.fromEntity(roomUser.getUserProfile()))
            .toList();

        Map<String, Object> map = new HashMap<>();
        map.put("room", RoomResponse.fromEntity(room));
        map.put("host", UserProfileResponseDto.fromEntity(host));
        map.put("guestList", guestList);
        return map;
    }

    @Transactional
    private SeasonRegionScore updateSeasonScores(Season currentSeason, Region region, UserProfile userProfile, int personalCombatPower) {
        SeasonUserScore seasonUserScore = seasonUserScoreRepository.findBySeasonAndUserProfile(currentSeason, userProfile);
        seasonUserScore.updateSeasonUserScore(personalCombatPower);

        SeasonRegionScore seasonRegionScore = seasonRegionScoreRepository.findBySeasonAndRegion(currentSeason, region);
        seasonRegionScore.updateSeasonRegionScore(personalCombatPower);

        return seasonRegionScore;
    }

}
