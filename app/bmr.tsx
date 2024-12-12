import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

const BMRCalculator = () => {
  const [gender, setGender] = useState(null); // "male" or "female"
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmr, setBmr] = useState(null);

  const calculateBMR = () => {
    if (!gender || !age || !weight || !height) {
      Alert.alert("Error", "Please fill out all fields and select a gender.");
      return;
    }

    const ageValue = parseInt(age);
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

    if (isNaN(ageValue) || isNaN(weightValue) || isNaN(heightValue)) {
      Alert.alert("Error", "Please enter valid numeric values.");
      return;
    }

    let bmrValue;
    if (gender === "male") {
      bmrValue =
        88.362 + 13.397 * weightValue + 4.799 * heightValue - 5.677 * ageValue;
    } else if (gender === "female") {
      bmrValue =
        447.593 + 9.247 * weightValue + 3.098 * heightValue - 4.33 * ageValue;
    }

    setBmr(bmrValue.toFixed(2)); // Round to 2 decimal places
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BMR Calculator</Text>

      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "male" && styles.selectedGender,
          ]}
          onPress={() => setGender("male")}
        >
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "female" && styles.selectedGender,
          ]}
          onPress={() => setGender("female")}
        >
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Age (years)"
        keyboardType="numeric"
        value={age}
        placeholderTextColor="gray"
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Weight (kg)"
        keyboardType="numeric"
        value={weight}
        placeholderTextColor="gray"
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Height (cm)"
        keyboardType="numeric"
        placeholderTextColor="gray"
        value={height}
        onChangeText={setHeight}
      />

      <TouchableOpacity style={styles.calculateButton} onPress={calculateBMR}>
        <Text style={styles.calculateButtonText}>CALCULATE BMR</Text>
      </TouchableOpacity>

      {/* Result */}
      {bmr && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Your BMR is:</Text>
          <Text style={styles.resultValue}>{bmr} kcal/day</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  genderButton: {
    backgroundColor: "#d3d3d3",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: "center",
    flex: 1,
  },
  selectedGender: {
    backgroundColor: "#4CAF50",
  },
  genderText: {
    fontSize: 18,
    color: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
    color: "gray",
    tintColor: "gray",
  },
  calculateButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  resultContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    elevation: 3,
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});

export default BMRCalculator;
