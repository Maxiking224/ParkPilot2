import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OfferScreen() {
  const [address, setAddress] = useState("");

  const [availableFrom, setAvailableFrom] = useState(new Date());

  const [expiresAt, setExpiresAt] = useState(
    new Date(Date.now() + 60 * 60 * 1000)
  );

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  function publishOffer() {
    console.log({
      address,
      availableFrom,
      expiresAt,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>Parkplatz anbieten</Text>

        <Text style={styles.label}>Adresse</Text>

        <TextInput
          style={styles.input}
          placeholder="Adresse eingeben"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Verfügbar ab</Text>

        <Pressable
          style={styles.input}
          onPress={() => setShowFromPicker(true)}
        >
          <Text>
            {availableFrom.toLocaleString()}
          </Text>
        </Pressable>

        {showFromPicker && (
          <DateTimePicker
            value={availableFrom}
            mode="datetime"
            onChange={(event, date) => {
              setShowFromPicker(Platform.OS === "ios");

              if (date) {
                setAvailableFrom(date);
              }
            }}
          />
        )}

        <Text style={styles.label}>Verfügbar bis</Text>

        <Pressable
          style={styles.input}
          onPress={() => setShowToPicker(true)}
        >
          <Text>
            {expiresAt.toLocaleString()}
          </Text>
        </Pressable>

        {showToPicker && (
          <DateTimePicker
            value={expiresAt}
            mode="datetime"
            onChange={(event, date) => {
              setShowToPicker(Platform.OS === "ios");

              if (date) {
                setExpiresAt(date);
              }
            }}
          />
        )}

        <Pressable
          style={styles.button}
          onPress={publishOffer}
        >
          <Ionicons
            name="car"
            size={20}
            color="white"
          />

          <Text style={styles.buttonText}>
            Parkplatz veröffentlichen
          </Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#17324D",
    marginBottom: 25,
  },

  label: {
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 18,
    color: "#17324D",
  },

  input: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  button: {
    marginTop: 35,
    backgroundColor: "#276EF1",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    marginLeft: 10,
    fontSize: 16,
  },
});