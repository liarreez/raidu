import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Paper, Typography, bottomNavigationActionClasses} from '@mui/material';
import { styled } from '@mui/material/styles';

import '../../CSS/Chatting.css';

// STRUCTURE ======================================

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
    backgroundColor: 'white',
    height: '130px',
    padding: '10px',
};

// const chatAreaStyle = {
//     flexGrow: 1,
//     overflowY: 'auto',
//     padding: '10px',
//     backgroundColor: '#f0f0f0',
//     // height: '10px', // 말도 안 되는 값을 준다(flexGrow가 있기 때문에 알아서 들어감)
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'flex-end', // right-side
//     borderRadius: '25px'
// };

const chatAreaStyle = (isFocused) => ({
    width: "100%",
    margin: 'auto',
    overflowY: 'scroll', // 스크롤을 가능하게 설정
    padding: '10px',
    backgroundColor: '#F6F6F6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    borderRadius: '10px',
    height: isFocused ? '300px' : '100px', // Adjust height on focus
    transition: 'height 0.3s ease-in-out', // Smooth transition for height change
    position: isFocused ? 'relative' : 'static', // Relative positioning to overlay other elements
    bottom: isFocused ? '200px' : 'auto', // Apply bottom only when focused
    zIndex: 10, // Ensure it's above other content
});

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
    flex: 2,
};

// Btn hover / no-hover style
const sendBtnStyle = {
    marginLeft: '10px', 
    backgroundColor: "#12d20e", 
    color: 'white',
    fontWeight: 'bold',
    fontFamily: "inherit",
    height: '100px',
    width: "80px"
}

const sendBtnHoverStyle = {
    ...sendBtnStyle, 
    backgroundColor: "#12D20E", 
}

const textFieldStyle = {
    flex: 1
}

const timestampStyle = {
    color: '#707070',
    fontSize: '0.75rem'

}

const typographyStyle = (TF) => {
    const val = TF ? 'right' : 'left';
    return ({textAlign: val})
}

const RaidWaitRoom_chatting = ({me, chatMessages, sendTest3}) => {
    // const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    // hover(mouseEnter / mouseLeave) 이벤트 여부
    const [isHover, setIsHover] = useState(false); // button hover 이벤트를 케어한다.
    const [isFocused, setIsFocused] = useState(false);

    // hover event care 
    const handleBtnHover = (num) => {
        num == 0 ? setIsHover(true) : setIsHover(false)
    }

    // 메시지 보내기
    const handleSendMessage = () => {
        if (input.trim()) {
        sendTest3(input)
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
    }, [chatMessages]);

    return (
        <div style={contItemStyle}>
            <div style={{display: 'flex', justifyContent: 'end', flex: 3, height: '100%', position: 'relative'}}>
            <div style={chatAreaStyle(isFocused)}>
                {chatMessages.map((msg, index) => (
                <Paper
                    key={index}
                    style={msg.user === me.nickname ? myMessageStyle : otherMessageStyle}
                >
                    <Typography style={msg.user === me.nickname ? typographyStyle(true) : typographyStyle(false)}><b>{msg.user}</b>  <span style={timestampStyle}>{msg.timestamp}</span>
                        <br/>
                        {msg.body}
                    </Typography>
                </Paper>
                ))}
                <div ref={chatEndRef}/>
            </div>
            </div>

            <div style={inputAreaStyle}>
                <CustomTextField
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={textFieldStyle}
                    variant="outlined"
                    placeholder="채팅을 입력해 보세요!"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    sx={{
                        '& .MuiInputBase-input': {
                          height: '100px', // 입력 필드의 높이를 300px로 설정
                          boxSizing: 'border-box', // 패딩 및 보더 포함
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderRadius: '4px', // 필요에 따라 테두리 반경 설정
                          },
                        },
                      }}
                />
                <Button variant="contained" onClick={handleSendMessage} onMouseEnter={() => handleBtnHover(0)} onMouseLeave={() => handleBtnHover(1)} style={ isHover ? sendBtnHoverStyle : sendBtnStyle } sx={{transition: "0.3s ease-in-out"}}>
                    채팅창 접기
                </Button>
            </div>
        </div>
    );
};

export default RaidWaitRoom_chatting;