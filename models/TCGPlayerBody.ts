export interface TCGPlayerBody {
  algorithm: string;
  from: number;
  size: number;
  filters: TCGPlayerBodyFilters;
  listingSearch: ListingSearch;
  context: TCGPlayerBodyContext;
  settings: Settings;
  sort: Sort;
}

export interface TCGPlayerBodyContext {
  cart: Sort;
  shippingCountry: string;
}

export interface Sort {}

export interface TCGPlayerBodyFilters {
  term: Term;
  range: Sort;
  match: Sort;
}

export interface Term {
  productLineName: string[];
  setName?: string[];
  cardType?: string[];
  rarityName?: string[];
  productTypeName?: string[];
}

export interface ListingSearch {
  context: ListingSearchContext;
  filters: ListingSearchFilters;
}

export interface ListingSearchContext {
  cart: Sort;
}

export interface ListingSearchFilters {
  term: FluffyTerm;
  range: Range;
  exclude: Exclude;
}

export interface Exclude {
  channelExclusion: number;
}

export interface Range {
  quantity: Quantity;
}

export interface Quantity {
  gte: number;
}

export interface FluffyTerm {
  sellerStatus: string;
  channelId: number;
}

export interface Settings {
  useFuzzySearch: boolean;
  didYouMean: Sort;
}
