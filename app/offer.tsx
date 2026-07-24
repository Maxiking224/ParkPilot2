import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Location from 'expo-location';
import { router } from 'expo-router';

import { useParkingOffers } from '@/context/ParkingOffersContext';

type PickerTarget = 'start' | 'end';
type PickerMode = 'date' | 'time';

export default function OfferScreen() {
  const { addOffer } = useParkingOffers();
  const [address, setAddress] = useState('');

  const [availableFrom, setAvailableFrom] = useState(new Date());

  const [expiresAt, setExpiresAt] = useState(
    new Date(Date.now() + 60 * 60 * 1000)
  );

  const [pickerTarget, setPickerTarget] =
    useState<PickerTarget | null>(null);

  const [pickerMode, setPickerMode] =
    useState<PickerMode>('date');

  function openPicker(
    target: PickerTarget,
    mode: PickerMode
  ) {
    setPickerTarget(target);
    setPickerMode(mode);
  }

  function handlePickerChange(
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) {
    if (Platform.OS === 'android') {
      setPickerTarget(null);
    }

    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    if (pickerTarget === 'start') {
      setAvailableFrom((currentDate) =>
        mergeDateOrTime(
          currentDate,
          selectedDate,
          pickerMode
        )
      );
    }

    if (pickerTarget === 'end') {
      setExpiresAt((currentDate) =>
        mergeDateOrTime(
          currentDate,
          selectedDate,
          pickerMode
        )
      );
    }
  }

  async function publishOffer() {
  const cleanedAddress = address.trim();

  if (!cleanedAddress) {
    Alert.alert(
      'Adresse fehlt',
      'Bitte gib eine Adresse für den Parkplatz ein.'
    );
    return;
  }

  if (expiresAt <= availableFrom) {
    Alert.alert(
      'Zeitraum ungültig',
      'Das Ende muss nach dem Beginn liegen.'
    );
    return;
  }

  const minimumDurationMilliseconds =
    5 * 60 * 1000;

  if (
    expiresAt.getTime() -
      availableFrom.getTime() <
    minimumDurationMilliseconds
  ) {
    Alert.alert(
      'Zeitraum zu kurz',
      'Der Parkplatz muss mindestens fünf Minuten verfügbar sein.'
    );
    return;
  }

  try {
    const permission =
      await Location.requestForegroundPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert(
        'Standort nicht erlaubt',
        'Der Standort wird benötigt, damit der Parkplatz auf der Karte angezeigt werden kann.'
      );
      return;
    }

    const currentLocation =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

    const offer = addOffer({
      address: cleanedAddress,

      latitude:
        currentLocation.coords.latitude,
      longitude:
        currentLocation.coords.longitude,

      availableFrom:
        availableFrom.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    console.log(
      'Neues Parkplatzangebot:',
      offer
    );

    Alert.alert(
      'Parkplatz veröffentlicht',
      'Dein Parkplatz wird jetzt auf der Karte angezeigt.',
      [
        {
          text: 'Zur Karte',
          onPress: () =>
            router.push('/explore'),
        },
      ]
    );
  } catch (error) {
    console.error(
      'Parkplatz konnte nicht veröffentlicht werden:',
      error
    );

    Alert.alert(
      'Fehler',
      'Der Standort konnte nicht ermittelt werden.'
    );
  }
}

  const selectedPickerValue =
    pickerTarget === 'end'
      ? expiresAt
      : availableFrom;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="car-sport"
              size={28}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              PARKPLATZ TEILEN
            </Text>

            <Text style={styles.title}>
              Parkplatz anbieten
            </Text>

            <Text style={styles.subtitle}>
              Teile einen frei werdenden Parkplatz
              mit anderen Nutzern.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Adresse</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="location-outline"
              size={21}
              color="#64748B"
            />

            <TextInput
              style={styles.textInput}
              placeholder="Straße, Hausnummer und Ort"
              placeholderTextColor="#94A3B8"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          <Text style={styles.sectionTitle}>
            Verfügbar ab
          </Text>

          <View style={styles.dateTimeRow}>
            <DateTimeButton
              icon="calendar-outline"
              label="Datum"
              value={formatDate(availableFrom)}
              onPress={() =>
                openPicker('start', 'date')
              }
            />

            <DateTimeButton
              icon="time-outline"
              label="Uhrzeit"
              value={formatTime(availableFrom)}
              onPress={() =>
                openPicker('start', 'time')
              }
            />
          </View>

          <Text style={styles.sectionTitle}>
            Verfügbar bis
          </Text>

          <View style={styles.dateTimeRow}>
            <DateTimeButton
              icon="calendar-outline"
              label="Datum"
              value={formatDate(expiresAt)}
              onPress={() =>
                openPicker('end', 'date')
              }
            />

            <DateTimeButton
              icon="time-outline"
              label="Uhrzeit"
              value={formatTime(expiresAt)}
              onPress={() =>
                openPicker('end', 'time')
              }
            />
          </View>

          {pickerTarget && (
            <DateTimePicker
              value={selectedPickerValue}
              mode={pickerMode}
              display="default"
              is24Hour
              minimumDate={
                pickerMode === 'date'
                  ? new Date()
                  : undefined
              }
              onChange={handlePickerChange}
            />
          )}

          <View style={styles.summary}>
            <Ionicons
              name="information-circle-outline"
              size={21}
              color="#276EF1"
            />

            <Text style={styles.summaryText}>
              Angebot vom{' '}
              <Text style={styles.summaryStrong}>
                {formatDateTime(availableFrom)}
              </Text>{' '}
              bis{' '}
              <Text style={styles.summaryStrong}>
                {formatDateTime(expiresAt)}
              </Text>
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.publishButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={publishOffer}
          >
            <Ionicons
              name="send"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.publishButtonText}>
              Parkplatz veröffentlichen
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type DateTimeButtonProps = {
  icon:
    | 'calendar-outline'
    | 'time-outline';
  label: string;
  value: string;
  onPress: () => void;
};

function DateTimeButton({
  icon,
  label,
  value,
  onPress,
}: DateTimeButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.dateTimeButton,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={21}
        color="#276EF1"
      />

      <View style={styles.dateTimeText}>
        <Text style={styles.dateTimeLabel}>
          {label}
        </Text>

        <Text style={styles.dateTimeValue}>
          {value}
        </Text>
      </View>
    </Pressable>
  );
}

