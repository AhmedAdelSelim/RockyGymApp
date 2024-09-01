// components/Card.js
import React from "react";
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  View,
} from "react-native";

interface CardProps {
  title: string;
  image: ImageSourcePropType | undefined;
  onClick(): void;
}
const Card = ({ title, image, onClick }: CardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onClick}>
      <View style={{ flex: 3, marginBottom: 20 }}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f6c230",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    alignItems: "center",
    height: 200,
    display: "flex",
  },
  image: {
    width: 160,
    height: 140,
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    color: "black",
    flex: 1,
  },
});

export default Card;
