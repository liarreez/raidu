//=========== import libraries 
import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';

//=========== import essets
import '../../CSS/RaidWaitRoom.css';
import logo from '../../Imgs/logo.png';
import locked from '../../Imgs/lockedicon.png';
import unlocked from '../../Imgs/unlockedicon.png';
import out from '../../Imgs/roomouticon.png';

//=========== import components
import Participants from '../Component/RaidWaitRoom_participants.js';


const RaidWaitRoom = () => {
    // ========= roomName은 pathVariable로 줄 거고
    // ========= roomSet은 props로 넘기고
    // ========= isRoomLocked는 대기실에서 입장할 수 있는 모든 방이 false입니다
    // 
    const { roomName } = useParams();
    const [roomSet, setRoomSet] = useState([]);
    const [roomNamed, setRoomNamed] = useState('');
    const [isRoomLocked, setIsRoomLocked] = useState(false);
    
    class User {
        constructor(nickname, badge, profileImage, level, highestScore, readyState) {
            this.nickname = nickname; // 닉네임
            this.badge = badge; // 배지 PK
            this.profileImage = profileImage; // 프로필 이미지 src
            this.level = level; // 레벨
            this.highestScore = highestScore; // 최고기록
        }
    }
    // 이하 웹소켓으로 세팅(지금은 dummy val)
    // const [participantsList, setParticipantsList] = useState([{
    //     "nickname" : "", // 닉네임
    //     "badge" : 0, // 배지 PK
    //     "profileImage" : "", // 플필 이미지 src
    //     "level" : 0, // 레벨 
    //     "highestScore" : 0 // 최고기록
    // }]);

    const [participantsList, setParticipantsList] = useState([])
    


    useEffect(() => {
        setRoomSet([30, 3, 15]);
        setRoomNamed(roomName);
        setIsRoomLocked(false);
        setParticipantsList([
            new User("김싸피", 1, "profile1.png", 3, 320),
            new User("이싸피", 2, "profile2.png", 4, 420),
            new User("최싸피", 3, "profile3.png", 5, 520),
            new User("박싸피", 4, "profile4.png", 6, 620)
        ]);

    },[])


    return(
        <div className="container">
          {/* header */}
            <header>
                <a href='/' className="logoArea"><img src = {logo} className="logo" alt="logoImg"/></a>
                <span className="headerContent"> 
                    <img src = {isRoomLocked ? locked : unlocked} className="lock" alt={isRoomLocked ? "locked" : "unlocked"}/>
                    <span className="roomName">{roomNamed}</span>
                    <span className="roomSetting">⏱ {roomSet[0]} / 💪 {roomSet[1]} / 💤 {roomSet[2]} </span>
                </span>
            </header>
          {/* 컨테이너 박스 */}
            <Grid container spacing={0} style={{ flexGrow: 1 }}>
                
                {/* 왼쪽 컨테이너 */}
                <Grid item xs={5} md={5} className='gridItems'>
                    <Grid container direction="column" spacing={1} className="subGridContainer" style={{ height: '100%' }}>
                        <Grid item xs={8} className='subGridItems'>
                            <div className='subGridItemsDiv' id="participantsList">
                                {
                                    // participantsList.map((each) => {
                                    //     <Participants user={each}/>
                                    // })

                                    // map 하다가 퇴근함. map 할때는 왜 props가 전달이 안 되는 거지?    
                                }

                                {
                                    participantsList.map((each, index) => (
                                    <Participants key={index} user={each} />
                                    ))

                                    // HTML을 리턴하도록 map을 쓰려면 함수 파트를 {}로 쓰지 말고
                                    // ()로 감싸야 작동함! 
                                }
                            </div>
                        </Grid>
                        <Grid item xs={4} className='subGridItems'>
                            <div className='subGridItemsDiv'>
                                왼쪽 하단 컴포넌트
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 오른쪽 컨테이너 */}
                <Grid item xs={7} md={7} className='gridItems'>
                    <Grid container direction="column" spacing={1} className="subGridContainer" style={{ height: '100%' }}>
                        <Grid item xs={10} className='subGridItems'>
                            <div className='subGridItemsDiv'>
                            오른쪽 상단 컴포넌트
                            </div>
                        </Grid>
                        <Grid item xs={2} className='subGridItems'>
                            <Grid container spacing={1} style={{ height: '100%' }}>
                                <Grid item xs={5}>
                                    <div className='startButton'>
                                        <span className='buttonText'>시작하기</span>
                                    </div>
                                </Grid>

                                {/* 방장인지 아닌지에 따라 다른 컴포 출력 
                                
                                    isLeader ? <span classname='buttonText' onClick={start}>시작하기</span>
                                    : <span className='buttonText' onClick={ready}>준비하기</span>
                                
                                    onClick은 Grid 자체에 주면 되고, 준비하기 버튼은 토글처럼 동작해야 함
                                    준비하기 버튼 눌리고 나면 setReady(true)가 되는데, 이 상태인 동안에는 button color가 hover 시와 똑같도록 설정
                                */}
                                <Grid item xs={5}>
                                    <div className='shareButton'>
                                        <span className='buttonText'>링크 공유</span>
                                    </div>
                                </Grid>
                                <Grid item xs={2}>
                                    <div className="outarea"> 
                                        <a href='/'>
                                            <img src={out} alt="way out" className="out"/>
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