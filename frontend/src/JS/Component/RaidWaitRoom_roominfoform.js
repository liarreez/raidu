import { Select, FormControl, InputLabel, Grid, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';

const RaidWaitRoom_roominfoform = ({roomSet, isCaptain, rounds, roomSetSetter, exerciseSetSetter}) => {
                                // 방 설정과 방장 여부
    // PROPS =========================================
    const { roundCount, roundTime, restTime } = roomSet;
    const [localRoundCount, setLocalRoundCount] = useState(roundCount);
    const [localRoundTime, setLocalRoundTime] = useState(roundTime);
    const [localRestTime, setLocalRestTime] = useState(restTime);

    const [secondOption, setSecondOption] = useState([]); // 선택할 수 있는 초(seconds) 목록
    
    const [exerciseOption, setExerciseOption] = useState([]); // 이용자가 선택한 운동 목록

    // 240804 TO-DOs
    // 1. 방장 여부(isCaptain ? )에 따라 select disabled 주가 
    // 2. 하단부 form 셀렉-옵션 작업 (완료)

    // EVENT HANDLERS =========================================
    const handleLocalRestTimeChange = (e) => {
        setLocalRestTime(e.target.value);
        roomSetSetter(roundTime, e.target.value, roundCount);
    }

    const handleLocalRoundCountChange = (e) => {
        setLocalRoundCount(e.target.value);
        exerciseSetSetter([]); // 사이즈가 바뀌면 다 비워야 한다.
        roomSetSetter(roundTime, restTime, e.target.value);
    }

    const handleLocalRoundTimeChange = (e) => {
        setLocalRoundTime(e.target.value);
        roomSetSetter(e.target.value, restTime, roundCount);
    }

    const handleExerciseOptionChange = (e, index) => {
        let nowList = [...exerciseOption];
        nowList[index] = e.target.value;
        setExerciseOption(nowList);
    }

    useEffect(() => { // 사용자가 운동 종목 리스트를 변경할 때마다 상위 컴포넌트에 반영함
        exerciseSetSetter(exerciseOption);
     //   console.log(exerciseOption);
    },[exerciseOption]);

    // CALC PART - option values =========================================
    useEffect(() => { 
        
        // 15~180초 선택지 설정
        const newOptions = [];
        for (let i = 30; i <= 180; i += 30) { // 15초 간격의 옵션 설정
            newOptions.push(i);
        }
        setSecondOption(newOptions);


    }, []);

    // 상위 컴포에서 props 바뀔 때 작동 (상위 컴포에서 useState 기본값을 0으로 주기 때문에 꼭 있어야 함)
    useEffect(() => { 
        setLocalRoundCount(roundCount);
        setLocalRestTime(restTime);
        setLocalRoundTime(roundTime);

    }, [roundCount, restTime, roundTime])

    // STYLE =========================================

    const formStyle = {
        backgroundColor: 'white',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
     //   margin: '4% 0',
     //  padding: '1.5% 0',
        border: '3px solid #c0c0c0'
    }

    const interFormStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        width: '100%',
        marginTop: '2%'
    }

    const interFormCalcStyle = {
        ...interFormStyle, 
        justifyContent: 'center'
    }

    const spanStyle = {
        minWidth: '30%',
        textAlign: 'center'
    }

    return(
        <div>
            <Grid container direction="column" spacing={7} >
                <Grid item xs={7} >
                    <div style={formStyle}>
                        <div style={interFormStyle}>
                            <span style={spanStyle}>라운드별 시간</span>
                            <FormControl variant="filled" sx={{ minWidth: '50%' }} disabled>
                                <InputLabel id="round-time-label">15 ~ 180초 선택 가능</InputLabel>
                                <Select
                                    labelId="round-time-label"
                                    id="round-time-select"
                                    value={localRoundTime}
                                    onChange={handleLocalRoundTimeChange}
                                >
                                    <MenuItem value={localRoundTime}>{localRoundTime}초</MenuItem>
                                    {secondOption.map((each) => (
                                        <MenuItem key={each} value={each}>{each}초</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={interFormStyle}>
                            <span style={spanStyle}>휴식 시간</span>
                            <FormControl variant="filled" sx={{ minWidth: '50%' }} disabled>
                                <InputLabel id="rest-time-label">15 ~ 180초 선택 가능</InputLabel>
                                <Select
                                    labelId="rest-time-label"
                                    id="rest-time-select"
                                    value={localRestTime}
                                    onChange={handleLocalRestTimeChange}
                                >
                                    <MenuItem value={localRestTime}>{localRestTime}초</MenuItem>
                                    {secondOption.map((each) => (
                                        <MenuItem key={each} value={each}>{each}초</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={interFormStyle}>
                            <span style={spanStyle}>라운드 수</span>
                            <FormControl variant="filled" sx={{ minWidth: '50%' }} disabled>
                                <InputLabel id="round-count-label">1 ~ 3회 선택 가능</InputLabel>
                                <Select
                                    labelId="round-count-label"
                                    id="round-count-select"
                                    value={localRoundCount}
                                    onChange={handleLocalRoundCountChange}
                                >
                                    <MenuItem value={localRoundCount}>{localRoundCount}회</MenuItem>
                                    <MenuItem value={1}>1회</MenuItem>
                                    <MenuItem value={2}>2회</MenuItem>
                                    <MenuItem value={3}>3회</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div style={interFormCalcStyle}>
                            <span style={spanStyle}>예상 플레이 시간</span>
                            <span>{localRoundTime * localRoundCount + localRestTime * (localRoundCount - 1)}초</span>
                        </div>
                    </div>
                </Grid>

                {/* 하단부 form */}
                <Grid item xs={5}>
                    <div style={formStyle}>
                        {
                        
                            Array.from({ length: rounds }).map((_, index) => (
                                <div key={index} style={interFormStyle}>
                                    <span style={spanStyle}>{index + 1}라운드 </span>
                                    <FormControl variant="filled" sx={{ minWidth: '50%' }}>
                                        <InputLabel id={`exercise-option-label-${index}`}>운동 선택</InputLabel>
                                        <Select
                                            labelId={`exercise-option-label-${index}`}
                                            id={`exercise-option-select-${index}`}
                                            value={exerciseOption[index] || ''}
                                            onChange={(e) => handleExerciseOptionChange(e, index)}
                                        >
                                            <MenuItem value={'lunge'}>런지</MenuItem>
                                            <MenuItem value={'jumpingJack'}>팔벌려뛰기</MenuItem>
                                            <MenuItem value={'sitUp'}>윗몸일으키기</MenuItem>
                                            <MenuItem value={'pushUp'}>팔굽혀펴기</MenuItem>
                                            <MenuItem value={'squat'}>스쿼트</MenuItem>
                                            {
                                                /*
                                                팔 벌려 뛰기: jumpingJack
                                                윗몸일으키기: sitUp
                                                런지: lunge
                                                팔굽혀펴기: pushUp
                                                스쿼트: squat
                                            */
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                            ))
                        }
                        
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default RaidWaitRoom_roominfoform;
