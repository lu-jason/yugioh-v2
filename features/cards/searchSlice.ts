import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { CardType } from "../../models/TCGPlayer";

export interface SearchState {
  cards: CardsState[];
  sets: CardType[];
  rarities: CardType[];
  cardtypes: CardType[];
}

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
const initialState: SearchState = {
  cards: [],
  rarities: [],
  sets: [],
  cardtypes: [],
};

export const searchCardsSlice = createSlice({
  name: "searchCards",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addSearchedCards: (state, action: PayloadAction<any[]>) => {
      state.cards = toCardsStates(action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      let cardToUpdate = state.cards.findIndex(
        (card) => card.id === action.payload.id
      );
      state.cards[cardToUpdate].quantity = action.payload.quantity;
      state.cards = Object.assign([], state.cards);
    },
  },
});

export const { addSearchedCards, updateQuantity } = searchCardsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSearchedCards = (state: RootState) => state.cards.cards;

export default searchCardsSlice.reducer;
