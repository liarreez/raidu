import { Grid } from '@mui/material';
import logo from '../../Imgs/logo.png';

const RaidWaitRoom_participants = ({ user }) => {

    const compoStyle = {
        height: "23%",
        width: "100%",
        backgroundColor: "#f2f2f2",
        borderRadius: "35px",
        display: "flex",
        flex: 2.5,
        margin: "1%"

    }

    const profileImageStyle = {
        width: "30%",
        height: "auto",
        maxWidth: "100%",
        paddingLeft: "30%",
        paddingTop: "18%"

    }

    const readyStateStyle = {
        backgroundColor: "#96ef95",
        float: "right",
        padding: "5% 10%",
        borderRadius: "35px",
        marginTop: "8%",
        marginRight: "8%",
    }

    const readyStateContentStyle = { 
        fontWeight: "bold"


    }

    return(
        <div style={compoStyle}>
            <Grid container spacing={0} style={{ flexGrow: 1 }}>
                <Grid item xs={3}>
                    <span><img src={logo} style={profileImageStyle}/></span>             
                </Grid>
                <Grid item xs={4}>
                    <span>{user.nickname}</span>
                </Grid>
                <Grid item xs={5}>
                    <span>Lv.{user.level}</span>
                    <span>{user.highestScore}점</span>
                    <span style={readyStateStyle}>
                        <span style={readyStateContentStyle}>Ready</span>    
                    </span>
                </Grid>
            </Grid>

            
        </div>

    );



}
export default RaidWaitRoom_participants;