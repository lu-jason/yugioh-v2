import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Pressable,
  GestureResponderEvent,
  Button,
} from "react-native";
import { searchCards } from "../apis/tcgplayer";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addSearchedCards,
  selectSearchedCards,
} from "@/features/cards/searchSlice";
import { addCards, CardsState } from "@/features/cards/cardSlice";
import { CardList } from "@/components/CardList";

export default function SearchScreen() {
  const [text, setText] = useState("effect veiler");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<CardsState[]>([]);

  const useDispatch = useAppDispatch();
  const searchedCards = useAppSelector(selectSearchedCards);

  const increaseQuantity = (card: CardsState) => {
    let index = selectedCards.findIndex(
      (value) => value.number === card.number && value.rarity == card.rarity
    );
    if (index != -1) {
      setSelectedCards((prevCards) =>
        prevCards.map((card, idx) =>
          idx == index ? { ...card, quantity: card.quantity + 1 } : card
        )
      );
    } else {
      setSelectedCards((value) => [...value, card]);
    }
  };

  const decreaseQuantity = (card: CardsState) => {
    let index = selectedCards.findIndex(
      (value) => value.number === card.number && value.rarity == card.rarity
    );
    if (index != -1 && selectedCards[index].quantity > 0) {
      setSelectedCards((prevCards) =>
        prevCards.map((card, idx) => {
          if (idx == index) {
            card.quantity--;
          }
          return card;
        })
      );
    } else {
      setSelectedCards((value) => [...value, card]);
    }
  };

  const clearQuantity = (card: CardsState) => {
    let index = selectedCards.findIndex(
      (value) => value.number === card.number && value.rarity == card.rarity
    );
    if (index != -1 && selectedCards[index].quantity > 0) {
      setSelectedCards((prevCards) =>
        prevCards.map((card, idx) => {
          if (idx == index) {
            card.quantity = 0;
          }
          return card;
        })
      );
    } else {
      setSelectedCards((value) => [...value, card]);
    }
  };

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
      {searchCards.length != 0 && (
        <CardList
          cards={searchedCards}
          numColumns={4}
          clearQuantity={clearQuantity}
          decreaseQuantity={decreaseQuantity}
          increaseQuantity={increaseQuantity}
        ></CardList>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
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
