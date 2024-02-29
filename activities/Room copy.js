import React, { useState, useEffect, Component } from "react";
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Title } from 'react-native-paper';
import axios from 'axios';
import { useRoute } from "@react-navigation/native";
import { GiftedChat } from 'react-native-gifted-chat';

import FormInput from './components/FormInput';
import FormButton from './components/FormButton';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create();

const Roomcopy = () => {
    const route = useRoute()

    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState(route.params?.username);
    const [uuid, setUuid] = useState(route.params?.uuid);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    /**/

    useEffect(() => {
      const newSocket = new WebSocket("ws://10.0.2.2:8000/ws/" + uuid + "/");
      setSocket(newSocket);

      client.get("http://10.0.2.2:8000/room/api/getmsg/" + uuid)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          const data = {
            "agent": "",
            "created_at": response.data[i].created_at,
            "initials": Array.from(response.data[i].sent_by)[0].toUpperCase(),
            "message": response.data[i].body,
            "name": response.data[i].sent_by,
            "type": "chat_message"
          };
          setMessages((prevMessages) => [...prevMessages, data]);
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
          const data = JSON.parse(event.data);
          console.log(data);
          setMessages((prevMessages) => [...prevMessages, data]);
        };
      }
    }, [socket]);

    const handleSubmit = (event) => {
      event.preventDefault();
      if (message && socket) {
        const data = {
          type: 'message',
          message: message,
          name: username,
        };
        socket.send(JSON.stringify(data));
        setMessage("");
      }
    };

    return (
      <View className="chat-container" style={styles.container}>
        <Text className="chat-header">Chat</Text>
        <View className="message-container">
          {messages.map((message, index) => (
            <View key={index} className="message">
              <Text className="message-created_at">{message.created_at}</Text>
              <Text className="message-name">{message.name}:</Text>
              <Text className="message-message">{message.message}</Text>
            </View>
          ))}
        </View>
          <FormInput
              labelName='Message'
              value={message}
              onChangeText={(msg) => setMessage(msg)}
          />
          <FormButton
              title='Send'
              modeValue='contained'
              labelStyle={styles.loginButtonLabel}
              onPress={(e) => { handleSubmit(e)}}
          />
      </View>
    );
};

export default Roomcopy;
    
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