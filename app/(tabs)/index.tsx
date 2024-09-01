// routes/home.js
import React from "react";
import { StyleSheet, FlatList, View, ImageBackground } from "react-native";
import Card from "@/components/Card";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ExpoRouter } from "expo-router/types/expo-router";

interface DataItem {
  id: string;
  title: string;
  image: number;
  path: string;
}
const data: DataItem[] = [
  {
    id: "1",
    title: "اعرف تمرينتك",
    image: require("@/assets/images/instruction.jpeg"),
    path: "",
  },
  {
    id: "2",
    title: "الإشتراكات",
    image: require("@/assets/images/gym_subcription.jpeg"),
    path: "subscription",
  },
  {
    id: "3",
    title: "منتجات روكي",
    image: require("@/assets/images/products.png"),
    path: "",
  },
  {
    id: "4",
    title: "حالة الجيم الأن",
    image: require("@/assets/images/gym_status.jpeg"),
    path: "",
  },
  {
    id: "5",
    title: "احجز خزانة",
    image: require("@/assets/images/gym_locker.jpeg"),
    path: "booking",
  },

  {
    id: "6",
    title: "المكملات",
    image: require("@/assets/images/supplements.jpeg"),
    path: "",
  },
  {
    id: "7",
    title: "ثقف نفسك",
    image: require("@/assets/images/exercises.jpg"),
    path: "exercise",
  },
];

const handleClickCardItem = (router: ExpoRouter.Router, path: string) => {
  router.navigate(path);
  console.log(path);
};
const HomeScreen = () => {
  const router = useRouter();
  const renderItem = ({ item }: { item: DataItem }) => (
    <View style={styles.cardContainer}>
      <Card
        title={item.title}
        image={item.image}
        onClick={() => {
          handleClickCardItem(router, item.path);
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("@/assets/images/rocky_gym_background.jpeg")} // Replace with your background image
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ThemedView style={styles.container}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            numColumns={2}
          />
        </ThemedView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(242, 242, 242, 0.0)",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  list: {
    paddingBottom: 20,
  },
  cardContainer: {
    flex: 1,
    margin: 3, // Add margin between cards
  },
});

export default HomeScreen;
