import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, Text } from 'react-native-paper';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://10.0.2.2:8000"
});

const Rooms = () => {
    const [rooms, setRooms] = useState();
    useEffect(() => {
      getRooms();
    }, []);

    const getRooms = () => {
        client.get("/room/api/rooms")
            .then((response) => {
              setRooms(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
    }

    return (
        <View style={styles.container}>
            <FlatList data={rooms} renderItem={({ item })=>
                <Title style={styles.titleText}>{item.uuid}: {item.client} - {item.status}</Title>
            }/>
        </View>
    );
}

export default Rooms;
    
const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f5f5',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    titleText: {
      fontSize: 21,
      marginBottom: 5,
      padding: 5
    }
});