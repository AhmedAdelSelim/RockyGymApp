import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Image,
  Dimensions,
  Platform,
  Modal,
} from "react-native";
import { supabase, supabaseAdmin } from "../utils/supabase";
import AdminBookingScreen from "./adminBooking";

export interface Locker {
  id: number;
  number: string;
  available: boolean;
  status: "available" | "pending" | "booked";
  owner: string;
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 30) / 3; // Adjust width for padding and margin

export default function BookingScreen() {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);

  useEffect(() => {
    fetchLockers();
  }, []);

  const fetchLockers = async () => {
    setLoading(true);

    const user = (await supabase.auth.getUser()).data.user?.email;
    if (user === "rockyadmin94@rockygym") {
      setIsAdmin(true);
    }

    const { data, error } = await supabase
      .from("lockers")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setLockers(data || []);
    }

    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setUsers(data.users || []);
    }
  };

  const handleChangeUserPress = async (locker: Locker) => {
    setSelectedLocker(locker);
    await fetchUsers();
    setModalVisible(true);
  };

  const handleLockerPress = (locker: Locker) => {
    if (isAdmin) {
      Alert.alert(
        "Locker Booked",
        `This locker is booked by ${locker.owner}.`,
        [
          {
            text: "Change User",
            onPress: () => handleChangeUserPress(locker),
          },
          {
            text: "جعلها الخزنة متاحة",
            onPress: async () => {
              const { error } = await supabase
                .from("lockers")
                .update({ status: "available", available: true, owner: null })
                .eq("id", locker.id);

              if (error) {
                Alert.alert("Error", error.message);
              } else {
                Alert.alert("Success", "The locker has been marked as free.");
                fetchLockers(); // Refresh locker list
              }
            },
          },
          {
            text: "إلغاء",
            style: "cancel",
          },
        ]
      );
      return; // Exit the function after handling admin actions
    }

    if (locker.status === "pending") {
      Alert.alert(
        "حالة الخزنة ",
        "هذه الخزنة محجوزة جزئيا من قبل شخص اخر رجاءا تواصل مع ادارة الجيم "
      );
      return;
    }
    if (!locker.available) return;

    Alert.alert("تأكيد الحجز", `هل تريد فعلاً حجز الخزنة  ${locker.number}؟ `, [
      {
        text: "إلغاء",
        style: "cancel",
      },
      {
        text: "تأكيد",
        onPress: async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const { data } = await supabase
            .from("lockers")
            .select("*")
            .eq("owner", user.id);
          if (data?.length) {
            console.log("data ", data);

            Alert.alert("انت بالفعل تمتلك خزانة");
            return;
          }
          const { error } = await supabase
            .from("lockers")
            .update({ status: "pending", owner: user.id })
            .eq("id", locker.id);

          if (error) {
            Alert.alert("Error", error.message);
          } else {
            Alert.alert(
              "تم الحجز بانتظار التأكيد من ادارة الجيم ",
              `تم حجز الخزنة ${locker.number}`
            );
            fetchLockers(); // Refresh locker list
          }
        },
      },
    ]);
  };

  const renderLocker = ({ item }: { item: Locker }) => (
    <TouchableOpacity
      style={[styles.locker, !item.available && styles.lockerUnavailable]}
      onPress={() => handleLockerPress(item)}
      disabled={!item.available}
    >
      <Text
        style={[
          styles.lockerText,
          item.available
            ? styles.lockerAvailableText
            : styles.lockerUnavailableText,
        ]}
      >
        {`${item.number}`}
      </Text>
      <Text
        style={[
          styles.lockerStatus,
          item.available
            ? styles.lockerAvailableText
            : styles.lockerUnavailableText,
        ]}
      >
        {item.available ? "متاح" : "محجوز"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/rocky_gym_background.jpeg")} // Replace with your background image path
        style={styles.backgroundImage}
      />
      <Text style={styles.title}>Locker Booking</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={lockers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLocker}
          numColumns={3}
          contentContainerStyle={styles.list}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select User</Text>
          {users.map((user) => (
            <TouchableOpacity
              key={user.id}
              onPress={async () => {
                const { error } = await supabase
                  .from("lockers")
                  .update({ owner: user.id, status: "pending" })
                  .eq("id", selectedLocker?.id);

                if (error) {
                  Alert.alert("Error", error.message);
                } else {
                  Alert.alert("Success", `Locker booked by ${user.email}.`);
                  fetchLockers(); // Refresh locker list
                }
                setModalVisible(false); // Close the modal
              }}
            >
              <Text style={styles.userText}>{user.email}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 70 : 16,
    backgroundColor: "transparent", // Background is managed by the background image
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.5, // Adjust opacity as needed
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "white",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  list: {
    flexGrow: 1,
    justifyContent: "center",
  },
  locker: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    padding: 10,
    margin: 4,
    borderRadius: 12, // Rounded corners
    borderWidth: 2, // Border width
    borderColor: "#fff", // Border color (adjust as needed)
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#4caf50",
    elevation: 5, // Add shadow for Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lockerUnavailable: {
    backgroundColor: "rgba(244, 67, 54, 0.5)", // Semi-transparent red
  },
  lockerImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  lockerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  lockerAvailableText: {
    color: "#f6c230", // Green for available lockers
  },
  lockerUnavailableText: {
    color: "white", // Red for unavailable lockers
  },
  lockerStatus: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    color: "white",
  },
  userText: {
    fontSize: 18,
    color: "white",
    padding: 10,
  },
  closeButton: {
    fontSize: 18,
    color: "white",
    marginTop: 20,
  },
});
