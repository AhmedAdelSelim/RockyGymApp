import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");

const BMICalculator = () => {
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(29);
  const [weight, setWeight] = useState(85);
  const [height, setHeight] = useState(185);
  const [bmiRate, setBmiRate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const calculateBMI = () => {
    if (!gender || !age || !weight || !height) {
      Alert.alert("Error", "Please fill in all the required fields.");
      return;
    }
    setModalVisible(true);
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    setBmiRate(bmi.toFixed(2));
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi < 25) {
      return "Normal";
    } else if (bmi < 30) {
      return "Overweight";
    } else {
      return "Obese";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>

      {/* Gender Selection */}
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderCard,
            gender === "male" && styles.genderSelected,
          ]}
          onPress={() => setGender("male")}
        >
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderCard,
            gender === "female" && styles.genderSelected,
          ]}
          onPress={() => setGender("female")}
        >
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>

      {/* Age and Weight */}
      <View style={styles.rowContainer}>
        <View style={styles.counterContainer}>
          <Text style={styles.label}>AGE</Text>
          <Text style={styles.value}>{age}</Text>
          <View style={styles.counterButtons}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setAge((prev) => Math.max(prev - 1, 1))}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setAge((prev) => prev + 1)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.label}>WEIGHT (kg)</Text>
          <Text style={styles.value}>{weight}</Text>
          <View style={styles.counterButtons}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setWeight((prev) => Math.max(prev - 1, 1))}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setWeight((prev) => prev + 1)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Height Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>HEIGHT (cm)</Text>
        <Text style={styles.value}>{height}</Text>
        <Slider
          style={styles.slider}
          minimumValue={100}
          maximumValue={250}
          step={1}
          value={height}
          onValueChange={(value) => setHeight(value)}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#d3d3d3"
        />
      </View>

      {/* Calculate Button */}
      <TouchableOpacity
        style={styles.calculateButton}
        onPress={() => {
          calculateBMI();
        }}
      >
        <Text style={styles.calculateButtonText}>CALCULATE</Text>
      </TouchableOpacity>

      {/* BMI Result */}
      {bmiRate && (
        <View style={styles.modalOverlay}>
          <Text style={styles.resultLabel}>Your BMI is:</Text>
          <Text style={styles.resultValue}>{bmiRate}</Text>
          <Text style={styles.resultCategory}>{getBMICategory(bmiRate)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
    alignItems: "center",
    marginTop: 25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    padding: 110,
    margin: 25,
    borderRadius: "50%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  genderCard: {
    flex: 1,
    backgroundColor: "#d3d3d3",
    alignItems: "center",
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  genderSelected: {
    backgroundColor: "#4CAF50",
  },
  genderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  counterContainer: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  counterButtons: {
    flexDirection: "row",
  },
  counterButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  sliderContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  slider: {
    width: width - 40,
    marginTop: 10,
  },
  calculateButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  resultContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  resultCategory: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#000",
  },
});

export default BMICalculator;
