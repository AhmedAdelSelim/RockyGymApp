import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
  ImageBackground,
  Platform,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabase } from "../utils/supabase";
import DropDownPicker from "react-native-dropdown-picker"; // Import DropDownPicker
import { Colors } from "@/constants/Colors";
import moment from "moment";

interface PricelistItem {
  id: number;
  type: string;
  title: string;
  description: string | null;
  price: number;
  duration: string;
}

const SubscriptionScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [priceList, setPriceList] = useState<PricelistItem[]>([]);

  // State for Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [subscriptionBtnVisible, setSubscriptionBtnVisible] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("monthly");

  // State for DropDownPicker
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Monthly Subscription", value: "monthly" },
    { label: "Offer Subscription", value: "offer" },
    { label: "Package Subscription", value: "package" },
    { label: "Session Subscription", value: "session" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("gym_pricelist")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        const dropDownMenuItems: any = [];
        data.forEach((item) => {
          dropDownMenuItems.push({
            label: `${item.price} EGP\t\t\t${item.title}`,
            value: item.title,
          });
        });
        setItems(dropDownMenuItems);
        setPriceList(data);

        const userEmail = (await supabase.auth.getUser()).data.user?.email;
        const userAlreadySubscriped = await supabase
          .from("users_subscription")
          .select("status")
          .eq("user_email", userEmail)
          .single();

        if (userAlreadySubscriped.data && userAlreadySubscriped.data.status) {
          setSubscriptionBtnVisible(false);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const getFinishedAt = (): string => {
    let duration = priceList.filter((item) => item.title === selectedType)[0]
      .duration;

    if (duration === "day")
      return moment().clone().add(1, "day").format("YYYY-MM-DD");
    else if (duration === "month")
      return moment().clone().add(1, "month").format("YYYY-MM-DD");
    else if (duration === "week")
      return moment().clone().add(1, "week").format("YYYY-MM-DD");
    else if (duration === "half month")
      return moment().clone().add(2, "weeks").format("YYYY-MM-DD");
    else if (duration === "2 months")
      return moment().clone().add(2, "months").format("YYYY-MM-DD");
    else if (duration === "3 months")
      return moment().clone().add(3, "months").format("YYYY-MM-DD");
    else if (duration === "6 months")
      return moment().clone().add(6, "months").format("YYYY-MM-DD");
    return moment().clone().add(1, "year").format("YYYY-MM-DD");
  };

  const handleConfirm = async () => {
    try {
      // Insert subscription data into Supabase (assuming you have a 'subscriptions' table)
      const userEmail = (await supabase.auth.getUser()).data.user?.email;
      const userAlreadySubscriped = await supabase
        .from("users_subscription")
        .select("id")
        .eq("user_email", userEmail);
      if (userAlreadySubscriped.data?.length) {
        Alert.alert(
          "انت بالفعل مشترك رجاءا تواصل مع ادارة الجيم لتغيير الاشتراك "
        );
        return;
      }
      const { error } = await supabase.from("users_subscription").insert([
        {
          user_email: userEmail,
          subscription_type: selectedType,
          created_at: moment().format("YYYY-MM-DD"),
          will_finish_at: getFinishedAt(),
        },
      ]);

      if (error) throw error;

      Alert.alert(
        "تم الاشتراك جزئيا بنجاح",
        "تواصل مع ادارة الجيم لتأكيد الاشتراك "
      );
      // Reset form

      setSelectedType("monthly");
      setModalVisible(false);
    } catch (error: any) {
      console.error("Error submitting subscription:", error.message);
      Alert.alert("Error", "There was an error submitting your subscription.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.tint} />
      </View>
    );
  }

  const renderSection = (type: string, title: string) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {priceList
          .filter((item: PricelistItem) => item.type === type)
          .map((item: PricelistItem) => (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemText}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}
              </View>
              <Text style={styles.price}>{item.price} EGP</Text>
            </View>
          ))}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/images/rocky_gym_background.jpeg")} // Replace with your image path
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.header}>ROCKY GYM</Text>
        <Text style={styles.subHeader}>Pricelist</Text>
        <Text style={styles.title}>Rocky Gym & Fitness Center</Text>

        <ScrollView contentContainerStyle={styles.scrollView}>
          {renderSection("monthly", "الإشتراكات الشهرية")}
          {renderSection("offer", "عروض الإشتراكات")}
          {renderSection("package", "الباقات الشهرية")}
          {renderSection("session", "الحصص اليومية")}
        </ScrollView>

        {/* Button to Open Modal */}
        {subscriptionBtnVisible ? (
          <TouchableOpacity
            style={styles.openButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.openButtonText}>اشترك الان</Text>
          </TouchableOpacity>
        ) : null}

        {/* Subscription Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>اختر الباقة للإشتراك</Text>

              {/* Subscription Type DropDown */}
              <DropDownPicker
                open={open}
                value={selectedType}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedType}
                setItems={setItems}
                containerStyle={styles.pickerContainer}
                style={styles.picker}
                placeholder="اختر نوع الاشتراك "
                dropDownContainerStyle={styles.picker}
              />

              {/* Confirm Button */}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>تأكيد</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.3,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
  },
  scrollView: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    fontSize: 28,
    color: Colors.dark.tint,
    fontWeight: "bold",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 22,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.dark.tint,
    fontWeight: "bold",
    marginBottom: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#ffffff",
  },
  description: {
    fontSize: 14,
    color: "#b3b3b3",
    marginTop: 5,
  },
  openButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.dark.tint,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  openButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    color: Colors.dark.tint,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    backgroundColor: "#333",
    color: "#ffffff",
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  pickerContainer: {
    height: 40,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: "#fff",
    color: "#ffffff",
  },
  confirmButton: {
    backgroundColor: Colors.dark.tint,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#444",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SubscriptionScreen;
