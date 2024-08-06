import { Select, FormControl, InputLabel, Grid, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';

const RaidWaitRoom_roominfoform = ({roomSet, isCaptain}) => {
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
    }

    const handleLocalRoundCountChange = (e) => {
        setLocalRoundCount(e.target.value);
    }

    const handleLocalRoundTimeChange = (e) => {
        setLocalRoundTime(e.target.value);
    }

    const handleExcerciseOptionChange = (e, num) => {
        let nowList = [...exerciseOption];
        nowList[num] = e.target.value;
        setExerciseOption(nowList);
    }

    // CALC PART - option values =========================================
    useEffect(() => { 
        
        // 15~180초 선택지 설정
        const newOptions = [];
        for (let i = 15; i <= 180; i += 15) { // 15초 간격의 옵션 설정
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
                            <FormControl variant="filled" sx={{ minWidth: '50%' }}>
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
                            <FormControl variant="filled" sx={{ minWidth: '50%' }}>
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
                            <FormControl variant="filled" sx={{ minWidth: '50%' }}>
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
                        <div style={interFormStyle}>
                            <span style={spanStyle}>1라운드 </span>
                            <FormControl variant="filled" sx={{ minWidth: '50%' }}>
                                <InputLabel id="demo-simple-select-filled-label">1라운드 운동 선택</InputLabel>
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={exerciseOption[0] === 'undefined' ? "" : exerciseOption[0] }
                                    onChange={(e) => handleExcerciseOptionChange(e, 0)}
                                >
                                    
                                    <MenuItem value={'lunge'}>런지</MenuItem>
                                    <MenuItem value={'jumpingJack'}>팔벌려뛰기</MenuItem>
                                </Select>
                            </FormControl>   
                        </div>
                        <div style={interFormStyle}>
                            <span style={spanStyle}>2라운드 </span>
                            <FormControl variant="filled" sx={{ minWidth: '50%' }}>
                                <InputLabel id="demo-simple-select-filled-label">2라운드 운동 선택</InputLabel>
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={exerciseOption[1] === 'undefined' ? "" : exerciseOption[1] }
                                    onChange={(e) => handleExcerciseOptionChange(e, 1)}
                                >
                                    
                                    <MenuItem value={'lunge'}>런지</MenuItem>
                                    <MenuItem value={'jumpingJack'}>팔벌려뛰기</MenuItem>
                                </Select>
                            </FormControl>    
                        </div>
                        <div style={interFormStyle}>
                            <span style={spanStyle}>3라운드 </span>
                            <FormControl variant="filled" sx={{ minWidth: '50%' }}>
                                <InputLabel id="demo-simple-select-filled-label">3라운드 운동 선택</InputLabel>
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={exerciseOption[2] === 'undefined' ? "" : exerciseOption[2] }
                                    onChange={(e) => handleExcerciseOptionChange(e, 2)}
                                >
                                    <MenuItem value={'lunge'}>런지</MenuItem>
                                    <MenuItem value={'jumpingJack'}>팔벌려뛰기</MenuItem>
                                </Select>
                            </FormControl>    
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default RaidWaitRoom_roominfoform;
