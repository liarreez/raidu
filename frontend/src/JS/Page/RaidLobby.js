import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
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

    const SERVER_URL = 'http://localhost:8080';
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        axios.get(SERVER_URL+'/api/raidu/rooms',{
            headers: {
                'Authorization': `Bearer ${token}` // Bearer 토큰을 사용하는 경우
            }
        }).then(res => setRoomList(res.data.data.waitingRoomList));
    },[])
    
    return (
        <div>
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
                    
                </Grid>
                <Grid item xs={1} style={{height: '100vh', backgroundColor: 'orange'}}>
                    
                </Grid>
                <Grid item xs={6} style={{height: '100vh', backgroundColor: 'yellow'}}>

                </Grid> 
                <Grid item xs={5} style={{height: '100vh', backgroundColor: 'skyblue'}}>

                </Grid> 
            </Grid>
        </div>
    );

}

export default RaidLobby;