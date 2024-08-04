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
    const [exerciseOption, setExerciseOption] = useState(['lunge', 'jumpingJack']); // 선택할 수 있는 운동들 목록

    // 240804 TO-DOs
    // 1. 방장 여부(isCaptain ? )에 따라 select disabled 주가 
    // 2. 하단부 form 셀렉-옵션 작업

    const [age, setAge] = useState(null);
    const handleChange = (e) => {
        setAge(e.target.value);
    }


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

    // CALC PART - option values =========================================
    useEffect(() => { 
        
        // 15~180초 선택지 설정
        const newOptions = [];
        for (let i = 15; i <= 180; i += 15) { // 15
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
        margin: '3%',
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    }

    const interFormStyle = {
        display: 'flex',
        justifyContent: 'space-around', 
        alignItems: 'center', 
        fontWeight: 'bold',
        fontSize: '1.2rem',
        width: '100%' ,
    }

    const interFormCalcStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        fontWeight: 'bold',
        fontSize: '1.2rem',
        width: '100%' ,
        marginBottom: '5%'
    }

    const spanStyle = {
        minWidth: '20%'
    }

    const firstEleStyle = {
        marginTop: '1.5%'

    }

    const lastEleStyle = {
        marginBottom: '1%'
    }

    const formCtrlStyle = {
        marginLeft: '5%'
    }

    return(
        <div>
            <Grid container direction="column" spacing={1} className="subGridContainer" style={{ height: '100%' }}>
                <Grid item xs={7} style={formStyle}>
                    <Grid container direction="column" spacing={1.5} style={{height: '100%'}}>
                        <Grid item xs={3}>
                            <div style={interFormStyle}>
                                <span style={spanStyle}>라운드별 시간 </span>
                                <FormControl variant="filled" sx={{ minWidth: '50%' }} style={{...formCtrlStyle, ...firstEleStyle}}>
                                    <InputLabel id="demo-simple-select-filled-label">15 ~ 180초 선택 가능</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        value={localRoundTime}
                                        onChange={handleLocalRoundTimeChange}
                                    >
                                        <MenuItem value={localRoundTime}>{localRoundTime}초</MenuItem>
                                        {/* 직접입력으로 받을 수도 있기 때문에 위 라인을 살려둠 - 유저가 입력한 값이 option에 살아있어야 해서 */}
                                        {
                                           secondOption.map((each) => (
                                            <MenuItem value={each}>{each}초</MenuItem>
                                           ))                                     
                                        }
                                    </Select>
                                </FormControl>   
                            </div>
                        </Grid>
                        <Grid item xs={3}>
                            <div style={interFormStyle}>
                                <span style={spanStyle}>휴식 시간 </span>
                                <FormControl variant="filled" sx={{ minWidth: '50%' }} style={{...formCtrlStyle, ...firstEleStyle}}>
                                    <InputLabel id="demo-simple-select-filled-label">15 ~ 180초 선택 가능</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        value={localRestTime}
                                        onChange={handleLocalRestTimeChange}
                                    >
                                        <MenuItem value={localRestTime}>{localRestTime}초</MenuItem>
                                        {
                                           secondOption.map((each) => (
                                            <MenuItem value={each}>{each}초</MenuItem>
                                           ))                                     
                                        }
                                    </Select>
                                </FormControl>     
                            </div>
                        </Grid>
                        <Grid item xs={3}>
                            <div style={interFormStyle}>
                                <span style={spanStyle}>라운드 수 </span>
                                <FormControl variant="filled" sx={{ minWidth: '50%' }} style={formCtrlStyle}>
                                    <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
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
                        </Grid>
                        <Grid item xs={3}>
                            {/* <div style={interFormStyle}> */}
                            <div style={interFormCalcStyle}>
                                <span style={spanStyle}>총 소요 시간 </span>
                                <span > {localRoundTime*localRoundCount+localRestTime*(localRoundCount-1)}초</span>   
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 하단부 form */}
                <Grid item xs={5} style={formStyle}>
                <Grid container direction="column" spacing={1.5} style={{height: '100%'}}>
                        <Grid item xs={4}>
                            <div style={interFormStyle}>
                                <span style={spanStyle}>1라운드 </span>
                                <FormControl variant="filled" sx={{ minWidth: '50%' }} style={{...formCtrlStyle, ...firstEleStyle}}>
                                    <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        value={age}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>   
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div style={interFormStyle}>
                                <span style={spanStyle}>2라운드 </span>
                                <FormControl variant="filled" sx={{ minWidth: '50%' }} style={formCtrlStyle}>
                                    <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        value={age}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>   
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div style={interFormStyle}>
                                <span style={spanStyle}>3라운드 </span>
                                <FormControl variant="filled" sx={{ minWidth: '50%' }} style={formCtrlStyle}>
                                    <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        value={age}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>   
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default RaidWaitRoom_roominfoform;
