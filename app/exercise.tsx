import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { supabase } from "../utils/supabase"; // adjust the path accordingly

type Exercise = {
  id: number;
  exercise_in_arabic: string;
  exercise_in_english: string;
  image_link: string;
};

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data, error } = await supabase
          .from("exercises")
          .select("id, exercise_in_arabic, exercise_in_english, image_link");

        if (error) throw error;

        setExercises(data || []);
      } catch (error: any) {
        console.error("Error fetching exercises:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const renderItem = ({ item }: { item: Exercise }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.exercise_in_english}</Text>
      <Text style={styles.subtitle}>{item.exercise_in_arabic}</Text>
      <Image
        source={{ uri: item.image_link }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <FlatList
      data={exercises}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      numColumns={2} // Display two items per row
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
