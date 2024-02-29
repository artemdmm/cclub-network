import React, { useState, useEffect, Component } from "react";
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Title } from 'react-native-paper';
import axios from 'axios';
import { useRoute } from "@react-navigation/native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

import FormInput from './components/FormInput';
import FormButton from './components/FormButton';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create();

const Room = () => {
    const route = useRoute()

    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState(route.params?.username);
    const [uuid, setUuid] = useState(route.params?.uuid);
    const [messages, setMessages] = useState([]);

    /**/

    useEffect(() => {
      const newSocket = new WebSocket("ws://10.0.2.2:8000/ws/" + uuid + "/");
      setSocket(newSocket);

      client.get("http://10.0.2.2:8000/room/api/getmsg/" + uuid)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          let uid = 2
          if (response.data[i].sent_by == username) {
            uid = 1
          }
          const data = {
            _id: i,
            text: response.data[i].body,
            createdAt: response.data[i].created_at,
            user: {
              _id: uid,
              name: response.data[i].sent_by,
            }
          };
          setMessages(previousMessages => GiftedChat.append(previousMessages, data));
        }
      })
      .catch((error) => {
        console.log(error);
      });

      newSocket.onopen = () => console.log("WebSocket connected");
      newSocket.onclose = () => console.log("WebSocket disconnected");

      return () => {
        newSocket.close();
      };
    }, [username]);

    useEffect(() => {
      if (socket) {
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          let uid = 2
          if (data.name == username) {
            uid = 1
          }
          const data_for_array = {
            _id: messages.length,
            text: data.message,
            createdAt: data.created_at,
            user: {
              _id: uid,
              name: data.name,
            }
          };
          setMessages(previousMessages => GiftedChat.append(previousMessages, data_for_array));
        };
      }
    }, [socket, messages]);

    const handleSubmit = (messages = []) => {
      if (messages && socket) {
        const data = {
          type: 'message',
          message: messages[0].text,
          name: username,
        };
        socket.send(JSON.stringify(data));
      }
    };

    const renderBubble = props => { 
      return ( 
        <Bubble 
          {...props} 
          textStyle={{ 
                right: { color: 'white' }, 
          }} 
          wrapperStyle={{
              right: { backgroundColor: '#674fa2', }, 
              left: { backgroundColor: '#e6e6e6', }, 
          }} 
        />
      )}

    return (
      <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={false}
          renderUsernameOnMessage={true}
          renderBubble={renderBubble}
          onSend={messages => handleSubmit(messages)}
          user={{
              _id: 1,
              name: username
          }}
      />
    );
};

export default Room;
    
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10
  },
  loginButtonLabel: {
    fontSize: 16
  },
  navButtonText: {
    fontSize: 16
  }
});