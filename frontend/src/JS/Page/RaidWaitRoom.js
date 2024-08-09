//=========== import libraries 
import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';

//=========== import networks
import { Socketest } from '../Component/Socketest.js'
import axios from 'axios'; 

//=========== import essets
import '../../CSS/RaidWaitRoom.css';
import logo from '../../Imgs/logo.png';
import locked from '../../Imgs/lockedicon.png';
import unlocked from '../../Imgs/unlockedicon.png';
import out from '../../Imgs/roomouticon.png';

//=========== import components
import Participants from '../Component/RaidWaitRoom_participants.js';
import RoomInfoForm from '../Component/RaidWaitRoom_roominfoform.js';
import Chatting from '../Component/RaidWaitRoom_chatting.js';

import { API_URL } from '../../config';  // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트

class User {
    constructor(nickname, badge, profileImage, level, highestScore, readyState, isCaptain) {
        this.nickname = nickname; // 닉네임
        this.badge = badge; // 배지 PK
        this.profileImage = profileImage; // 프로필 이미지 src
        this.level = level; // 레벨
        this.highestScore = highestScore; // 최고기록
        this.readyState = readyState; // 레디 상태
        this.isCaptain = isCaptain; // 방장인가 아닌가
    }
}
// 이하 웹소켓으로 세팅(지금은 dummy val)

class Room {
    constructor(roundTime, restTime, roundCount) {
        this.roundTime = roundTime;
        this.restTime = restTime;
        this.roundCount = roundCount;
    }
}   

const SERVER_URL = API_URL;
const token = localStorage.getItem('accessToken');

