import React, { Dispatch } from "react";
import { TCGPlayer } from "../../models/TCGPlayer";
import { AppDispatch } from "../store";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

// const searchURL = "https://mp-search-api.tcgplayer.com/v1/search/request?q=";
const searchURL = "http://localhost:8010/proxy/v1/search/request?q=";
export const imageURLSmall =
  "https://product-images.tcgplayer.com/fit-in/50x50/";
export const imageURLFull =
  "https://product-images.tcgplayer.com/fit-in/420x420/";
export const imageURLCard =
  "https://product-images.tcgplayer.com/fit-in/200x279/";
const corsProxy = "https://api.allorigins.win/raw?url=";
const emptyBody = {
  algorithm: "sales_exp_fields_experiment",
  from: 0,
  size: 50,
  filters: {
    term: {
      productLineName: ["yugioh"],
      productTypeName: ["Cards"],
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

export const getCardTypeSetsAndRarities = () => {
  const headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(emptyBody),
  };

  fetch(`${corsProxy}${searchURL}}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      let parsedResult: TCGPlayer = result;
      return parsedResult.results[0].aggregations;
    });
};

export const searchCards = (
  cardName: string,
  dispatch: AppDispatch,
  setSearchData: ActionCreatorWithPayload<any[], "searchCards/addSearchedCards">
) => {
  const headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(emptyBody),
  };

  fetch(`${searchURL}${encodeURIComponent(cardName)}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      let parsedResult: TCGPlayer = result;

      let resultArray: any[] = parsedResult.results[0].results.map((result) => {
        return {
          id: result.productId,
          cardName: result.productName,
          setName: result.setName,
          rarity: result.rarityName,
          price: result.marketPrice,
          picture: result.productId,
          number: result.customAttributes.number,
          fullPicture: `${imageURLFull}${result.productId}.jpg`,
          quantity: 1,
        };
      });

      dispatch(setSearchData(resultArray));
      // setSearchData(resultArray);
    });
};
