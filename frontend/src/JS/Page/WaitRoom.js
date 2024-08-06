import React, { useEffect, useState } from 'react';
import { Socketest } from '../Component/Socketest';
import { useParams } from 'react-router-dom';

function Home() {
  const { roomNo } = useParams();
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [websocketClient, setWebsocketClient] = useState(null);
  const [sender, setSender] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const client = new Socketest(roomNo);
    setWebsocketClient(client);

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [roomNo]);

  useEffect(() => {
    if (!websocketClient) return;

    const connectWebSocket = async () => {
      try {
        const message = JSON.stringify({
            // channelId: channel,
            // body: messageContent,
            // sender: roomNo
            channelId: roomNo,
            body : "entered",
            sender,
            timestamp: getCurrentFormattedTime()
          });
         
        await websocketClient.connect('/pub/message', message);
        console.log('STOMP connected');

        const subscription = websocketClient.subscribe('/sub/message/' + roomNo, (message) => {
          const parsedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        });

        return () => {
          if (subscription) subscription.unsubscribe();
          websocketClient.disconnect();
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (websocketClient) {
        websocketClient.disconnect();
      }
    };
  }, [websocketClient, roomNo]);

  const sendMessage = () => {
    if (websocketClient) {
      const message = JSON.stringify({
        // channelId: channel,
        // body: messageContent,
        // sender: roomNo
        channelId: roomNo,
        body : messageContent,
        sender,
        timestamp: getCurrentFormattedTime()
      });
      websocketClient.send('/pub/message', message);
      setMessageContent('');
    }
  };

  const handleChannelChange = (e) => {
    setChannel(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessageContent(e.target.value);
  };

  const handleSenderChange = (e) => {
    setSender(e.target.value);
  }

  // 현재 시간을 포맷팅하는 함수
function getCurrentFormattedTime() {
    const now = new Date();
  
    // 날짜와 시간을 포맷팅하는 보조 함수
    const pad = (num) => num.toString().padStart(2, '0');
  
    // 년, 월, 일, 시, 분, 초를 추출하여 포맷합니다.
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1); // 월은 0부터 시작하므로 +1
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
  
    // 원하는 포맷으로 문자열을 조합합니다.
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const enterDown = (e) => {
    if(e.key==="Enter"){
      sendMessage();
    }
  }

  const sendEnterAlert = () => {
    if (websocketClient) {
      const message = JSON.stringify({
        channelId: roomNo,
        body : sender+"님 입장",
        sender,
        timestamp: getCurrentFormattedTime()
      });
      websocketClient.send('/pub/message', message);
      setMessageContent('');
    }
  }

  const roomNameStyle = {
    color: '#fcba03'
  }

  const sharedWidth = {
    width: '200px'
  }

  const handleReadyState = () => {
    setReady(!ready); //toggle
  }

  useEffect(() => { // 에휴 ; 
    if(ready){
      const message = JSON.stringify({
        channelId: roomNo,
        readyState: ready, // true가 들어감.
        sender,
        timestamp: getCurrentFormattedTime()
      });
      websocketClient.send('/pub/ready', message);
    }
  },[ready])

  return (
    <div>
      <h1>Room <span style={roomNameStyle}>{roomNo}</span></h1>
      {/* <input 
        type='text' 
        placeholder='채널 입력' 
        value={channel} 
        onChange={handleChannelChange}
      /> */}
      <input type='text'
        style = {sharedWidth}
        placeholder='닉네임 입력'
        value = {sender}
        onChange = {handleSenderChange}
      // onBlur = {sendEnterAlert}
      /><br/>
      <textarea 
        style = {sharedWidth}
        rows='10' 
        cols='10' 
        placeholder='메시지 입력' 
        value={messageContent} 
        onChange={handleMessageChange}
        onKeyDown={enterDown}
      />
      <button onClick={handleReadyState}>{ready ? '준비 취소' : '준비'}</button>
      <button onClick={sendMessage}>보내기</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <div>
                
                <p>
                    {msg.sender} : 
                    {msg.body}
                </p>
                {msg.timestamp}
            </div>    
        </li> 
        ))}
      </ul>
    </div>
  );
}

export default Home;
