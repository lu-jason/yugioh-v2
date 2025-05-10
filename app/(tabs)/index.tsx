import { View, StyleSheet, ImageProps, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { AppearanceProvider } from "react-native-appearance";

import { OwnedCardList } from "@/components/CardList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../hooks";
import { selectCards } from "@/features/cards/cardSlice";

export default function Index() {
  return <OwnedCardList />;
}
