export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  lat: number;
  lng: number;
  hours: string;
  isPrimary: boolean;
}

export const storeLocations: StoreLocation[] = [
  {
    id: 'davangere',
    name: 'BS Channabasappa Silks & Sarees',
    address: 'P.B. Road, Near Old Bus Stand',
    city: 'Davangere',
    state: 'Karnataka',
    pincode: '577001',
    phone: '+91 8192 234567',
    lat: 14.4644,
    lng: 75.9219,
    hours: '10:00 AM – 9:00 PM',
    isPrimary: true,
  },
  {
    id: 'bangalore',
    name: 'BS Channabasappa - Gandhi Bazaar',
    address: 'Gandhi Bazaar Main Road, Basavanagudi',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560004',
    phone: '+91 80 2667 8901',
    lat: 12.9422,
    lng: 77.5711,
    hours: '10:00 AM – 8:30 PM',
    isPrimary: true,
  },
  {
    id: 'hubli',
    name: 'BS Channabasappa - Hubli',
    address: 'Koppikar Road, Near Clock Tower',
    city: 'Hubli',
    state: 'Karnataka',
    pincode: '580020',
    phone: '+91 836 2356789',
    lat: 15.3647,
    lng: 75.1240,
    hours: '10:00 AM – 8:00 PM',
    isPrimary: false,
  },
  {
    id: 'belgaum',
    name: 'BS Channabasappa - Belgaum',
    address: 'Congress Road, Tilakwadi',
    city: 'Belgaum',
    state: 'Karnataka',
    pincode: '590006',
    phone: '+91 831 2468101',
    lat: 15.8497,
    lng: 74.4977,
    hours: '10:00 AM – 8:00 PM',
    isPrimary: false,
  },
];
