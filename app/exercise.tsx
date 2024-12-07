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
  Modal,
  Button,
} from "react-native";
import { supabase } from "../utils/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type Exercise = {
  id: number;
  exercise_in_arabic: string;
  exercise_in_english: string;
  image_link: string;
};

const { width } = Dimensions.get("window");
const cardWidth = width * 0.44;

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );

  useEffect(() => {
    fetchExercises();
  }, []);

  async function fetchExercises() {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("id, exercise_in_arabic, exercise_in_english, image_link")
        .order("id", { ascending: false });

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
  function getImage(name: string) {
    const imageMap = {
      abductors: require("@/assets/images/body/abductors.jpg"),
      abs: require("@/assets/images/body/abs_0.jpg"),
      adductors: require("@/assets/images/body/adductors.jpg"),
      biceps: require("@/assets/images/body/biceps_0.jpg"),
      calves: require("@/assets/images/body/calves_0.jpg"),
      chest: require("@/assets/images/body/chest_0.jpg"),
      forearms: require("@/assets/images/body/forearms_0.jpg"),
      glutes: require("@/assets/images/body/glutes_0.jpg"),
      hamstrings: require("@/assets/images/body/hamstrings_0.jpg"),
      hipflexors: require("@/assets/images/body/hipflexors.jpg"),
      itband: require("@/assets/images/body/itband.jpg"),
      lats: require("@/assets/images/body/lats_0.jpg"),
      lowerback: require("@/assets/images/body/lowerback.jpg"),
      neck: require("@/assets/images/body/neck.jpg"),
      obliques: require("@/assets/images/body/obliques.jpg"),
      palmarfacsia: require("@/assets/images/body/palmarfacsia.jpg"),
      plantarfascia: require("@/assets/images/body/plantarfascia.jpg"),
      quads: require("@/assets/images/body/quads_1.jpg"),
      shoulders: require("@/assets/images/body/shoulders_0.jpg"),
      traps: require("@/assets/images/body/traps_0.jpg"),
      triceps: require("@/assets/images/body/triceps_0.jpg"),
      upperback: require("@/assets/images/body/upperback.jpg"),
    };

    return imageMap[name.toLowerCase()] || require("@/assets/images/icon.png"); // Fallback image
  }

  const renderItem = ({ item }: { item: Exercise }) => {
    const imageSource = item.image_link.startsWith("https")
      ? { uri: item.image_link }
      : getImage(item.exercise_in_english);

    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => {
          setSelectedExercise(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.card}>
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            style={styles.gradient}
          >
            <Text style={styles.title}>{item.exercise_in_arabic}</Text>
            <Text style={styles.subtitle}>{item.exercise_in_english}</Text>
          </LinearGradient>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
          <View style={styles.iconContainer}>
            <Ionicons name="fitness-outline" size={24} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedExercise(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        numColumns={2}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedExercise && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedExercise.exercise_in_arabic}
              </Text>
              <Text style={styles.modalSubtitle}>
                {selectedExercise.exercise_in_english}
              </Text>
              <Image
                source={
                  selectedExercise.image_link.startsWith("https")
                    ? { uri: selectedExercise.image_link }
                    : getImage(selectedExercise.exercise_in_english)
                }
                style={styles.modalImage}
                resizeMode="contain"
              />
              <Button title="Close" onPress={closeModal} />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginTop: 19,
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
    borderColor: "#FFD700", // Yellow border
    overflow: "hidden",
  },
  card: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    zIndex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#eee",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
    zIndex: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalSubtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  modalImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
  },
});
