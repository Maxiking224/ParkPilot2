import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, {
  Marker,
  Region,
  UserLocationChangeEvent,
} from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

type UserPosition = {
  latitude: number;
  longitude: number;
};

const DEFAULT_REGION: Region = {
  latitude: 52.52,
  longitude: 13.405,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export default function ExploreScreen() {
  const mapRef = useRef<MapView>(null);

  const [userPosition, setUserPosition] =
    useState<UserPosition | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [locationError, setLocationError] =
    useState<string | null>(null);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  async function loadCurrentLocation() {
    try {
      setIsLoading(true);
      setLocationError(null);

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setLocationError(
          'Der Standortzugriff wurde nicht erlaubt. Aktiviere ihn bitte in den Einstellungen deines Handys.'
        );

        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const position = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setUserPosition(position);

      moveMapToPosition(position);
    } catch (error) {
      console.error('Standort konnte nicht geladen werden:', error);

      setLocationError(
        'Dein Standort konnte nicht ermittelt werden. Prüfe bitte, ob GPS aktiviert ist.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  function moveMapToPosition(position: UserPosition) {
    mapRef.current?.animateToRegion(
      {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      800
    );
  }

  function centerMapOnUser() {
    if (!userPosition) {
      loadCurrentLocation();
      return;
    }

    moveMapToPosition(userPosition);
  }

  function handleUserLocationChange(
    event: UserLocationChangeEvent
  ) {
    const coordinates = event.nativeEvent.coordinate;

    if (!coordinates) {
      return;
    }

    setUserPosition({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={DEFAULT_REGION}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          toolbarEnabled={false}
          onUserLocationChange={handleUserLocationChange}
        >
          {userPosition && (
            <Marker
              coordinate={userPosition}
              title="Dein Standort"
              description="Du befindest dich hier"
            >
              <View style={styles.userMarkerOuter}>
                <View style={styles.userMarkerInner} />
              </View>
            </Marker>
          )}
        </MapView>

        {/* Oberer Bereich */}
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#17324D"
            />
          </Pressable>

          <View style={styles.titleCard}>
            <Text style={styles.title}>Parkplätze</Text>

            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>
                Standort aktiv
              </Text>
            </View>
          </View>
        </View>

        {/* Ladeanzeige */}
        {isLoading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="small"
              color="#276EF1"
            />

            <View style={styles.loadingTextContainer}>
              <Text style={styles.loadingTitle}>
                Standort wird gesucht
              </Text>

              <Text style={styles.loadingText}>
                Einen Moment bitte …
              </Text>
            </View>
          </View>
        )}

        {/* Fehlermeldung */}
        {!isLoading && locationError && (
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Ionicons
                name="location-outline"
                size={24}
                color="#DC2626"
              />
            </View>

            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>
                Standort nicht verfügbar
              </Text>

              <Text style={styles.errorText}>
                {locationError}
              </Text>

              <Pressable
                style={styles.retryButton}
                onPress={loadCurrentLocation}
              >
                <Text style={styles.retryButtonText}>
                  Erneut versuchen
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Eigener-Standort-Button */}
        <Pressable
          style={({ pressed }) => [
            styles.locationButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={centerMapOnUser}
        >
          <Ionicons
            name="locate"
            size={25}
            color="#276EF1"
          />
        </Pressable>

        {/* Untere Informationskarte */}
        <View style={styles.bottomCard}>
          <View style={styles.bottomCardIcon}>
            <Ionicons
              name="navigate"
              size={24}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.bottomCardContent}>
            <Text style={styles.bottomCardLabel}>
              DEIN STANDORT
            </Text>

            <Text style={styles.bottomCardTitle}>
              Aktuelle Position
            </Text>

            <Text style={styles.bottomCardText}>
              Die Karte folgt deinem Standort und zeigt
              deine aktuelle Position.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },

  container: {
    flex: 1,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  topBar: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#FFFFFF',

    shadowColor: '#102A43',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.14,
    shadowRadius: 12,

    elevation: 5,
  },

  titleCard: {
    flex: 1,
    minHeight: 58,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',

    shadowColor: '#102A43',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 5,
  },

  title: {
    color: '#17324D',
    fontSize: 18,
    fontWeight: '800',
  },

  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: '#22C55E',
  },

  liveText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },

  loadingCard: {
    position: 'absolute',
    top: 94,
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',

    shadowColor: '#102A43',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 4,
  },

  loadingTextContainer: {
    marginLeft: 13,
  },

  loadingTitle: {
    color: '#17324D',
    fontSize: 14,
    fontWeight: '800',
  },

  loadingText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },

  errorCard: {
    position: 'absolute',
    top: 94,
    left: 18,
    right: 18,
    flexDirection: 'row',
    padding: 17,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFFFFF',

    shadowColor: '#102A43',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 4,
  },

  errorIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginRight: 13,
    backgroundColor: '#FEE2E2',
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '800',
  },

  errorText: {
    color: '#7F1D1D',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  retryButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#DC2626',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  locationButton: {
    position: 'absolute',
    right: 18,
    bottom: 205,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',

    shadowColor: '#102A43',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,

    elevation: 7,
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  bottomCard: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 20,
    flexDirection: 'row',
    padding: 19,
    borderRadius: 24,
    backgroundColor: '#17324D',

    shadowColor: '#102A43',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.24,
    shadowRadius: 20,

    elevation: 9,
  },

  bottomCardIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    marginRight: 14,
    backgroundColor: '#276EF1',
  },

  bottomCardContent: {
    flex: 1,
  },

  bottomCardLabel: {
    color: '#44D3B4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  bottomCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },

  bottomCardText: {
    color: '#C7D5E0',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  userMarkerOuter: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(39, 110, 241, 0.25)',
  },

  userMarkerInner: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#276EF1',
  },
});