function mergeDateOrTime(
  currentDate: Date,
  selectedDate: Date,
  mode: PickerMode
) {
  const result = new Date(currentDate);

  if (mode === 'date') {
    result.setFullYear(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
  } else {
    result.setHours(
      selectedDate.getHours(),
      selectedDate.getMinutes(),
      0,
      0
    );
  }

  return result;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  headerIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    marginRight: 15,
    backgroundColor: '#276EF1',
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    color: '#276EF1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 4,
  },

  title: {
    color: '#17324D',
    fontSize: 26,
    fontWeight: '800',
  },

  subtitle: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },

  card: {
    padding: 20,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
  },

  label: {
    color: '#17324D',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 9,
  },

  inputContainer: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#DCE4EC',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },

  textInput: {
    flex: 1,
    color: '#17324D',
    fontSize: 15,
    marginLeft: 11,
  },

  sectionTitle: {
    color: '#17324D',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 10,
  },

  dateTimeRow: {
    flexDirection: 'row',
    gap: 10,
  },

  dateTimeButton: {
    flex: 1,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#DCE4EC',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },

  dateTimeText: {
    flex: 1,
    marginLeft: 10,
  },

  dateTimeLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },

  dateTimeValue: {
    color: '#17324D',
    fontSize: 13,
    fontWeight: '800',
  },

  summary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 15,
    marginTop: 24,
    backgroundColor: '#EAF1FF',
  },

  summaryText: {
    flex: 1,
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 9,
  },

  summaryStrong: {
    color: '#17324D',
    fontWeight: '800',
  },

  publishButton: {
    minHeight: 57,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    marginTop: 22,
    backgroundColor: '#276EF1',
  },

  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 10,
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});