import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Aggregations,
  CardType,
  TCGPlayer,
  TCGPlayerResult,
} from "../../models/TCGPlayer";
import { Action } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { RootState } from "../../app/store";
import { TCGPlayerBody } from "../../models/TCGPlayerBody";

const corsProxy = "https://thingproxy.freeboard.io/fetch/";
const searchURL = "https://mp-search-api.tcgplayer.com/v1/search/request?q=";

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
  body.size = 24;

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

export const tcgPlayerApi = createApi({
  reducerPath: "tcgPlayerApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${corsProxy}${searchURL}` }),
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction(action)) {
      if (action.key === "root" && action.payload !== undefined) {
        return action.payload[reducerPath];
      }
    }
  },
  endpoints: (builder) => ({
    getAggregations: builder.query<Aggregations, GetAggregations>({
      query: (aggregations) => ({
        url: "",
        method: "POST",
        body: constructBody(aggregations),
      }),
      transformResponse: (response: TCGPlayer): Aggregations => {
        let aggregations = response.results[0].aggregations;
        aggregations.cardType.sort(sortFunc);
        aggregations.setName.sort(sortFunc);
        aggregations.rarityName.sort(sortFunc);
        aggregations.productTypeName.sort(sortFunc);

        return aggregations;
      },
    }),
    getSetsRaritiesAndCardTypes: builder.query<CardType, string>({
      query: (cardName: string) => cardName,
    }),
  }),
});

export const { useGetAggregationsQuery, useGetSetsRaritiesAndCardTypesQuery } =
  tcgPlayerApi;
