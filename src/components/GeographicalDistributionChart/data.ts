
import { RegionData, CountryData, CountryGroup } from './types';

// Country names mapping
export const countryNames: { [key: string]: string } = {
  'JP': 'Japan', 'KR': 'South Korea', 'CN': 'China', 'HK': 'Hong Kong', 'TW': 'Taiwan',
  'PH': 'Philippines', 'VN': 'Vietnam', 'LA': 'Laos', 'KH': 'Cambodia', 'TH': 'Thailand',
  'MM': 'Myanmar', 'MY': 'Malaysia', 'SG': 'Singapore', 'ID': 'Indonesia', 'BN': 'Brunei',
  'TL': 'East Timor', 'IN': 'India', 'PK': 'Pakistan', 'BD': 'Bangladesh', 'NP': 'Nepal',
  'BT': 'Bhutan', 'LK': 'Sri Lanka', 'MV': 'Maldives', 'AU': 'Australia', 'NZ': 'New Zealand',
  'NO': 'Norway', 'SE': 'Sweden', 'DK': 'Denmark', 'DE': 'Germany', 'NL': 'Netherlands',
  'BE': 'Belgium', 'LU': 'Luxembourg', 'ES': 'Spain', 'FR': 'France', 'PL': 'Poland',
  'CZ': 'Czech Republic', 'AT': 'Austria', 'CH': 'Switzerland', 'LI': 'Liechtenstein',
  'SK': 'Slovakia', 'HU': 'Hungary', 'SI': 'Slovenia', 'IT': 'Italy', 'SM': 'San Marino',
  'HR': 'Croatia', 'BA': 'Bosnia and Herzegovina', 'ME': 'Montenegro', 'AL': 'Albania',
  'MK': 'North Macedonia', 'GB': 'United Kingdom', 'IE': 'Ireland', 'IS': 'Iceland',
  'PT': 'Portugal', 'US': 'United States', 'CA': 'Canada', 'MX': 'Mexico', 'BR': 'Brazil',
  'AR': 'Argentina', 'CL': 'Chile', 'PE': 'Peru', 'EC': 'Ecuador', 'CO': 'Colombia',
  'VE': 'Venezuela', 'BO': 'Bolivia', 'PY': 'Paraguay', 'UY': 'Uruguay', 'RU': 'Russia',
  'TN': 'Tunisia', 'ZA': 'South Africa', 'EG': 'Egypt', 'MA': 'Morocco', 'NG': 'Nigeria',
  'KE': 'Kenya', 'ET': 'Ethiopia', 'GH': 'Ghana', 'TR': 'Turkey', 'SA': 'Saudi Arabia',
  'AE': 'UAE', 'IL': 'Israel', 'FI': 'Finland', 'EE': 'Estonia', 'LV': 'Latvia',
  'LT': 'Lithuania', 'BY': 'Belarus', 'UA': 'Ukraine', 'MD': 'Moldova', 'RO': 'Romania',
  'BG': 'Bulgaria', 'GR': 'Greece', 'CY': 'Cyprus'
};

// Data for regions
export const regionData: RegionData[] = [
  { name: 'APAC', value: 40, color: '#212121' },
  { name: 'EMEA', value: 25, color: '#26c281' },
  { name: 'AMER', value: 20, color: '#8e9bf2' },
  { name: 'Others', value: 15, color: '#a2d9f5' },
];

// Generate country percentages within each region
export const generateCountryPercentages = (countries: string[], totalRegionPercentage: number): CountryData[] => {
  const basePercentage = totalRegionPercentage / countries.length;
  const variations = countries.map(() => (Math.random() - 0.5) * basePercentage * 0.8);
  
  let runningTotal = 0;
  const countryData = countries.map((code, index) => {
    let percentage;
    if (index === countries.length - 1) {
      percentage = totalRegionPercentage - runningTotal;
    } else {
      percentage = Math.max(0.1, basePercentage + variations[index]);
      runningTotal += percentage;
    }
    
    return {
      code,
      name: countryNames[code] || code,
      percentage: Math.round(percentage * 100) / 100
    };
  });

  return countryData.sort((a, b) => b.percentage - a.percentage);
};

// Define country groups with their respective percentages and colors
export const countryGroups: CountryGroup[] = [
  {
    name: '40%',
    color: '#212121',
    regionName: 'APAC',
    countries: generateCountryPercentages([
      'JP', 'KR', 'CN', 'HK', 'TW', 'PH', 'VN', 'LA', 'KH', 'TH', 
      'MM', 'MY', 'SG', 'ID', 'BN', 'TL', 'IN', 'PK', 'BD', 'NP', 
      'BT', 'LK', 'MV', 'AU', 'NZ'
    ], 40)
  },
  {
    name: '25%',
    color: '#26c281',
    regionName: 'EMEA',
    countries: generateCountryPercentages([
      'NO', 'SE', 'DK', 'DE', 'NL', 'BE', 'LU', 'ES', 'FR', 'PL',
      'CZ', 'AT', 'CH', 'LI', 'SK', 'HU', 'SI', 'IT', 'SM', 'HR',
      'BA', 'ME', 'AL', 'MK', 'GB', 'IE', 'IS', 'PT', 'TN', 'ZA', 
      'EG', 'MA', 'NG', 'KE', 'ET', 'GH', 'TR'
    ], 25)
  },
  {
    name: '20%',
    color: '#8e9bf2',
    regionName: 'AMER',
    countries: generateCountryPercentages([
      'US', 'CA', 'MX', 'BR', 'AR', 'CL', 'PE', 'EC', 'CO', 'VE', 
      'BO', 'PY', 'UY'
    ], 20)
  },
  {
    name: '15%',
    color: '#a2d9f5',
    regionName: 'Others',
    countries: generateCountryPercentages([
      'RU', 'FI', 'EE', 'LV', 'LT', 'BY', 'UA', 'MD', 'RO', 'BG', 
      'GR', 'CY'
    ], 15)
  }
];
