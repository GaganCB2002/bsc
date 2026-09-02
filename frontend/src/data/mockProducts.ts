import { type AgeGroup, getAgeGroup } from '../utils/ageRecommendations';

export interface Product {
  id: string;
  name: string;
  category: 'men' | 'women' | 'kids';
  price: number;
  comparePrice?: number;
  image: string;
  description: string;
  ageGroups: AgeGroup[];
  tags: string[];
}

const womenImages = [
  '1610030469983-98e550d6193c',
  '1771654099745-73a4a4d09bcd',
  '1771654805161-442c6aab7b55',
  '1771507056578-f9675a2a8f8a',
  '1768341395956-fed92f537228',
  '1769275061356-a038b498c4a7'
];

const menImages = [
  '1580489944761-15a19d654956',
  '1438761681033-6461ffad8d80',
  '1522075469751-3a6694fb2f61',
  '1441986300917-64674bd600d8',
  '1580489944761-15a19d654956',
  '1438761681033-6461ffad8d80'
];

const kidsImages = [
  '1518831959646-742c3a14ebf7',
  '1518831959646-742c3a14ebf7',
  '1522075469751-3a6694fb2f61',
  '1441986300917-64674bd600d8',
  '1518831959646-742c3a14ebf7',
  '1522075469751-3a6694fb2f61'
];

const generateProducts = (category: 'men' | 'women' | 'kids', count: number): Product[] => {
  const products: Product[] = [];
  const images = category === 'men' ? menImages : category === 'women' ? womenImages : kidsImages;
  
  const prefixes = {
    men: ['Classic', 'Premium', 'Royal', 'Executive', 'Heritage', 'Signature', 'Modern', 'Urban', 'Refined', 'Contemporary'],
    women: ['Bridal', 'Kanchipuram', 'Banarasi', 'Designer', 'Pure Silk', 'Traditional', 'Trendy', 'Fusion', 'Elegant', 'Party'],
    kids: ['Festive', 'Playful', 'Comfort', 'Little', 'Junior', 'Premium', 'Cute', 'Colorful', 'Soft', 'Smart']
  };

  const types = {
    men: ['Kurta Set', 'Sherwani', 'Silk Shirt', 'Dhoti Combo', 'Nehru Jacket', 'Linen Kurta', 'Indo-Western Suit', 'Silk Waistcoat', 'Cotton Sherwani', 'Party Kurta'],
    women: ['Saree', 'Lehenga', 'Salwar Suit', 'Anarkali', 'Silk Drape', 'Georgette Saree', 'Crop Top Set', 'Palazzo Set', 'Designer Lehenga', 'Party Gown'],
    kids: ['Ethnic Suit', 'Lehenga Choli', 'Kurta Pajama', 'Frock', 'Silk Set', 'Dungaree Set', 'Printed Kurti', 'Sharara Set', 'Sherwani Set', 'Festive Dress']
  };

  const tagSets = {
    men: [
      ['trendy', 'modern', 'youthful'],
      ['elegant', 'premium', 'classic'],
      ['traditional', 'silk', 'handloom'],
      ['casual', 'comfort', 'everyday'],
      ['party', 'designer', 'contemporary'],
      ['office', 'formal', 'professional'],
      ['festive', 'celebration', 'wedding'],
      ['summer', 'cotton', 'lightweight'],
      ['winter', 'woolen', 'warm'],
      ['fusion', 'indo-western', 'modern']
    ],
    women: [
      ['trendy', 'party', 'designer'],
      ['bridal', 'wedding', 'premium'],
      ['traditional', 'silk', 'handloom'],
      ['casual', 'comfort', 'everyday'],
      ['elegant', 'classic', 'sophisticated'],
      ['fusion', 'contemporary', 'modern'],
      ['festive', 'celebration', 'colorful'],
      ['office', 'professional', 'formal'],
      ['summer', 'light', 'georgette'],
      ['evening', 'glamorous', 'statement']
    ],
    kids: [
      ['cute', 'colorful', 'playful'],
      ['comfort', 'soft', 'easy-wear'],
      ['festive', 'celebration', 'bright'],
      ['traditional', 'ethnic', 'cultural'],
      ['fun', 'trendy', 'youthful'],
      ['premium', 'silk', 'special'],
      ['everyday', 'casual', 'durable'],
      ['summer', 'cotton', 'breathable'],
      ['winter', 'warm', 'cozy'],
      ['party', 'designer', 'fancy']
    ]
  };

  const ageGroupAssignments: AgeGroup[][] = [
    ['young-adults', 'adults'],
    ['adults', 'mature-adults'],
    ['teens', 'young-adults'],
    ['mature-adults', 'seniors'],
    ['young-adults', 'adults'],
    ['teens', 'young-adults', 'adults'],
    ['adults', 'mature-adults'],
    ['teens', 'young-adults'],
    ['mature-adults', 'seniors'],
    ['young-adults']
  ];

  for (let i = 1; i <= count; i++) {
    const prefix = prefixes[category][(i - 1) % prefixes[category].length];
    const type = types[category][(i - 1) % types[category].length];
    const imageId = images[(i - 1) % images.length];
    const tags = tagSets[category][(i - 1) % tagSets[category].length];
    const ages = ageGroupAssignments[(i - 1) % ageGroupAssignments.length];
    
    const price = Math.floor(Math.random() * 15000) + 1500;
    products.push({
      id: `${category}-${i}`,
      name: `${prefix} ${type}`,
      category,
      price,
      comparePrice: Math.floor(price * 1.4),
      image: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=800&h=1000`,
      description: `Experience the finest craftsmanship with this exquisite ${type.toLowerCase()} from BSC Exclusive. Made with premium materials and designed for utmost comfort and elegance.`,
      ageGroups: category === 'kids' ? ['teens'] : ages,
      tags
    });
  }
  
  return products;
};

export const productsData: Product[] = [
  ...generateProducts('men', 30),
  ...generateProducts('women', 30),
  ...generateProducts('kids', 30)
];

export const getProductsByCategory = (category: string) => {
  if (category === 'new-arrivals') {
    return productsData.slice(0, 10).concat(productsData.slice(30, 40)).concat(productsData.slice(60, 70));
  }
  if (category === 'collections' || category === 'enterprise') {
    return productsData.slice(10, 20).concat(productsData.slice(40, 50)).concat(productsData.slice(70, 80));
  }
  if (category === 'courses' || category === 'all' || category === 'silk' || category === 'business' || category === 'care') {
    return productsData.slice(0, 24);
  }
  const filtered = productsData.filter(p => p.category === category);
  return filtered.length > 0 ? filtered : productsData.slice(0, 12);
};

export const getProductsByAgeGroup = (ageGroup: AgeGroup): Product[] => {
  return productsData.filter(p => p.ageGroups.includes(ageGroup));
};

export const getPersonalizedProducts = (age: number, gender: string, limit: number = 12): Product[] => {
  const group: AgeGroup = getAgeGroup(age);
  
  let filtered = productsData.filter(p => p.ageGroups.includes(group));
  
  if (gender === 'male') {
    const menProducts = filtered.filter(p => p.category === 'men');
    if (menProducts.length >= limit) filtered = menProducts;
  } else if (gender === 'female') {
    const womenProducts = filtered.filter(p => p.category === 'women');
    if (womenProducts.length >= limit) filtered = womenProducts;
  }
  
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
};

export const getProductById = (id: string) => {
  return productsData.find(p => p.id === id);
};