const RaidWaitRoom = () => {
    // ========= roomName은 pathVariable로 줄 거고
    // ========= roomSet은 props로 넘기고
    // ========= isRoomLocked는 대기실에서 입장할 수 있는 모든 방이 false입니다
    const location = useLocation();
    const [isFullScreen, setIsFullScreen] = useState(false);

    // 페이지 이동을 위한 네비게이트
    const navigate = useNavigate();

    const { roomName } = useParams(); // 꼭 방의 제목일 필요 없다. PK 받아서 숫자로 지정할 것임
    const [roomSet, setRoomSet] = useState(new Room(0, 0, 0)); // roomSet은 객체임.
    // const [roomSet, setRoomSet] = useState()로 두게 되면 undefined 오류가 나므로
    // 초깃값을 임의의 어떤 값으로 채워주는 것이 좋다. DOM 로드 후 -> useEffect 실행되기 때문

    const [exerciseSet, setExerciseSet] = useState([]); // 이 부분은 하위 컴포 roominfoform에서만 세팅합니다.
    useEffect(() => {
        console.log("RaidWaitRoom line 60 ", exerciseSet)
    }, [exerciseSet])

    const [roomNamed, setRoomNamed] = useState(''); 
    const [isRoomLocked, setIsRoomLocked] = useState(false);
    
    // room setting은 방장만 바꿀 수 있으므로 유의하여 컴포에 props 넘길 것 ㅜ 
    // room setting과 me.isCaptain을 컴포에 넘겨야 할 것 같음
    const [me, setMe] = useState(new User("", 0, "", 0, 0, true, false ));
    // 세션으로 받게 되면 세션 값으로 세팅해 주세요
    
    const [participantsList, setParticipantsList] = useState([])

    const [rendered, setRendered] = useState(false);
    
    // 방 제목 수정하는 방법
    // 상단 흰색 제목이 있는 영역을 클릭하면 수정할 수 있다.
    // 모달로 띄울지 아니면 동적으로 입력하도록 만들지(제목 지우고 input 넣고 버튼 띄우기)는 생각 중임
    // 아마 후자 될 것

    
    useEffect(() => {
        axios.get(SERVER_URL+'/api/raidu/userpage', {
            headers: {
                'Authorization': `Bearer ${token}` // Bearer 토큰을 사용하는 경우
            }
        }).then((res) => {
            const data = res.data.data.userProfile;
            console.log(data);
            setMe(new User(data.nickname, data.symbolImageUrl, data.profileImageUrl, data.level, data.bestScore, false, (location.state !== null && location.state !== undefined) ? location.state.isCaptain : false))
            
        
        })
        
        axios.get(SERVER_URL+'/api/raidu/rooms/'+roomName, {
            headers: {
                'Authorization': `Bearer ${token}` // Bearer 토큰을 사용하는 경우
            }
        }).then((res) => {
            const roomInfo = res.data.data.room;
            const partInfo = res.data.data.userProfileList;
            setRoomNamed(roomInfo.title);
            setRoomSet(new Room(roomInfo.roundTime, roomInfo.restTime, roomInfo.totalRounds));
            console.log(res.data.data.room)
            console.log(res.data.data.userProfileList)
          //  setParticipantsList([...participantsList, ])
        })

        setRoomNamed(roomName); // 방 이름 변경 가능하게 하려면 이 부분 수정해야 함. 지금은 pathVal에서 가져온다
        setIsRoomLocked(false);
        
        setRendered(true);

    },[]); // onMount 

    useEffect(() => {
        setParticipantsList([
            me,
       //     new User("이싸피", 2, "profile2.png", 4, 420, true, false),
       //     new User("최싸피", 3, "profile3.png", 5, 520, true, false),
       //     new User("박싸피", 4, "profile4.png", 6, 620, true, false)
        ]);
    },[me])

    const roomSetSetter = (roundTime, restTime, roundCount) => {
        setRoomSet(new Room(roundTime, restTime, roundCount));
    }

    const exerciseSetSetter = (list) => {
        setExerciseSet(list);
    }

    // 운동 set은 하위 컴포넌트에서 넘어와야 하는 값임 
    // 레디를 눌렀을 때 disabled되며, 게임이 시작하면 서버로 넘어간다

    // WEBSOCKET SETTING ========================================

    const [websocketClient, setWebsocketClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => { 
        // 페이지 진입 시 room PK를 가지고 소켓 클라이언트 객체를 생성합니다.
        const client = new Socketest(roomName);
        setWebsocketClient(client);
        return() => {
            if(client) {
                client.disconnect();
            }
        };
    }, [roomNamed, exerciseSet]);

    useEffect(() => { 
        // 소켓 클라이언트가 생성되면 서버 웹소켓과 연결합니다. /sub/message/ 구독을 시작합니다.
        if(!websocketClient) return;
        const connectWebSocket = async () => {
            try {
                await websocketClient.connect();
                const subscription = websocketClient.subscribe('/sub/message/' + roomName, (message) => {
                    const parsedMessage = JSON.parse(message.body);
                    switch(parsedMessage.type){
                        case '1': console.log('unhandled message'); break;
                        case '2': updateUserReadyState(parsedMessage.user, parsedMessage.readyType); break;
                        case '3': setChatMessages((prevMessages) => [...prevMessages, parsedMessage]); break;
                        case '4': gameStart(); break;
                        default: console.log('?')
                    }
                    setMessages((prevMessages) => [...prevMessages, parsedMessage]);
                });
                return () => {
                    if(subscription) subscription.unsubscribe();
                    websocketClient.disconnect();
                };
            } catch (error) {
                console.error('Error caused by websocket connecting process : ', error);
            }
        };
        connectWebSocket();
        return () => {
            if(websocketClient) {
                websocketClient.disconnect()
            }
        };
    }, [websocketClient, roomNamed, exerciseSet]);



    // WATCHING USESTATES

    useEffect(() => {
        console.log(participantsList)
    },[participantsList]);

    
    // WEBSOCKET 동작 테스트 ===========================

    // making timestamp
    const getTime = () => {
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
    // const year = now.getFullYear();
        const month = pad(now.getMonth() + 1); 
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());
    //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return `${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const DESTINATION = '/pub/message';
    const COMMONFORM = { // 메시지 타입 관계없이 공통적으로 쓰이는 내용입니다.
        user: me.nickname,
        channel: roomName,
        timestamp: getTime()
    };

    const sendTest1 = (enterType) => { // 사용자 입/퇴장 관련 웹소켓 메서드
        enterType=true;
        if (websocketClient) {
            const message = JSON.stringify({
                ...COMMONFORM,
                type: "1",
                enterType
            })
            websocketClient.send(DESTINATION, message);
        }
    };

    const sendTest2 = () => { // 사용자 준비 상태 관련 웹소켓 메서드
        if(checkExerciseOption){
            const readyType = !me.readyState;
            if (websocketClient) {
                const message = JSON.stringify({
                    ...COMMONFORM,
                    type:"2",
                    readyType
                })
                websocketClient.send(DESTINATION, message);
            }
        }else{
            console.log('모든 라운드에 대한 운동 종목 선택을 완료해 주세요.')
        }
    };

    const sendTest3 = (content) => { // 사용자 채팅 전송 관련 웹소켓 메서드
        if (websocketClient) {
            const message = JSON.stringify({
                ...COMMONFORM,
                type: "3",
                body: content
            })
            websocketClient.send(DESTINATION, message);
        }
    };

    const sendTest4 = () => { // 방장이 게임 시작을 누르면 메시지 발송
        if (websocketClient) {
            const message = JSON.stringify({
                ...COMMONFORM,
                type: "4",
                startType: true
            })
            websocketClient.send(DESTINATION, message);
        }
    };

    const updateUserReadyState = (name, readyType) => {
        const updatedParticipants = participantsList.map(user => {
            if (user.nickname === name) {
                return new User(user.nickname, user.badge, user.profileImage, user.level, user.highestScore, readyType, user.isCaptain);
            }
            return user;
        });
    
        setParticipantsList(updatedParticipants);

        if (name === me.nickname) {
            setMe(prevMe => new User(prevMe.nickname, prevMe.badge, prevMe.profileImage, prevMe.level, prevMe.highestScore, readyType, prevMe.isCaptain));
        }
    };

    const checkExerciseOption = () => { 
        // '준비하기' 버튼을 누르기 전(1인 게임의 경우 '시작하기' 전) 모든 라운드의 운동 종류 선택이 완료되었는지 체크합니다. 
        console.log('checkExerciseOption : ' + exerciseSet.length);
        console.log('checkExerciseOption : ' + roomSet.roundCount);
        return exerciseSet.length == roomSet.roundCount;
    }

    const checkReadyState = () => {
        if(checkExerciseOption){
            // 모든 사용자가 준비 상태인지, 모든 라운드별 운동 종목을 선택했는지 확인해 주세요
            if(participantsList.length != 1){ // 방에 남은 참가자가 한 명이면 레디 상태와 관련 없이 무조건 시작 가능합니다.
                const isAllReady = participantsList.every(user => user.readyState);
                return isAllReady;
            }else return true;
        }else{
            console.log('모든 운동 종목에 대한 선택을 완료해 주세요.')
            return false;
        }
    };


    const tryGameStart = () => {
        if (checkReadyState()) {
            console.log('============ PRINTING SETTINGS =============');
            // 방 정보
            // 사용자 정보
            // 선택한 운동 정보 묶어서 보여주기
            console.log(roomSet);
            console.log(me);
            console.log(exerciseSet);

            sendTest4(); // 웹소켓으로 모든 방 안의 참여자에게 게임 시작 알림을 보냅니다.
            // 로딩스피너 보였으면 좋겠어용 ~ 
        } else {
            console.log('아직 준비되지 않은 사용자가 있어요.')
        }
    };

    const gameStart = () => {
        axios.post(SERVER_URL+'/api/raidu/rooms/sessions', {roomName}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Bearer 토큰을 사용하는 경우
            }
        }).then((res) => {
                const roomInfo = roomSet;
                const userInfo = me;
                const exerciseInfo = exerciseSet;

                console.log('=========TEST=========')
                console.log(roomInfo);
                console.log(userInfo);
                console.log(exerciseInfo);

                navigate("/trainingTest", {
                    state: {
                        roomId: res.data.data.sessionId,
                        roomInfo,
                        userInfo,
                        exerciseInfo,
                    },
                });
        })
    }

    // 0808 checkReadyState() 로직 제대로 작동하지 않아 확인 필요합니다. 
    // 발생하고 있는 버그 : 모든 운동 라운드에 대한 종목 선택이 진행되지 않아도 게임이 시작되거나 준비가 진행됩니다.
    // 

    return(
        <div className="raidWaitRoom-container raidWaitRoom-html raidWaitRoom-body"> 
          {/* header */}
            <header className="raidWaitRoom-header">
                <div onClick={()=>navigate("/home")} className="raidWaitRoom-logoArea"><img src = {logo} className="raidWaitRoom-logo" alt="logoImg"/></div>
                <span className="raidWaitRoom-headerContent"> 
                    <img src = {isRoomLocked ? locked : unlocked} className="raidWaitRoom-lock" alt={isRoomLocked ? "locked" : "unlocked"}/>
                    <span className="raidWaitRoom-roomName">{roomNamed}</span>
                    <span className="raidWaitRoom-roomSetting">⏱ {roomSet.roundTime} / 💪 {roomSet.roundCount} / 💤 {roomSet.restTime} </span>
                </span>
            </header>

          {/* 컨테이너 박스 */}
            <Grid container spacing={0} style={{ height: 'calc(100vh - 64px)', flexGrow: 1 }}>
                {/* 왼쪽 컨테이너 */}
                <Grid item xs={5} md={5} className='raidWaitRoom-gridItems'>
                    <Grid container direction="column" spacing={1} style={{ height: '100%' }}>
                        <Grid item xs={8} style={{ height: '100%' }}>
                            <div style={{ height: '100%'}}>
                                {participantsList.map((each, index) => (
                                    <Participants key={index} user={each} />
                                ))}
                            </div>
                        </Grid>
                        <Grid item xs={4} style={{ height: '100%' }}>
                            <div style={{ height: '100%' }}>
                                <Chatting me={me} roomName={roomName} chatMessages={chatMessages} sendTest3={sendTest3}/>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 오른쪽 컨테이너 */}
                <Grid item xs={7} md={7} className='raidWaitRoom-gridItems'>
                    <Grid container direction="column" spacing={1} style={{ height: '100%' }}>
                        <Grid item xs={10} style={{ height: '100%' }}>
                            <div style={{ height: '100%' }} className='raidWaitRoom-rightTopCompo'>
                                <RoomInfoForm roomSet={roomSet} roomSetSetter={roomSetSetter} isCaptain={me.isCaptain} rounds={roomSet.roundCount} exerciseSetSetter={exerciseSetSetter}/>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <Grid container spacing={1} style={{ height: '100%' }}>

                                {   // true 부분 onClick 구현 완료 시 수정 필요 !!
                                    me.isCaptain ? (
                                        <Grid item xs={5}>
                                            <div className='raidWaitRoom-startButton' onClick={tryGameStart}>
                                                <span className='raidWaitRoom-buttonText'>시작하기</span>
                                            </div>
                                        </Grid>
                                    ) : me.readyState ? (
                                        <Grid item xs={5}>
                                            <div className='raidWaitRoom-startButton' onClick={sendTest2}>
                                                <span className='raidWaitRoom-buttonText'>준비 취소</span>
                                            </div>
                                        </Grid>

                                    ) : (
                                        <Grid item xs={5}>
                                            <div className='raidWaitRoom-startButton' onClick={sendTest2}>
                                                <span className='raidWaitRoom-buttonText'>준비하기</span>
                                            </div>
                                        </Grid>
                                    )
                                }

                                {/* 방장인지 아닌지에 따라 다른 컴포 출력 
                                
                                    isLeader ? <span classname='buttonText' onClick={start}>시작하기</span>
                                    : <span className='buttonText' onClick={ready}>준비하기</span>
                                
                                    onClick은 Grid 자체에 주면 되고, 준비하기 버튼은 토글처럼 동작해야 함
                                    준비하기 버튼 눌리고 나면 setReady(true)가 되는데, 이 상태인 동안에는 button color가 hover 시와 똑같도록 설정
                                */}
                                <Grid item xs={5}>
                                    <div className='raidWaitRoom-shareButton' >
                                        <span className='raidWaitRoom-buttonText'>링크 공유</span>
                                    </div>
                                </Grid>
                                <Grid item xs={2}>
                                    <div className="raidWaitRoom-outarea" > 
                                        <a href='/raid'>  
                                        {/* 방에서 나갈 때 나가기 처리도 해야 하고 방장이면 방 삭제도 해야 됩니다 */}
                                            <img src={out} alt="way out" className="raidWaitRoom-out"/>
                                        </a>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );


}

export default RaidWaitRoom;