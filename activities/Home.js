import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import axios from 'axios';
import { Title } from 'react-native-paper';

import Rooms from './Rooms';
import FormButton from './components/FormButton';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://10.0.2.2:8000"
});

const Home = ({ navigation }) => {
    const [currentUser, setCurrentUser] = useState();
    const [currentPerm, setCurrentPerm] = useState();
    const [username, setUsername] = useState();
    const [uuid, setUuid] = useState();
    useEffect(() => {
        navigation.addListener('focus', async ()=>{
            await client.get("/api/getpermissions")
            .then((response) => {
              setCurrentUser(true);
              setCurrentPerm(response.data.permissions);
              setUsername(response.data.username);
              setUuid(response.data.uuid);
            })
            .catch((error) => {
              setCurrentUser(false);
            });
        })
    });

    function openRoom(e) {
        e.preventDefault();
        navigation.navigate("Room", { uuid: uuid, username: username })
    }

    if (!currentUser) {
        return (
            <View style={styles.container}>
                <Title style={styles.titleText}>Войдите, пожалуйста</Title>
            </View>
        );
    }
    else {
        if (currentPerm) {
            return (
                <View style={styles.container}>
                    <Title style={styles.titleText}>Связь с клиентами реализована через серверное приложение</Title>
                </View>
            );
        }
        else {
            return (
                <View style={styles.container}>
                    <Title style={styles.titleText}>Связаться с работником</Title>
                    <FormButton
                        title='Открыть чат'
                        modeValue='contained'
                        labelStyle={styles.loginButtonLabel}
                        onPress={(e) => { openRoom(e)}}
                    />
                </View>
            );
        }
    }
};

export default Home;

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
    }
});