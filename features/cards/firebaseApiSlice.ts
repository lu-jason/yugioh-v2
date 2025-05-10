import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import { CardsState } from "./cardSlice";

export const firebaseApi = createApi({
  reducerPath: "firebaseApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    addCard: builder.mutation<void, { cards: CardsState; userId: string }>({
      queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
        const cardFromFirebase = await getDoc(
          doc(db, arg.userId, String(arg.cards.id))
        );

        if (cardFromFirebase.exists()) {
          updateDoc(cardFromFirebase.ref, {
            quantity: increment(arg.cards.quantity),
          });
        } else {
          await setDoc(doc(db, arg.userId, String(arg.cards.id)), arg.cards);
        }
        return { data: undefined };
      },
    }),
    addCardsToFirestore: builder.mutation<
      void,
      { cards: CardsState[]; userId: string }
    >({
      queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
        const cardsRef = collection(db, arg.userId);

        // Run migration
        const allDocs = await getDocs(cardsRef);
        allDocs.forEach((doc) => {
          const data = doc.data() as CardsState;

          if (data.quantity === undefined) {
            updateDoc(doc.ref, {
              quantity: 1,
            });
          }
        });

        const cardIds = arg.cards.map((card) => where("id", "==", card.id));
        const q = query(cardsRef, ...cardIds);

        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs;

        const promises: Promise<void>[] = [];

        arg.cards.forEach((card) => {
          const found = docs.find((doc) => {
            const data = doc.data() as CardsState;
            return data.id === card.id;
          });

          if (found) {
            console.log("Found existing card", found.data());
            const update = updateDoc(found.ref, {
              quantity: increment(card.quantity),
            });
            promises.push(update);
          } else {
            console.log("New card to add", card.id, card);
            const set = setDoc(doc(db, arg.userId, String(card.id)), card);
            promises.push(set);
          }
        });

        await Promise.all(promises);

        return { data: undefined };
      },
    }),
    getCards: builder.query<CardsState[], { userId: string | undefined }>({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        let cards: CardsState[] = [];

        if (arg.userId) {
          const querySnapshot = await getDocs(collection(db, arg.userId));

          querySnapshot.forEach((doc) => {
            cards.push(doc.data() as CardsState);
          });
        }

        return {
          data: cards,
        };
      },
    }),
    deleteCard: builder.mutation<
      void,
      { cardId: string; userId: string | undefined }
    >({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        if (arg.userId) {
          const cardFromFirebase = await getDoc(
            doc(db, arg.userId, arg.cardId)
          );

          if (cardFromFirebase.exists()) {
            await deleteDoc(cardFromFirebase.ref);
          }
        }
        return {
          data: undefined,
        };
      },
    }),
  }),
});

export const {
  useAddCardMutation,
  useGetCardsQuery,
  useLazyGetCardsQuery,
  useAddCardsToFirestoreMutation,
  useDeleteCardMutation,
} = firebaseApi;
