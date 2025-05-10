import { imageURLFull, searchCards } from "@/app/apis/tcgplayer";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { AppDispatch } from "@/app/store";
import {
  CardsState,
  clearQuantity,
  decreaseQuantity,
  deleteCard,
  increaseQuantity,
  selectCards,
} from "@/features/cards/cardSlice";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Image } from "expo-image";
import IconButton from "./IconButton";
import alert from "./alert";
import { SetList } from "./SetList";

type CardProps = {
  item: CardsState;
  increaseQuantity: (card: CardsState) => void;
  decreaseQuantity: (card: CardsState) => void;
  clearQuantity: (card: CardsState) => void;
  deleteCard?: (card: CardsState) => void;
};

type SetList = {
  name: string;
  quantity: number;
};

const Card = React.memo(
  ({
    item,
    increaseQuantity,
    decreaseQuantity,
    clearQuantity,
    deleteCard,
  }: CardProps) => (
    <View style={styles.card}>
      <View style={{ flexBasis: 170 }}>
        <Image
          source={{ uri: `${imageURLFull}${item.id}.jpg` }}
          style={{ width: "100%", height: "100%" }}
          contentFit="contain"
          cachePolicy="disk"
        ></Image>
      </View>
      <View style={{ flex: 1 }}>
        <View>
          <View>
            <Text style={[styles.text, styles.title]}>{item.cardName}</Text>
            <Text style={styles.text}>{item.setName}</Text>
            <Text style={styles.text}>{item.rarity}</Text>
            <Text style={styles.text}>{item.number}</Text>
            <Text style={[styles.text, styles.price]}>
              Market Price: ${item.price}
            </Text>
          </View>
        </View>
        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          <View style={{ flexDirection: "row" }}>
            {deleteCard && (
              <IconButton
                icon="delete"
                onPress={() => {
                  console.log("Pressed delete");
                  return alert(
                    `Are you sure you want to delete\n${item.cardName} of rarity ${item.rarity}?`,
                    "This action cannot be undone.",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "OK", onPress: () => deleteCard(item) },
                    ],
                    { cancelable: false }
                  );
                }}
              ></IconButton>
            )}
            <IconButton
              icon="clear"
              onPress={() => clearQuantity(item)}
            ></IconButton>
            <IconButton
              icon="remove"
              onPress={() => decreaseQuantity(item)}
            ></IconButton>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                padding: 5,
              }}
            >
              {item.quantity}
            </Text>
            <IconButton
              icon="add"
              onPress={() => increaseQuantity(item)}
            ></IconButton>
          </View>
        </View>
      </View>
    </View>
  )
);

type CardListProps = {
  cards: CardsState[];
  numColumns?: number;
  increaseQuantity: (card: CardsState) => void;
  decreaseQuantity: (card: CardsState) => void;
  clearQuantity: (card: CardsState) => void;
  deleteQuantity?: (card: CardsState) => void;
};

export const CardList = ({
  cards,
  numColumns,
  increaseQuantity,
  decreaseQuantity,
  clearQuantity,
  deleteQuantity,
}: CardListProps) => {
  return (
    <FlatList
      data={cards}
      renderItem={({ item }) => (
        <Card
          key={item.id}
          item={item}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          clearQuantity={clearQuantity}
          deleteCard={deleteQuantity}
        />
      )}
      numColumns={numColumns ? numColumns : 3}
      columnWrapperStyle={styles.row}
    ></FlatList>
  );
};

export const OwnedCardList = () => {
  const searchedCards = useAppSelector(selectCards);
  const useDispatch = useAppDispatch();

  const [searchSet, setSearchSet] = useState("");
  const [setName, setSetName] = useState("All");

  const [setList, setSetList] = useState<SetList[]>([]);

  const [filteredCards, setFilteredCards] = useState<CardsState[]>([]);

  useEffect(() => {
    const map = new Map<string, number>();
    let totalQuantity = 0;

    searchedCards.forEach((card) => {
      const prev = map.get(card.setName) || 0;
      map.set(card.setName, prev + card.quantity);
      totalQuantity += card.quantity;
    });

    const sets = Array.from(map.entries()).map(([name, quantity]) => ({
      name,
      quantity,
    }));

    setSetList([{ name: "All", quantity: totalQuantity }, ...sets]);
  }, [searchedCards]);

  useEffect(() => {
    if (setName !== "All" && setName !== "") {
      console.log("updated set name", setName);
      setFilteredCards(
        searchedCards.filter((searchedCard) => searchedCard.setName === setName)
      );
    } else {
      setFilteredCards(searchedCards);
    }
  }, [searchedCards, setName]);

  return (
    <View style={styles.container}>
      <SetList sets={setList} onSetSelect={setSetName}></SetList>
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredCards}
          renderItem={({ item }) => (
            <Card
              key={item.id}
              item={item}
              increaseQuantity={() => useDispatch(increaseQuantity(item.id))}
              decreaseQuantity={() => useDispatch(decreaseQuantity(item.id))}
              clearQuantity={() => useDispatch(clearQuantity(item.id))}
              deleteCard={() => useDispatch(deleteCard(item))}
            />
          )}
          numColumns={4}
          columnWrapperStyle={styles.row}
        ></FlatList>
      </View>
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
    justifyContent: "flex-start",
  },
  card: {
    backgroundColor: "#111111",
    padding: 10,
    position: "relative",
    width: 400,
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
    justifyContent: "space-evenly", // evenly distribute cards
    marginBottom: 10,
  },
  searchText: {
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
});
