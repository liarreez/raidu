import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
 
//=========== import essets
import '../../CSS/RaidLobby.css';

//=========== import components
import TopNav from "../Component/TopNav";

const RaidLobby = () => {

    // ================== LOBBY ===================
    /*
        1. 서버로부터 상태가 'waiting'인 룸 리스트를 받아오세요
        2. 동적으로 룸 리스트를 뿌리되, a href를 걸어서 raid/ROOMNAME으로 이동할 수 있도록 해주세요
        3. 받아온 룸 리스트를 자체적으로 페이징 처리 합시다(FE도 가능!)
        4. 룸이 새로 생기거나 없어지거나 하면 자동으로 업데이트되진 않(이건 웹 소켓을 써야 가능)고, 지금은 유저가 새로고침을 해야 가능해요
    */

    const [roomList, setRoomList] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [me, setMe] = useState(null);

    const SERVER_URL = 'http://localhost:8080';
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        axios.get(SERVER_URL+'/api/raidu/rooms',{
            headers: {
                'Authorization': `Bearer ${token}` // Bearer 토큰을 사용하는 경우
            }
        }).then(res => setRoomList(res.data.data.waitingRoomList)
        ).then(
            axios.get(SERVER_URL+'/api/raidu/userpage', {
                headers: {
                    'Authorization': `Bearer ${token}` // Bearer 토큰을 사용하는 경우
                }
            }).then((res) => setMe(res.data.data.userProfile))
        )
    },[]);

    useEffect(() => {
        console.log(roomList)
        roomList.map((each) => {
            console.log(each.title)
        })
    },[roomList]);

    const navigate = useNavigate();

    const changeLocation = (e, id) => { // 방 눌렀을 때 해당 방으로 이동
        navigate("/raid/"+id);
        
    };
    
    const openModal = () => {
        // 방 만들기 modal 출현
        // form 작성해서 submit 
        // axios도 들어가 있어야 함
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        borderRadius: '35px',
        boxShadow: 24,
        p: 4,
    };

    // modal val
    const [title, setTitle] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(0);
    const [roundTime, setRoundTime] = useState(0);
    const [restTime, setRestTime] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [isPublic, setIsPublic] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') setTitle(value);
        else if (name === 'maxParticipants') setMaxParticipants(value);
        else if (name === 'roundTime') setRoundTime(value);
        else if (name === 'restTime') setRestTime(value);
        else if (name === 'totalRounds') setTotalRounds(value);
        else if (name === 'isPublic'){
            console.log(!e.target.checked);
            setIsPublic(!e.target.checked);
        }
    };
    
    const clearVals = () => {
        setMaxParticipants(0);
        setRoundTime(0);
        setRestTime(0);
        setTotalRounds(0);
        setIsPublic(true);
        setTitle('');
        closeModal();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Prepare the payload with additional fields
        const payload = {
            title,
            maxParticipants,
            roundTime,
            restTime,
            totalRounds,
            isPublic,
            hostEmail: me.email
        };
    
        try {
          // 방 만들고 그 방으로 들어가기
            const response = await axios.post(SERVER_URL+'/api/raidu/rooms', payload, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Bearer 토큰을 사용하는 경우
                }
            });
                // console.log('Response:', response.data.data.roomId);
                navigate("/raid/"+response.data.data.roomId, {
                        state : {
                            isCaptain: true
                        } // 방을 만들고 들어가면 무조건 방장입니다.
                });
                // Handle successful response
            } catch (error) {
                console.error('Error:', error);
                // Handle error response
            }
    };

    return (
        <div className="raidLobby-html">
            <TopNav/> 
            {/* 
                header에 씌워져 있는 style이 있나 봐요 ... 
                header 태그를 적용하면 스타일이 씌워지는데 
                추측하기에는 RaidWaitRoom.css에 있는 
                header가 적용된 게 아닌가 싶은데
                import도 안 한 게 왜 넘어왔는지 모르겠어요
            */}

            <Grid container direction='column' spacing={1} style={{ height: 'calc(100vh - 64px)', flexGrow: 1 }}>
                <Grid item xs={1} style={{height: '100vh', backgroundColor: 'red'}}>
                    <button onClick={openModal}>방 만들기</button>
                </Grid>
                <Grid item xs={1} style={{height: '100vh', backgroundColor: 'orange'}}>
                    
                </Grid>
                <Grid item xs={6} style={{height: '100vh', backgroundColor: 'yellow'}}>
                    {
                        roomList.map((each, index) => (

                            <p onClick={(e) => changeLocation(e, each.id)}>
                                {each.title}
                            </p>
                        ))
                    }
                </Grid> 
                <Grid item xs={5} style={{height: '100vh', backgroundColor: 'skyblue'}}>

                </Grid> 
            </Grid>

            <Modal
                open={modalOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        방 만들기
                    </Typography>
                    
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="title">방 제목:</label>
                            <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="maxParticipants">인원:</label>
                            <select
                            id="maxParticipants"
                            name="maxParticipants"
                            value={maxParticipants}
                            onChange={handleChange}
                            >
                            <option value="1">1인</option>
                            <option value="2">2인</option>
                            <option value="3">3인</option>
                            <option value="4">4인</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="roundTime">세트별 시간 (초):</label>
                            <select
                            id="roundTime"
                            name="roundTime"
                            value={roundTime}
                            onChange={handleChange}
                            >
                            {[...Array(10).keys()].map(i => (
                                <option key={i} value={(i + 1) * 15}>
                                {(i + 1) * 15}
                                </option>
                            ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="restTime">휴식 시간 (초):</label>
                            <select
                            id="restTime"
                            name="restTime"
                            value={restTime}
                            onChange={handleChange}
                            >
                            {[...Array(10).keys()].map(i => (
                                <option key={i} value={(i + 1) * 15}>
                                {(i + 1) * 15}
                                </option>
                            ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="totalRounds">세트 수:</label>
                            <select
                            id="totalRounds"
                            name="totalRounds"
                            value={totalRounds}
                            onChange={handleChange}
                            >
                            <option value="1">1세트</option>
                            <option value="2">2세트</option>
                            <option value="3">3세트</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="isPublic">비밀방 여부:</label>
                            <input
                            type="checkbox"
                            id="isPublic"
                            name="isPublic"
                            onChange={handleChange}
                            />
                        </div>

                        <button type="button" onClick={clearVals}>취소</button>
                        <button type="submit">만들기</button>
                    </form>
                </Box>
            </Modal>
        </div>
    );

}

export default RaidLobby;