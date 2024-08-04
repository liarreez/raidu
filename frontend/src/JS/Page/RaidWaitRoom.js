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
import RoomInfoForm from '../Component/RaidWaitRoom_roominfoform.js';

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

const RaidWaitRoom = () => {
    // ========= roomName은 pathVariable로 줄 거고
    // ========= roomSet은 props로 넘기고
    // ========= isRoomLocked는 대기실에서 입장할 수 있는 모든 방이 false입니다
    // 
    const { roomName } = useParams(); // 꼭 방의 제목일 필요 없다. PK 받아서 숫자로 지정할 것임
    const [roomSet, setRoomSet] = useState(new Room(0, 0, 0)); // roomSet은 객체임.
    // const [roomSet, setRoomSet] = useState()로 두게 되면 undefined 오류가 나므로
    // 초깃값을 임의의 어떤 값으로 채워주는 것이 좋다. DOM 로드 후 -> useEffect 실행되기 때문
    const [roomNamed, setRoomNamed] = useState(''); 
    const [isRoomLocked, setIsRoomLocked] = useState(false);
    
   
    // room setting은 방장만 바꿀 수 있으므로 유의하여 컴포에 props 넘길 것 ㅜ 
    // room setting과 me.isCaptain을 컴포에 넘겨야 할 것 같음

    const [participantsList, setParticipantsList] = useState([])
    
    // 방 제목 수정하는 방법
    // 상단 흰색 제목이 있는 영역을 클릭하면 수정할 수 있다.
    // 모달로 띄울지 아니면 동적으로 입력하도록 만들지(제목 지우고 input 넣고 버튼 띄우기)는 생각 중임
    // 아마 후자 될 것

    const me = new User("김아무거나길고이상한거", 1, "profile1.png", 572, 15600, false, true);
    // 얘 redux로 넘겨 버릴까

    useEffect(() => {
        setRoomSet(
            new Room(40, 15, 3)
        );
        setRoomNamed(roomName); // 방 이름 변경 가능하게 하려면 이 부분 수정해야 함. 지금은 pathVal에서 가져온다
        setIsRoomLocked(false);
        setParticipantsList([
            me,
            new User("이싸피", 2, "profile2.png", 4, 420, true, false),
            new User("최싸피", 3, "profile3.png", 5, 520, false, false),
            new User("박싸피", 4, "profile4.png", 6, 620, true, false)
        ]);
        console.log(roomSet)

    },[]) // onMount 

    useEffect(() => {
        console.log(roomSet)
    },[roomSet])

    // 운동 set은 하위 컴포넌트에서 넘어와야 하는 값임 
    // 레디를 눌렀을 때 disabled되며, 게임이 시작하면 서버로 넘어간다



    return(
        <div className="container">
          {/* header */}
            <header>
                <a href='/' className="logoArea"><img src = {logo} className="logo" alt="logoImg"/></a>
                <span className="headerContent"> 
                    <img src = {isRoomLocked ? locked : unlocked} className="lock" alt={isRoomLocked ? "locked" : "unlocked"}/>
                    <span className="roomName">{roomNamed}</span>
                    <span className="roomSetting">⏱ {roomSet.roundTime} / 💪 {roomSet.roundCount} / 💤 {roomSet.restTime} </span>
                    {
                        console.log(`DOM load : ${roomSet.roundTime} / ${roomSet.roundCount} / ${roomSet.restTime}`)
                        
                    }
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
                                    participantsList.map((each, index) => (
                                    <Participants key={index} user={each} />
                                    ))
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
                                <RoomInfoForm roomSet={roomSet} isCaptain={me.isCaptain} />
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