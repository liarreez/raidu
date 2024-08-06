import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Paper, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';

// STRUCTURE ======================================
class Message {
    // 메시지 구성 요소
    // 보낸 사람, 채널명(방 이름), 메시지 내용, 보낸 시각
    constructor(sender, channel, body){
        this.sender = sender;
        this.channel = channel;
        this.body = body;
        this.timestamp = getTime();
    }
}

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
}

// STYLE ===========================================
// customized textField
const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
        borderColor: 'black', // default
        },
        '&:hover fieldset': {
        borderColor: '#12D20E', // hover 
        },
        '&.Mui-focused fieldset': {
        borderColor: '#12D20E', // onFocus
        },
    },
});

const contItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    height: '100%',
    padding: '10px',
};

const chatAreaStyle = {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    height: '10px', // 말도 안 되는 값을 준다(flexGrow가 있기 때문에 알아서 들어감)
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end', // right-side
    borderRadius: '25px'
};

const messageStyle = {
    maxWidth: '80%', // 메시지의 최대 너비를 설정
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '10px',
};

const myMessageStyle = {
    ...messageStyle,
    backgroundColor: '#dcf8c6', // 보낸 메시지의 배경색
    alignSelf: 'flex-end', 
};

const otherMessageStyle = {
    ...messageStyle,
    backgroundColor: '#ffffff', // 다른 사람의 메시지 배경색
    alignSelf: 'flex-start'
};

const inputAreaStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#fff',
};

// Btn hover / no-hover style
const sendBtnStyle = {
    marginLeft: '10px', 
    backgroundColor: "#96ef95", 
    color: 'black',
    fontWeight: 'bold',
    height: '100%'
}

const sendBtnHoverStyle = {
    ...sendBtnStyle, 
    backgroundColor: "#12D20E", 
}

const textFieldStyle = {
    minWidth: '84%'
}

const timestampStyle = {
    color: '#707070',
    fontSize: '0.75rem'

}

const typographyStyle = (TF) => {
    const val = TF ? 'right' : 'left';
    return ({textAlign: val})
}

const RaidWaitRoom_chatting = ({me, roomName}) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    // hover(mouseEnter / mouseLeave) 이벤트 여부
    const [isHover, setIsHover] = useState(false); // button hover 이벤트를 케어한다.

    // hover event care 
    const handleBtnHover = (num) => {
        num == 0 ? setIsHover(true) : setIsHover(false)
    }

    // 메시지 보내기
    const handleSendMessage = () => {
        if (input.trim()) {
        setMessages([...messages, new Message(me.nickname, roomName, input)]);
        setInput('');
        }
    };

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
        event.preventDefault();
        handleSendMessage();
        }
    };

    // messages가 업데이트될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={contItemStyle}>
            <div style={chatAreaStyle}>
                {messages.map((msg, index) => (
                <Paper
                    key={index}
                    style={msg.sender === me.nickname ? myMessageStyle : otherMessageStyle}
                >
                    <Typography style={msg.sender === me.nickname ? typographyStyle(true) : typographyStyle(false)}><b>{msg.sender}</b>  <span style={timestampStyle}>{msg.timestamp}</span>
                        <br/>
                        {msg.body}
                    </Typography>
                </Paper>
                ))}
                <div ref={chatEndRef}/>
            </div>
            <div style={inputAreaStyle}>
                <CustomTextField
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={textFieldStyle}
                    variant="outlined"
                    placeholder="채팅을 입력해 보세요!"
                />
                <Button variant="contained" onClick={handleSendMessage} onMouseEnter={() => handleBtnHover(0)} onMouseLeave={() => handleBtnHover(1)} style={ isHover ? sendBtnHoverStyle : sendBtnStyle }>
                    보내기
                </Button>
            </div>
        </div>
    );
};

export default RaidWaitRoom_chatting;