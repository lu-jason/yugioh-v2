import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";

type SetList = {
  name: string;
  quantity: number;
};

type SetListProps = {
  sets: SetList[];
  onSetSelect: (name: string) => void;
};

export const SetList = ({ sets, onSetSelect }: SetListProps) => {
  const [searchSet, setSearchSet] = useState("");
  const [setName, setSetName] = useState("All");

  const [filteredSets, setFilteredSets] = useState<SetList[]>();

  useEffect(() => {
    console.log("Searching for set", searchSet);
    if (searchSet !== "") {
      setFilteredSets(
        sets.filter(
          (set) =>
            set.name === "All" ||
            set.name.toLowerCase().includes(searchSet.toLowerCase())
        )
      );
    } else {
      setFilteredSets(sets);
    }
  }, [searchSet, sets]);

  return (
    <View>
      <TextInput
        style={styles.searchText}
        placeholder="Search for a set"
        onChangeText={(newText) => setSearchSet(newText)}
        defaultValue={searchSet}
      ></TextInput>
      <FlatList
        data={filteredSets}
        renderItem={({ item }) => {
          const backgroundColor = item.name === setName ? "white" : "black";
          const color = item.name === setName ? "black" : "white";
          return (
            <TouchableOpacity
              onPress={() => {
                setSetName(item.name);
                onSetSelect(item.name);
              }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    backgroundColor: backgroundColor,
                    color: color,
                    textAlign: "center",
                  },
                ]}
              >
                {item.name} ({item.quantity})
              </Text>
            </TouchableOpacity>
          );
        }}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    flexDirection: "row",
  },
  text: {
    color: "#fff",
    paddingBottom: 10,
  },
  title: {
    fontWeight: "bold",
  },
  price: {
    fontWeight: "bold",
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-evenly",
  },
  card: {
    backgroundColor: "#111111",
    padding: 10,
    position: "relative",
    width: 450,
    height: 250,
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#444",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    justifyContent: "space-evenly",
    marginBottom: 10, // row gap
  },
  searchText: {
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
});
