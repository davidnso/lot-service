export type RegistrationInformation = {
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber:string;
  addresses: Address[];
};

export type Address = {
  streetAddress: string;
  streetAddress2: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
};

export type StoreRegistrationInfo = { 
    name: string,
    owner: string,
    bannerImgUrl: string,
    addresses: Address[],
    tier: string
    dateCreated: string
}

export type searchQueryParams = {
  text: string,
  filters?: {
    gender?: string[];
    kids?: string[];
    priceRange?: {
      from: string;
      to: string;
    };
    color?: string[];
    size?: string[];
  };
  limit: string;
  sortby?: {
    date?: number;
    price?: number;
    name?: number;
  };
}