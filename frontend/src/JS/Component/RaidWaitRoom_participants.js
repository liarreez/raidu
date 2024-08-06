import { Grid } from '@mui/material';
import logo from '../../Imgs/logo.png';

const RaidWaitRoom_participants = ({ user }) => {

    // STYLE
    const compoStyle = {
        height: "23%",
        width: "100%",
        backgroundColor: "#f2f2f2",
        borderRadius: "35px",
        display: "flex",
        flex: 2.5,
        margin: "1%",
        alignItems: "center"
    }

    const profileImageStyle = {
        width: "30%",
        height: "auto",
        maxWidth: "100%",
        paddingLeft: "30%",
    } 

    const readyStateStyle = {
        backgroundColor: user.readyState ? "#96ef95" : "#ef9393",
        float: "right",
        padding: "5% 0",
        width: "85px",
        borderRadius: "35px",
        display: "flex",
        justifyContent: "center"
    }

    const thirdGridStyle = {
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        justifyContent: "space-around"
    }

    return(
        <div style={compoStyle}>
            <Grid container spacing={0} style={{ flexGrow: 1 }}>
                <Grid item xs={3}>
                    <span><img src={logo} style={profileImageStyle} alt="logoImg"/></span>             
                </Grid>
                <Grid item xs={3} style={thirdGridStyle}>
                    <span>{user.nickname}</span>
                </Grid>
                <Grid item xs={6} style={thirdGridStyle}>
                    <span>Lv.{user.level}</span>
                    <span>{user.highestScore}점</span>
                    <span style={readyStateStyle}>
                        <span>{user.readyState ? "Ready" : "Wait"}</span>    
                    </span>
                </Grid>
            </Grid>
        </div>
    );



}
export default RaidWaitRoom_participants;