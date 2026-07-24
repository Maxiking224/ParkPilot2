import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.heroCard}>
        <ThemedText type="title">ParkPilot2</ThemedText>
        <ThemedText style={styles.subtitle}>Find your next smart parking spot faster.</ThemedText>

        <ThemedView style={styles.infoRow}>
          <ThemedView style={styles.infoCard}>
            <ThemedText type="subtitle">24/7</ThemedText>
            <ThemedText>Live lot guidance</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoCard}>
            <ThemedText type="subtitle">3 min</ThemedText>
            <ThemedText>Average search time</ThemedText>
          </ThemedView>
        </ThemedView>

        <Link href="/explore" asChild>
          <Pressable style={styles.primaryButton}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Open parking view
            </ThemedText>
          </Pressable>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  heroCard: {
    gap: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 120, 255, 0.08)',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    gap: 6,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
  },
});
