import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import axios from 'axios';
import { Title } from 'react-native-paper';

import FormInput from './components/FormInput';
import FormButton from './components/FormButton';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://10.0.2.2:8000"
});

export default function Login({ navigation }) {
    const [currentUser, setCurrentUser] = useState();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
      client.get("/api/getuser")
      .then((response) => {
        setCurrentUser(true);
        setUsername(response.data.username);
      })
      .catch((error) => {
        setCurrentUser(false);
      });
    }, []);

    function submitLogin(e) {
        e.preventDefault();
        client.post(
          "/api/login",
          {
            username: username,
            password: password
          }
        ).then(function(res) {
          setCurrentUser(true);
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
      }

    function submitLogout(e) {
        e.preventDefault();
        client.post(
          "/api/logout",
          {withCredentials: true}
        ).then(function(res) {
          setCurrentUser(false);
          setUsername('');
          setPassword('');
        });
      }

    if (currentUser) {
        return (
            <View style={styles.container}>
                <Title style={styles.titleText}>Добро пожаловать, {username}</Title>
                <FormButton
                    title='Выйти'
                    modeValue='contained'
                    labelStyle={styles.loginButtonLabel}
                    onPress={(e) => { submitLogout(e)}}
                />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Title style={styles.titleText}>Вход</Title>
            <FormInput
                labelName='Логин'
                value={username}
                autoCapitalize='none'
                onChangeText={userLogin => setUsername(userLogin)}
            />
            <FormInput
                labelName='Пароль'
                value={password}
                secureTextEntry={true}
                onChangeText={userPassword => setPassword(userPassword)}
            />
            <FormButton
                title='Войти'
                modeValue='contained'
                labelStyle={styles.loginButtonLabel}
                onPress={(e) => { submitLogin(e)}}
            />
        </View>
    );
}
    
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
      fontSize: 22
    },
    navButtonText: {
      fontSize: 16
    }
});