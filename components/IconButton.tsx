import { TouchableOpacity, StyleSheet, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
};

export default function IconButton({ icon, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonLabel: {
    color: "#fff",
    marginTop: 12,
  },
});
