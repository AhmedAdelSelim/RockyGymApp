import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Switch,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/utils/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLayoutEffect } from "react";

// Define a custom type for the gym status
interface GymStatus {
  start: number;
  end: number;
  isOpen: boolean;
  girls_time?: boolean; // Optional property
}

const CustomButton = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function StatusPage() {
  const [fontsLoaded] = useFonts({
    "Roboto-Bold": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Roboto-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [gymStatus, setGymStatus] = useState({} as GymStatus);
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [loading, setLoading] = useState(true); // State to manage loading status

  const isAdmin = false;
  useEffect(() => {
    const fetchGymStatus = async () => {
      setLoading(true); // Set loading to true before fetching data
      const { data, error } = await supabase
        .from<"gym_status", GymStatus>("gym_status")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching gym status:", error);
        setLoading(false); // Set loading to false on error
        return;
      }
      setGymStatus(data as GymStatus);
      setLoading(false); // Set loading to false after data is fetched
    };
    fetchGymStatus();
  }, []);

  const isGymOpen = () => {
    if (
      !gymStatus ||
      gymStatus.start === undefined ||
      gymStatus.end === undefined
    )
      return false;
    const now = new Date();
    const hour = now.toTimeString().slice(0, 8); // Format to HH:MM:SS

    return hour >= gymStatus.start && hour <= gymStatus.end && gymStatus.isOpen;
  };

  const open = isGymOpen();

  const openModal = () => {
    setModalVisible(true); // Set modal visibility to true
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={
        gymStatus && gymStatus.girls_time
          ? ["#FFC0CB", "#FF69B4"]
          : open
          ? ["#4CAF50", "#45a049"]
          : ["#f44336", "#d32f2f"]
      }
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons
          name={open ? "fitness-outline" : "close-circle-outline"}
          size={80}
          color="white"
        />
        <Text style={styles.statusText}>
          {open ? "الصالة مفتوحة" : "الصالة مغلقة"}
        </Text>
        <Text style={styles.timeText}>
          {open
            ? `مفتوحة حتى ${gymStatus.end}`
            : `تفتح الساعة ${gymStatus.start}`}
        </Text>
        {isAdmin ? (
          <CustomButton title="Edit Gym Status" onPress={openModal} />
        ) : null}
      </View>
      {modalVisible ? (
        <EditGymStatusModal
          visible={modalVisible}
          gymStatus={gymStatus}
          onClose={() => setModalVisible(false)}
          setGymStatus={setGymStatus}
          setLoading={setLoading}
        />
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  statusText: {
    fontFamily: "Roboto-Bold",
    fontSize: 32,
    color: "white",
    marginTop: 20,
    textAlign: "center",
  },
  timeText: {
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    // backgroundColor: '#007BFF', // Example color
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 3,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFFFFF", // Text color
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Background color for loading screen
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
  },
});

interface EditGymStatusModalProps {
  visible: boolean;
  onClose: () => void;
  gymStatus: GymStatus;
  setLoading: (arg: any) => void;
  setGymStatus: (arg: any) => void;
}

const EditGymStatusModal: React.FC<EditGymStatusModalProps> = ({
  gymStatus,
  visible,
  onClose,
  setLoading,
  setGymStatus,
}: EditGymStatusModalProps) => {
  const [start, setStart] = useState<Date>(() => {
    const today = new Date(); // Get today's date
    const startTime = gymStatus.start; // Assuming gymStatus.start is in HH:MM:SS format
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      parseInt(startTime.toString().split(":")[0]), // Hour
      parseInt(startTime.toString().split(":")[1]), // Minute
      0 // Seconds
    );
    return startDate;
  }); // State for start time
  const [end, setEnd] = useState<Date>(() => {
    const today = new Date(); // Get today's date
    const endTime = gymStatus.end;
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      parseInt(endTime.toString().split(":")[0]), // Hour
      parseInt(endTime.toString().split(":")[1]), // Minute
      0 // Seconds
    );
    return endDate;
  }); // State for end time
  const [isOpen, setIsOpen] = useState<boolean>(gymStatus.isOpen); // State for open status
  const [girls_time, setGirls_time] = useState<boolean>(gymStatus.girls_time); // State for girls_time
  const [showStartPicker, setShowStartPicker] = useState(false); // State to show start time picker
  const [showEndPicker, setShowEndPicker] = useState(false); // State to show end time picker

  const handleSave = async () => {
    // Prepare the data to be saved
    const updatedStatus = {
      start: start.toTimeString().slice(0, 8), // Format to HH:MM:SS
      end: end.toTimeString().slice(0, 8), // Format to HH:MM:SS
      isOpen,
      girls_time,
    };

    // Logic to update the existing record in Supabase
    const { data, error } = await supabase
      .from("gym_status") // Specify the table name
      .update(updatedStatus) // Update the existing record
      .eq("id", 1); // Assuming the record has an ID of 1

    if (error) {
      console.error("Error saving gym status:", error);
      // Optionally, you can show an alert or a message to the user
    } else {
      await fetchGymStatus(); // Refetch the data after updating
      onClose(); // Close the modal after saving
    }
  };

  const fetchGymStatus = async () => {
    setLoading(true); // Set loading to true before fetching data

    const { data, error } = await supabase
      .from<"gym_status", GymStatus>("gym_status")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching gym status:", error);
      setLoading(false); // Set loading to false on error
      return;
    }
    setGymStatus(data as GymStatus);
    const startTime = new Date();
    startTime.setHours(data.start);
    const endTime = new Date();
    endTime.setHours(data.end);
    setStart(startTime);
    setEnd(endTime);
    setLoading(false); // Set loading to false after data is fetched
  };

  const onStartTimeChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || start;
    setShowStartPicker(false);
    setStart(currentDate);
  };

  const onEndTimeChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || end;
    setShowEndPicker(false);
    setEnd(currentDate);
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <View style={stylesModal.overlay}>
        <View style={stylesModal.modalContainer}>
          <Text style={stylesModal.title}>تعديل حالة الصالة</Text>

          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            style={stylesModal.inputContainer}
          >
            <Text
              style={stylesModal.inputText}
            >{`وقت البدء: ${start?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={start}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onStartTimeChange}
            />
          )}

          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            style={stylesModal.inputContainer}
          >
            <Text style={stylesModal.inputText}>
              {`وقت الإغلاق: ${end?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={end}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onEndTimeChange}
            />
          )}

          <View style={stylesModal.switchContainer}>
            <Text style={stylesModal.switchLabel}>مفتوح:</Text>
            <Switch
              value={isOpen}
              onValueChange={setIsOpen}
              thumbColor={isOpen ? "green" : "red"}
            />
          </View>

          <View style={stylesModal.switchContainer}>
            <Text style={stylesModal.switchLabel}>وقت الفتيات:</Text>
            <Switch
              value={girls_time} // Use boolean state for the switch
              onValueChange={setGirls_time} // Update state on toggle
              thumbColor={girls_time ? "green" : "red"}
            />
          </View>

          <View style={stylesModal.buttonContainer}>
            <TouchableOpacity style={stylesModal.button} onPress={handleSave}>
              <Text style={stylesModal.buttonText}>حفظ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[stylesModal.button, { backgroundColor: "red" }]}
              onPress={onClose}
            >
              <Text style={stylesModal.buttonText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles for the modal
const stylesModal = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay for better contrast
  },
  modalContainer: {
    width: "90%", // Set width to 90% of the screen
    maxHeight: "50%", // Set max height to 50% of the screen for a smaller modal
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15, // Reduced margin for a more compact look
    textAlign: "center",
    color: "#333", // Darker title color
  },
  inputContainer: {
    backgroundColor: "#f0f0f0", // Light background for input
    borderRadius: 10,
    padding: 10, // Reduced padding for a more compact look
    marginBottom: 10, // Reduced margin for a more compact look
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // Reduced margin for a more compact look
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    backgroundColor: "green", // Primary color for buttons
    borderRadius: 10,
    padding: 10, // Reduced padding for a more compact look
    marginHorizontal: 5,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
