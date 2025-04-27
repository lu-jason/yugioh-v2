import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  FlatList,
  Pressable,
  GestureResponderEvent,
  Button,
} from "react-native";
import { searchCards } from "../apis/tcgplayer";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addSearchedCards,
  CardsState,
  selectSearchedCards,
} from "@/features/cards/searchSlice";
import { current } from "@reduxjs/toolkit";
import { addCards } from "@/features/cards/cardSlice";

export default function SearchScreen() {
  const [text, setText] = useState("effect veiler");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<CardsState[]>([]);

  const useDispatch = useAppDispatch();
  const searchedCards = useAppSelector(selectSearchedCards);

  const search = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    console.log("Searching for " + text);
    searchCards(text, useDispatch, addSearchedCards);
  };

  const onPressHandler = (card: CardsState) => {
    console.log("Pressed", card);
    if (selectedCards.find((item) => item.id == card.id)) {
      setSelectedCards((currentCards) =>
        currentCards.filter((item) => item.id != card.id)
      );
    } else {
      setSelectedCards((currentCards) => [...currentCards, card]);
    }
    console.log("Selected cards", selectedCards);
  };

  const onPressHandlerLong = (event: GestureResponderEvent) => {
    setSelectMode(true);
    console.log("Long Press", event);
  };

  const handleAddCards = () => {
    console.log("Selected cards", selectedCards);
    useDispatch(addCards(selectedCards));
  };

  const Item = (item: CardsState) => {
    return (
      <Pressable
        onPress={() => onPressHandler(item)}
        onLongPress={onPressHandlerLong}
        id={String(item.id)}
      >
        <View
          style={[
            selectedCards.find((card) => item.id == card.id)
              ? styles.cardHighlighted
              : styles.card,
            { width: 350 },
          ]}
        >
          <Text style={styles.text}>{item.cardName}</Text>
          <Text style={styles.text}>{item.setName}</Text>
          <Text style={styles.text}>{item.rarity}</Text>
          <Text style={styles.text}>{item.number}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchText}
        placeholder="Search for a card"
        onChangeText={(newText) => setText(newText)}
        defaultValue={text}
        onSubmitEditing={(event) => search(event)}
      ></TextInput>
      {selectedCards.length != 0 && (
        <>
          <Text style={styles.text}>{selectedCards.length} cards selected</Text>
          <Button title="Add Card(s)" onPress={handleAddCards}></Button>
        </>
      )}
      {searchCards.length != 0 && (
        <View
          style={[
            styles.cardContainer,
            {
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10,
            },
          ]}
        >
          {searchedCards.map((searchedCard) => {
            return <Item {...searchedCard} key={searchedCard.id} />;
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    overflowY: "auto",
  },
  searchText: {
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    color: "#fff",
    marginBottom: 10,
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: "#25112e",
    marginBottom: 10,
    padding: 10,
    paddingBottom: 0,
  },
  cardHighlighted: {
    backgroundColor: "#111111",
    marginBottom: 10,
    padding: 10,
    paddingBottom: 0,
  },
});
