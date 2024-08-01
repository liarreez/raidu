// src/Socketest.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

 const SOCKET_URL = 'http://localhost:8080/ws'; // 백서버 포트 넣기

export class Socketest {
  constructor(UserIdVal) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      connectHeaders: {
        UserId: UserIdVal
      },
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      onConnect: (destination, body) => {
        console.log('Connected to WebSocket');
        this.isConnected = true; // Set connected status to true
        this.client.publish({ destination, body });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        this.isConnected = false; // Set connected status to false
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.activate();

      this.client.onConnect = () => {
        this.isConnected = true;
        resolve();
      };

      this.client.onDisconnect = () => {
        this.isConnected = false;
      };

      this.client.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        reject(new Error('STOMP error: ' + frame.body));
      };
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }
  }

  subscribe(destination, callback) {
    if (this.isConnected) {
      console.log("LISTENING ...", destination);
      return this.client.subscribe(destination, callback);
    } else {
      throw new Error('No active STOMP connection');
    }
  }

  send(destination, body) {
    if (this.isConnected) {
      console.log("PUBLISHING ...", destination);
      this.client.publish({ destination, body });
    } else {
      throw new Error('No active STOMP connection');
    }
  }
}
