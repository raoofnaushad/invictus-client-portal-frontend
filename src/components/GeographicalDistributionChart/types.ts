
export interface RegionData {
  name: string;
  value: number;
  color: string;
}

export interface CountryData {
  code: string;
  name: string;
  percentage: number;
}

export interface CountryGroup {
  name: string;
  color: string;
  countries: CountryData[];
  regionName: string;
}
