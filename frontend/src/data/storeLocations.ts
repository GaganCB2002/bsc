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
    name: 'BSC Exclusive - Davangere',
    address: 'Medical College Rd, MCC B Block, Opposite Bapuji Dental College',
    city: 'Davangere',
    state: 'Karnataka',
    pincode: '577004',
    phone: '+91 8192 272180',
    lat: 14.4644,
    lng: 75.9219,
    hours: '10:00 AM – 8:00 PM (Daily)',
    isPrimary: true,
  },
  {
    id: 'belgaum',
    name: 'BSC Exclusive - Belgaum',
    address: 'No1, Shukrawar Peth Road, 1st Gate Road, Tilakwadi',
    city: 'Belgaum',
    state: 'Karnataka',
    pincode: '590006',
    phone: '+91 831 2468101',
    lat: 15.8497,
    lng: 74.4977,
    hours: '10:00 AM – 8:00 PM',
    isPrimary: false,
  },
  {
    id: 'shivamogga',
    name: 'BSC Exclusive - Shivamogga',
    address: 'B.H. Road, Opposite Royal Orchid Hotel, Near Parekh Vinayak Mall',
    city: 'Shivamogga',
    state: 'Karnataka',
    pincode: '577201',
    phone: '+91 8182 256789',
    lat: 13.9299,
    lng: 75.5681,
    hours: '10:00 AM – 8:00 PM',
    isPrimary: false,
  },
];
