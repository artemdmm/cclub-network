import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const INITIAL_REGION = {
    latitude: 58.00,
    longitude: 56.15,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
}

export default function Map({ navigation }) {
    const [location , setLocation]= useState(null);
    const [errorMsg , setErrorMsg]= useState(null);
    const mapView = React.createRef();

    useEffect( () => {
        (async() => {
          let {status}= await Location.requestForegroundPermissionsAsync();
          if(status !=='granted')
          {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          let location= await Location.getCurrentPositionAsync({});
          setLocation(location);
        })();
    
    },[]);

    return (
        <View style={styles.container}>
            <MapView 
                style={styles.map}
                provider={MapView.PROVIDER_GOOGLE}
                initialRegion={INITIAL_REGION}
                showsUserLocation={true}
                showsMyLocationButton={true}
                ref={mapView}
            />
        </View>
    );
}
    
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
});