// ADDRESS LIST INTERFACES

export interface IAddressItem {
  id: string;
  place_name: string;
  relevance: number;
  geometry: IAddressGeometry;
  context: Array<IAddressContext>;
}

export interface IAddressContext {
  id: string;
  text: string;
  short_code: string;
}

export interface ICoordinates {
  lat: number;
  long: number;
}

export interface ISelectedAddress {
  placeName: string;
  coordinates: ICoordinates;
  postalCode: string;
  street: string;
  neighborhood: string;
  state: string;
}

export interface IAddress {
  data: Array<IAddressItem>;
  value: string;
  selected: ISelectedAddress;
  isAddressSelected: boolean;
}

// CALCULATED DIRECTIONS INTERFACES

export interface IAddressGeometry {
  coordinates: Array<Array<number>>;
  type: string;
}

export interface ISteps {
  distance: number;
  driving_side: string;
  duration: number;
  geometry: IAddressGeometry;
  mode: string;
  name: string;
}

export interface IRoute {
  distance: number;
  duration: number;
  geometry: IAddressGeometry;
  legs: Array<ISteps>;
}

export interface IWaypoint {
  distance: number;
  name: string;
  location: Array<number>;
}

export interface IDeliverySearchResult {
  uuid: string;
  // first route = from location.
  // second route = to location.
  routes: Array<IRoute>;
  waypoints: Array<IWaypoint>;
  fromAddress: ISelectedAddress;
  toAddress: ISelectedAddress;
  rates: IRates;
  shipmentData: IShipmentData;
}

// RATES
export interface IRateShape {
  days: number;
  estimatedDeliveryDate: string;
  estimatedPickupDate: string;
  price: number;
  serviceLevel: string;
  serviceType: string;
}

interface IRate {
  bestValue: IRateShape;
  flatbed: IRateShape;
  reefer: IRateShape;
  lowest: IRateShape;
  fastest: IRateShape;
  nextDay: IRateShape;
}

export interface IRates {
  // Only accounting for one type of rate for testing.
  dedicated: IRate;
  standard: IRate;
  guaranteed: IRate;
}

export interface IShipmentData {
  quantity: string;
  type: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
}
