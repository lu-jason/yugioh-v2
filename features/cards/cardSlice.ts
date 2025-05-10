import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { addCardsToFirebase, deleteCardFromFirebase } from "./firebaseAPI";
import { createDispatchHook } from "react-redux";

// Define a type for the slice state
export interface CardsState {
  id: number;
  cardName: string;
  rarity: string;
  setName: string;
  price: number;
  quantity: number;
  number: string;
}

// Define the initial state using that type
const initialState: CardsState[] = [];

export const cardsSlice = createSlice({
  name: "cards",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<CardsState>) => {
      let index = state.findIndex((value: CardsState) => {
        return action.payload.id === value.id;
      });
      if (index === -1) {
        state.push(action.payload);
      } else {
        state[index].quantity += action.payload.quantity;
      }
    },
    addCards: (state, action: PayloadAction<CardsState[]>) => {
      action.payload.forEach((payloadValue: CardsState) => {
        let index = state.findIndex((value: CardsState) => {
          return payloadValue.id === value.id;
        });
        if (index === -1) {
          state.push(payloadValue);
        } else {
          state[index].quantity += payloadValue.quantity;
        }
      });
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      console.log("Increasing quantity for ", action.payload);
      let index = state.findIndex((card: CardsState) => {
        return card.id == action.payload;
      });
      if (index != -1) {
        state[index].quantity++;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      let index = state.findIndex((card: CardsState) => {
        return card.id == action.payload;
      });
      if (index != -1 && state[index].quantity != 0) {
        state[index].quantity--;
      }
    },
    clearQuantity: (state, action: PayloadAction<number>) => {
      let index = state.findIndex((card: CardsState) => {
        return card.id == action.payload;
      });
      if (index != -1 && state[index].quantity != 0) {
        state[index].quantity = 0;
      }
    },
    addCardsToDb: (
      _,
      action: PayloadAction<{ rows: CardsState[]; userId: string }>
    ) => {
      action.payload.rows.forEach((payloadValue: CardsState) => {
        addCardsToFirebase(payloadValue, action.payload.userId);
      });
    },
    deleteCard: (state, action: PayloadAction<CardsState>) => {
      let index = state.findIndex(
        (card: CardsState) =>
          card.number === action.payload.number &&
          card.rarity === action.payload.rarity
      );

      if (index !== -1) {
        return state.filter(
          (card) =>
            !(
              card.number == action.payload.number &&
              card.rarity == action.payload.rarity
            )
        );
      }
    },
  },
});

export const {
  addCard,
  addCards,
  addCardsToDb,
  deleteCard,
  increaseQuantity,
  decreaseQuantity,
  clearQuantity,
} = cardsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCards = (state: RootState) => state.ownedCards;

export default cardsSlice.reducer;
