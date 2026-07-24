import React, { useEffect } from 'react';
import { Alert, View } from 'react-native';
import * as Location from 'expo-location';

export default function ParkingMap() {
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Standortfreigabe deaktiviert',
          'Bitte aktiviere die Standortfreigabe, damit die Karte deinen Standort anzeigen kann.'
        );
      }
    };

    requestLocationPermission();
  }, []);

  return <View />;
}

