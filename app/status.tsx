import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export default function StatusPage() {
  const [fontsLoaded] = useFonts({
    'Roboto-Bold': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Roboto-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const isGymOpen = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 11 || hour < 0; // Open from 11 AM to 12 AM (midnight)
  };

  const open = isGymOpen();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={open ? ['#4CAF50', '#45a049'] : ['#f44336', '#d32f2f']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons
          name={open ? 'fitness-outline' : 'close-circle-outline'}
          size={80}
          color="white"
        />
        <Text style={styles.statusText}>
          {open ? 'الصالة مفتوحة' : 'الصالة مغلقة'}
        </Text>
        <Text style={styles.timeText}>
          {open ? 'مفتوحة حتى 12:00 صباحاً' : 'تفتح الساعة 11:00 صباحاً'}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 32,
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  timeText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
    textAlign: 'center',
  },
});
