import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Aggregations,
  CardType,
  ResultResult,
  TCGPlayer,
  TCGPlayerResult,
} from "../../models/TCGPlayer";
import { Action } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { RootState } from "../../app/store";
import { TCGPlayerBody } from "../../models/TCGPlayerBody";
import { CardsState } from "./cardSlice";

const corsProxy = "https://thingproxy.freeboard.io/fetch/";
const searchURL = "http://localhost:8010/proxy/v1/search/request?q=";

export const CACHE_KEY = "SETS_RARIES_CARDTYPES_PRODUCTTYPES";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const emptyBody = {
  algorithm: "sales_exp_fields_experiment",
  from: 0,
  size: 24,
  filters: {
    term: {
      productLineName: ["yugioh"],
      setName: [],
    },
    range: {},
    match: {},
  },
  listingSearch: {
    context: {
      cart: {},
    },
    filters: {
      term: {
        sellerStatus: "Live",
        channelId: 0,
      },
      range: {
        quantity: {
          gte: 1,
        },
      },
      exclude: {
        channelExclusion: 0,
      },
    },
  },
  context: {
    cart: {},
    shippingCountry: "AU",
  },
  settings: {
    useFuzzySearch: true,
    didYouMean: {},
  },
  sort: {},
};

const emptyBodyInfo = {
  algorithm: "sales_exp_fields_experiment",
  from: 0,
  size: 0,
  filters: {
    term: {
      productLineName: ["yugioh"],
    },
    range: {},
    match: {},
  },
  listingSearch: {
    context: {
      cart: {},
    },
    filters: {
      term: {
        sellerStatus: "Live",
        channelId: 0,
      },
      range: {
        quantity: {
          gte: 1,
        },
      },
      exclude: {
        channelExclusion: 0,
      },
    },
  },
  context: {
    cart: {},
    shippingCountry: "AU",
  },
  settings: {
    useFuzzySearch: true,
    didYouMean: {},
  },
  sort: {},
};

const constructBody = (aggregations: GetAggregations): TCGPlayerBody => {
  let body = {} as TCGPlayerBody;
  body.algorithm = "sales_exp_fields_experiment";

  body.filters = {
    term: { productLineName: ["yugioh"] },
    range: {},
    match: {},
  };
  body.size = 50;

  if (aggregations.setName.length !== 0) {
    body.filters.term.setName = aggregations.setName;
  }

  if (aggregations.rarityName.length !== 0) {
    body.filters.term.rarityName = aggregations.rarityName;
  }

  if (aggregations.cardType.length !== 0) {
    body.filters.term.cardType = aggregations.cardType;
  }

  if (aggregations.productTypeName.length !== 0) {
    body.filters.term.productTypeName = aggregations.productTypeName;
  }

  return body;
};

const sortFunc = (a: CardType, b: CardType): number => {
  console.log("Sorting");
  return a.count > b.count ? -1 : 1;
};

function isHydrateAction(action: Action): action is Action<typeof REHYDRATE> & {
  key: string;
  payload: RootState;
  err: unknown;
} {
  return action.type === REHYDRATE;
}

export interface GetAggregations {
  setName: string[];
  rarityName: string[];
  productTypeName: string[];
  cardType: string[];
}

export interface AggregationCache {
  aggregations: Aggregations;
  timestamp: number;
}

export const tcgPlayerApi = createApi({
  reducerPath: "tcgPlayerApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${searchURL}` }),
  endpoints: (builder) => ({
    getAggregations: builder.query<Aggregations, void>({
      query: (aggregations) => ({
        url: "",
        method: "POST",
        body: emptyBody,
      }),
      async onCacheEntryAdded(arg, api) {
        try {
          await api.cacheDataLoaded;

          const cached = localStorage.getItem(CACHE_KEY);
          const now = Date.now();

          if (cached) {
            const parsed = JSON.parse(cached) as AggregationCache;
            const now = Date.now();

            if (now - parsed.timestamp > ONE_DAY_MS) {
              api.updateCachedData(() => parsed.aggregations);
            }
          }

          const entry = api.getCacheEntry();
          if (entry?.data) {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ data: entry.data, timestamp: now })
            );
          }

          await api.cacheEntryRemoved;
        } catch (e) {
          console.warn("Error loading data from local storage", e);
        }
      },
      transformResponse: (response: TCGPlayer): Aggregations => {
        let aggregations = response.results[0].aggregations;
        aggregations.cardType.sort(sortFunc);
        aggregations.setName.sort(sortFunc);
        aggregations.rarityName.sort(sortFunc);
        aggregations.productTypeName.sort(sortFunc);

        return aggregations;
      },
    }),
    getCardsFromSet: builder.query<CardsState[], string>({
      query: (setName) => ({
        url: "",
        method: "POST",
        body: constructBody({
          setName: [setName],
          cardType: [],
          productTypeName: [],
          rarityName: [],
        }),
      }),
      transformResponse: (response: TCGPlayer): CardsState[] => {
        let results = response.results[0].results;

        return results.map(
          (value: ResultResult) =>
            ({
              cardName: value.productName,
              id: value.productId,
              number: value.customAttributes.number,
              price: value.marketPrice,
              rarity: value.rarityName,
              setName: value.setName,
              quantity: 0,
            } as CardsState)
        );
      },
    }),
    getSetsRaritiesAndCardTypes: builder.query<CardType, string>({
      query: (cardName: string) => cardName,
    }),
  }),
});

export const {
  useGetAggregationsQuery,
  useGetSetsRaritiesAndCardTypesQuery,
  useGetCardsFromSetQuery,
  useLazyGetCardsFromSetQuery,
  useLazyGetAggregationsQuery,
} = tcgPlayerApi;
