import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { addCardsToFirebase, deleteCardFromFirebase } from "./firebaseAPI";

// Define a type for the slice state
export interface CardsState {
  id: number;
  cardName: string;
  rarity: string;
  setName: string;
  price: number;
  quantity: number;
  number: number;
}

export const toCardsState = (rowModel: any): CardsState => {
  return {
    id: rowModel.id,
    cardName: rowModel.cardName,
    setName: rowModel.setName,
    price: rowModel.price,
    rarity: rowModel.rarity,
    quantity: rowModel.quantity,
    number: rowModel.number,
  };
};

export const toCardsStates = (rowModel: any[]): CardsState[] => {
  return rowModel.map((data) => {
    return {
      id: data.id,
      cardName: data.cardName,
      setName: data.setName,
      price: data.price,
      rarity: data.rarity,
      quantity: data.quantity,
      number: data.number,
    };
  });
};

// Define the initial state using that type
const initialState: CardsState[] = [];

export const cardsSlice = createSlice({
  name: "cards",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<any>) => {
      state.push(toCardsState(action.payload));
    },
    addCards: (state, action: PayloadAction<any[]>) => {
      toCardsStates(action.payload).forEach((payloadValue: CardsState) => {
        if (
          state.findIndex((value: CardsState) => {
            return payloadValue.id === value.id;
          }) === -1
        ) {
          state.push(payloadValue);
        }
      });
    },
    addCardsToDb: (
      _,
      action: PayloadAction<{ rows: any[]; userId: string }>
    ) => {
      toCardsStates(action.payload.rows).forEach((payloadValue: CardsState) => {
        addCardsToFirebase(toCardsState(payloadValue), action.payload.userId);
      });
    },
    deleteCard: (
      state,
      action: PayloadAction<{ rowId: any; userId: string }>
    ) => {
      let id = Number(action.payload.rowId);
      deleteCardFromFirebase(String(id), action.payload.userId);

      state = state.filter((value) => value.id !== id);
      state = Object.assign([], state);
    },
  },
});

export const { addCard, addCards, addCardsToDb, deleteCard } =
  cardsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCards = (state: RootState) => state.ownedCards;

export default cardsSlice.reducer;
