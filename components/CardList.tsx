import { imageURLFull } from "@/app/apis/tcgplayer";
import { useAppSelector } from "@/app/hooks";
import { CardsState, selectCards } from "@/features/cards/cardSlice";
import React, { useState } from "react";
import {
  ListRenderItemInfo,
  StyleSheet,
  View,
  FlatList,
  Text,
  useWindowDimensions,
  Pressable,
  GestureResponderEvent,
  Image,
} from "react-native";

const data: ItemProps[] = new Array(8).fill({
  title: "Item",
});

type ItemProps = { title: string };

const onPressHandler = (event: GestureResponderEvent) => {
  console.log("Pressed", event);
};

const Item = (item: CardsState) => (
  <Pressable id={String(item.id)}>
    <View
      style={[styles.card, { width: 450, height: 250, flexDirection: "row" }]}
    >
      <View style={{ flexBasis: 170 }}>
        <Image
          source={{ uri: `${imageURLFull}${item.id}.jpg` }}
          style={{ resizeMode: "contain", width: "100%", height: "100%" }}
        ></Image>
      </View>
      <View style={{ justifyContent: "center" }}>
        <Text style={styles.text}>{item.cardName}</Text>
        <Text style={styles.text}>{item.setName}</Text>
        <Text style={styles.text}>{item.rarity}</Text>
        <Text style={styles.text}>{item.number}</Text>
        <Text style={styles.text}>{item.price}</Text>
      </View>
    </View>
  </Pressable>
);

export const CardList = () => {
  const searchedCards = useAppSelector(selectCards);

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: "#25112e",
    marginBottom: 10,
    padding: 10,
  },
});
