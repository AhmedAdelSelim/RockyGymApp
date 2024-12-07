import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../utils/supabase";
import { Locker } from "./booking";

const AdminBookingScreen = () => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLockers();
    fetchUsers();
  }, []);

  const fetchLockers = async () => {
    setLoading(true);
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
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers();

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setUsers(users || []);
    }
  };

  const updateLockerStatus = async (locker: Locker, newStatus: string) => {
    const { error } = await supabase
      .from("lockers")
      .update({ status: newStatus })
      .eq("id", locker.id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Success",
        `Locker ${locker.number} status updated to ${newStatus}`
      );
      fetchLockers();
    }
  };

  const renderLocker = ({ item }: { item: Locker }) => {
    const associatedUser = users.find((user) => user.id === item.owner);

    return (
      <View style={styles.lockerContainer}>
        <Text style={styles.lockerText}>Locker Number: {item.number}</Text>
        <Text style={styles.lockerText}>Status: {item.status}</Text>
        <Text style={styles.lockerText}>Owner ID: {item.owner}</Text>
        {associatedUser && (
          <Text style={styles.lockerText}>User: {associatedUser.name}</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            updateLockerStatus(
              item,
              item.status === "booked" ? "available" : "booked"
            )
          }
        >
          <Text style={styles.buttonText}>
            {item.status === "booked" ? "Mark as Available" : "Mark as Booked"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderUser = ({ item }: { item: User }) => {
    return (
      <View style={styles.userContainer}>
        <Text style={styles.userText}>User ID: {item.id}</Text>
        <Text style={styles.userText}>Name: {item.name}</Text>
        <Text style={styles.userText}>Email: {item.email}</Text>
        {/* Add more user fields as necessary */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Locker Management</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          <FlatList
            data={lockers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderLocker}
            contentContainerStyle={styles.list}
          />
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUser}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007BFF",
  },
  lockerContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  lockerText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 20,
  },
  userContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  userText: {
    fontSize: 18,
  },
});

export default AdminBookingScreen;
