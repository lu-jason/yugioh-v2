import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import {
  useGetAggregationsQuery,
  useLazyGetCardsFromSetQuery,
} from "@/features/cards/tcgPlayerApiSlice";
import { CardType } from "@/models/TCGPlayer";
import { CardList } from "@/components/CardList";
import { addCards, CardsState, selectCards } from "@/features/cards/cardSlice";
import { useAppDispatch } from "../hooks";
import { selectSearchedCards } from "@/features/cards/searchSlice";

export default function SetSearchScreen() {
  const [totalSelectedCards, setTotalSelectedCards] = useState(0);
  const [searchSet, setSearchSet] = useState("");
  const [setName, setSetName] = useState("");
  const [searchCardName, setSearchCardName] = useState("");
  const [filteredData, setFilteredData] = useState<CardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardsState[]>([]);

  const [cardsToAdd, setCardsToAdd] = useState<CardsState[]>([]);

  const { data: aggregations } = useGetAggregationsQuery();
  const [triggerGetCardsFromSet, { data: cardsInSet }] =
    useLazyGetCardsFromSetQuery();

  const useDispatch = useAppDispatch();

  const increaseQuantity = (card: CardsState) => {
    let index = cardsToAdd.findIndex(
      (value) => value.number === card.number && value.rarity == card.rarity
    );
    if (index != -1) {
      setCardsToAdd((prevCards) =>
        prevCards.map((card, idx) =>
          idx == index ? { ...card, quantity: card.quantity + 1 } : card
        )
      );
      setTotalSelectedCards((value) => value + 1);
    } else {
      setCardsToAdd((value) => [...value, card]);
    }
  };

  const decreaseQuantity = (card: CardsState) => {
    let index = cardsToAdd.findIndex(
      (value) => value.number === card.number && value.rarity == card.rarity
    );
    if (index != -1 && cardsToAdd[index].quantity > 0) {
      setCardsToAdd((prevCards) =>
        prevCards.map((card, idx) => {
          if (idx == index) {
            card.quantity--;
          }
          return card;
        })
      );
      setTotalSelectedCards((value) => value - 1);
    }
  };

  const clearQuantity = (card: CardsState) => {
    let index = cardsToAdd.findIndex(
      (value) => value.number === card.number && value.rarity == card.rarity
    );
    if (index != -1 && cardsToAdd[index].quantity > 0) {
      setCardsToAdd((prevCards) =>
        prevCards.map((card, idx) => {
          if (idx == index) {
            setTotalSelectedCards((value) => value - card.quantity);
            card.quantity = 0;
          }
          return card;
        })
      );
    }
  };

  useEffect(() => {
    if (cardsInSet) setCardsToAdd(cardsInSet);
  }, [cardsInSet]);

  useEffect(() => {
    if (aggregations != undefined) {
      if (searchSet == "" && filteredData.length != 0) {
        setFilteredData([]);
      } else if (searchSet != "") {
        console.log("Setting filtered data");
        setFilteredData(
          aggregations.setName.filter((value: CardType) =>
            value.value.toLowerCase().includes(searchSet.toLowerCase())
          )
        );
      }
    }
  }, [searchSet, aggregations]);

  useEffect(() => {
    if (cardsToAdd != undefined) {
      if (searchCardName == "" && filteredCards.length != 0) {
        setFilteredCards([]);
      } else if (searchCardName != "") {
        console.log("Setting filtered data");
        setFilteredCards(
          cardsToAdd.filter(
            (value: CardsState) =>
              value.cardName
                .toLowerCase()
                .includes(searchCardName.toLowerCase()) ||
              value.number?.toLowerCase().includes(searchCardName.toLowerCase())
          )
        );
      }
    }
  }, [searchCardName, filteredCards]);

  useEffect(() => {
    if (setName != "") {
      triggerGetCardsFromSet(setName);
    }
  }, [setName]);

  if (aggregations) {
    return (
      <View style={{ flexDirection: "column", backgroundColor: "#25292e" }}>
        <View
          style={{
            alignSelf: "flex-end",
            marginRight: 10,
          }}
        >
          <Button
            title="Add cards"
            disabled={totalSelectedCards === 0}
            onPress={() =>
              useDispatch(
                addCards(cardsToAdd.filter((value) => value.quantity !== 0))
              )
            }
          ></Button>
        </View>
        <View style={styles.container}>
          <View>
            <TextInput
              style={styles.searchText}
              placeholder="Search for a set"
              onChangeText={(newText) => setSearchSet(newText)}
              defaultValue={searchSet}
            ></TextInput>
            <FlatList
              data={searchSet.length == 0 ? aggregations.setName : filteredData}
              renderItem={({ item }) => {
                const backgroundColor =
                  item.value === setName ? "white" : "black";
                const color = item.value === setName ? "black" : "white";
                return (
                  <TouchableOpacity onPress={() => setSetName(item.value)}>
                    <Text
                      style={[
                        styles.text,
                        { backgroundColor: backgroundColor, color: color },
                      ]}
                    >
                      {item.value}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            ></FlatList>
          </View>
          <View style={styles.cardContainer}>
            <TextInput
              style={styles.searchText}
              placeholder="Search for a card"
              onChangeText={(newText) => setSearchCardName(newText)}
              defaultValue={searchSet}
            ></TextInput>
            {cardsToAdd && (
              <CardList
                cards={searchCardName.length == 0 ? cardsToAdd : filteredCards}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                clearQuantity={clearQuantity}
              ></CardList>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 15,
    backgroundColor: "#25292e",
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
