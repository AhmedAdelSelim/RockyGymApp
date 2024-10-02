import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../utils/supabase";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type Exercise = {
  id: number;
  exercise_in_arabic: string;
  exercise_in_english: string;
};

const { width } = Dimensions.get('window');
const cardWidth = width * 0.44;

// General exercise image URL
const GENERAL_EXERCISE_IMAGE = 'https://example.com/path/to/general-exercise-image.jpg';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  async function fetchExercises() {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("id, exercise_in_arabic, exercise_in_english");

      if (error) throw error;

      if (data) {
        setExercises(data);
      }
    } catch (error: any) {
      console.error("Error fetching exercises:", error.message);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity style={styles.cardWrapper}>
      <View style={styles.card}>
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={styles.gradient}
        >
          <Text style={styles.title}>{item.exercise_in_arabic}</Text>
          <Text style={styles.subtitle}>{item.exercise_in_english}</Text>
        </LinearGradient>
        <Image
          source={{ uri: GENERAL_EXERCISE_IMAGE }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.iconContainer}>
          <Ionicons name="fitness-outline" size={24} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={exercises}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      numColumns={2}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    width: cardWidth,
    height: cardWidth * 1.2,
    margin: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700', // Yellow border
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    zIndex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#eee',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
    zIndex: 2,
  },
});