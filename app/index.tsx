import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: insets.bottom + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Kopfbereich */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>GUTEN TAG</Text>
            <Text style={styles.title}>Bereit zum Parken?</Text>
          </View>

          <View style={styles.profileButton}>
            <Ionicons
              name="person-outline"
              size={22}
              color="#201D1C"
            />
          </View>
        </View>

        {/* Große Hauptkarte */}
        <View style={styles.heroCard}>
          <View style={styles.heroDecorationLarge} />
          <View style={styles.heroDecorationSmall} />

          <View style={styles.heroIcon}>
            <Ionicons
              name="car-sport"
              size={30}
              color="#E62E67"
            />
          </View>

          <Text style={styles.heroLabel}>PARKPILOT</Text>

          <Text style={styles.heroTitle}>
            Finde schnell einen freien Parkplatz.
          </Text>

          <Text style={styles.heroText}>
            Starte die Parkplatzsuche und lass dich bequem zu deinem Ziel
            führen.
          </Text>

          <Link href="/explore" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Ionicons
                name="navigate"
                size={20}
                color="#E62E67"
              />

              <Text style={styles.primaryButtonText}>
                Parkplatz finden
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#E62E67"
              />
            </Pressable>
          </Link>
        </View>

        {/* Statistikbereich */}
        <Text style={styles.sectionTitle}>Auf einen Blick</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.pinkIcon]}>
              <Ionicons
                name="time-outline"
                size={22}
                color="#E62E67"
              />
            </View>

            <Text style={styles.statValue}>3 Min.</Text>
            <Text style={styles.statLabel}>Ø Suchzeit</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.neutralIcon]}>
              <Ionicons
                name="location-outline"
                size={22}
                color="#201D1C"
              />
            </View>

            <Text style={styles.statValue}>Live</Text>
            <Text style={styles.statLabel}>Standort</Text>
          </View>
        </View>

        {/* Hinweis */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons
              name="bulb-outline"
              size={23}
              color="#F59E0B"
            />
          </View>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Park-Tipp</Text>

            <Text style={styles.tipText}>
              Aktiviere deinen Standort, damit ParkPilot passende
              Parkmöglichkeiten in deiner Nähe findet.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F6F4',
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  eyebrow: {
    color: '#8C8985',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 5,
  },

  title: {
    color: '#201D1C',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.6,
  },

  profileButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',

    shadowColor: '#201D1C',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,

    elevation: 3,
  },

  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 330,
    padding: 24,
    borderRadius: 30,
    backgroundColor: '#E62E67',

    shadowColor: '#E62E67',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 22,

    elevation: 8,
  },

  heroDecorationLarge: {
    position: 'absolute',
    top: -85,
    right: -65,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },

  heroDecorationSmall: {
    position: 'absolute',
    right: 28,
    bottom: 72,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  heroIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },

  heroLabel: {
    color: '#FFD9E6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 9,
  },

  heroTitle: {
    maxWidth: 280,
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.7,
  },

  heroText: {
    maxWidth: 305,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 24,
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },

  primaryButtonText: {
    flex: 1,
    color: '#E62E67',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 11,
  },

  sectionTitle: {
    color: '#201D1C',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 14,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statCard: {
    flex: 1,
    padding: 17,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',

    shadowColor: '#201D1C',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,

    elevation: 2,
  },

  statIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginBottom: 18,
  },

  pinkIcon: {
    backgroundColor: '#FFE1EC',
  },

  neutralIcon: {
    backgroundColor: '#F3F1EE',
  },

  statValue: {
    color: '#201D1C',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 3,
  },

  statLabel: {
    color: '#8C8985',
    fontSize: 13,
    fontWeight: '600',
  },

  tipCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 22,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },

  tipIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#FFF7E6',
    marginRight: 14,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    color: '#201D1C',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 5,
  },

  tipText: {
    color: '#8C8985',
    fontSize: 13,
    lineHeight: 19,
  },
});