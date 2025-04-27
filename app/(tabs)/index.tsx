import { View, StyleSheet, ImageProps, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { AppearanceProvider } from "react-native-appearance";

import { CardList } from "@/components/CardList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../hooks";
import { selectCards } from "@/features/cards/cardSlice";

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const searchedCards = useAppSelector(selectCards);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You did not select any image.");
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    // we will implement this later
  };

  return <CardList />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  card: {
    backgroundColor: "#25112e",
    marginBottom: 10,
    padding: 10,
    paddingBottom: 0,
  },
});
