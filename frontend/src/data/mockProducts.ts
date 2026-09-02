import { type AgeGroup, getAgeGroup } from '../utils/ageRecommendations';

export interface Product {
  id: string;
  name: string;
  category: 'men' | 'women' | 'kids';
  subcategory: string;
  price: number;
  comparePrice?: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
  ageGroups: AgeGroup[];
  isNew?: boolean;
  isBestseller?: boolean;
  isSale?: boolean;
}

const womenImages = [
  '1610030469983-98e550d6193c', '1771654099745-73a4a4d09bcd', '1771654805161-442c6aab7b55',
  '1771507056578-f9675a2a8f8a', '1768341395956-fed92f537228', '1769275061356-a038b498c4a7',
  '1594633312681-425c7b97ccd1', '1583391733956-6c78276477e2', '1610030469983-98e550d6193c',
  '1524504388940-b1c1722653e1', '1512436991641-6745cdb1723f', '1515886657613-9f3515b0c78f'
];

const menImages = [
  '1580489944761-15a19d654956', '1438761681033-6461ffad8d80', '1522075469751-3a6694fb2f61',
  '1441986300917-64674bd600d8', '1507003211169-0a1dd7228f2d', '1472099645785-5658abf4ff4e',
  '1519085360753-af011ad232e1', '1463453091185-61582044d556', '1500648767791-00dcc994a43e',
  '1506794778202-cad84cf45f1d', '1492562080023-ab3db95bfbce', '1519345182560-3f2917c472ef'
];

const kidsImages = [
  '1518831959646-742c3a14ebf7', '1503944583220-79d8926ad5e2', '1504439468489-c8920d796a29',
  '1519238263530-99bdd11df2ea', '1509062522246-3755977927d7', '1471286174890-90c5368d2f8a',
  '1504432842672-1a760a0f1a27', '1518831959646-742c3a14ebf7', '1503944583220-79d8926ad5e2',
  '1515488042301-aa5e95f7f39e', '1504432842672-1a760a0f1a27', '1471286174890-90c5368d2f8a'
];

const womenStyles: Record<string, string[]> = {
  'Sarees': ['Kanchipuram Silk Saree', 'Banarasi Silk Saree', 'Mysore Silk Saree', 'Tussar Silk Saree', 'Patola Saree', 'Kota Doria Saree', 'Chanderi Saree', 'Maheshwari Saree', 'Pochampally Saree', 'Uppada Silk Saree', 'Bhagalpuri Silk Saree', 'Kanjeevaram Bridal Saree', 'Art Silk Saree', 'Organza Saree', 'Chiffon Saree', 'Georgette Saree', 'Crepe Saree', 'Net Saree', 'Raw Silk Saree', 'Dupion Silk Saree'],
  'Lehengas': ['Bridal Lehenga', 'A-Line Lehenga', 'Fish Cut Lehenga', 'Circular Lehenga', 'Panel Lehenga', 'Mermaid Lehenga', 'Straight Cut Lehenga', 'Tier Lehenga', 'Sharara Lehenga', 'Gharara Set'],
  'Suits': ['Anarkali Suit', 'Salwar Kameez', 'Palazzo Suit', 'Sharara Set', 'Patiala Suit', 'Churidar Suit', 'Straight Cut Suit', 'A-Line Suit', 'Afghani Suit', 'Dhoti Suit'],
  'Gowns': ['Evening Gown', 'Ball Gown', 'Cocktail Gown', 'A-Line Gown', 'Mermaid Gown', 'Empire Gown', 'Trumpet Gown', 'Column Gown', 'High-Low Gown', 'Off-Shoulder Gown'],
  'Kurtis': ['Designer Kurti', 'A-Line Kurti', 'Straight Kurti', 'Anarkali Kurti', 'Flared Kurti', 'Tail Cut Kurti', 'Shirt Kurti', 'Denim Kurti', 'Printed Kurti', 'Embroidered Kurti'],
  'Dupattas': ['Banarasi Dupatta', 'Silk Dupatta', 'Chiffon Dupatta', 'Georgette Dupatta', 'Phulkari Dupatta', 'Kashmiri Dupatta', 'Bandhani Dupatta', 'Leheriya Dupatta', 'Net Dupatta', 'Organza Dupatta']
};

const menStyles: Record<string, string[]> = {
  'Kurtas': ['Silk Kurta', 'Cotton Kurta', 'Linen Kurta', 'Chikankari Kurta', 'Pathani Kurta', 'Short Kurta', 'Long Kurta', 'Printed Kurta', 'Embroidered Kurta', 'Designer Kurta'],
  'Sherwanis': ['Classic Sherwani', 'Achkan Sherwani', 'Indo-Western Sherwani', 'Jodhpuri Sherwani', 'Bandhgala Sherwani', 'Velvet Sherwani', 'Embroidered Sherwani', 'Prince Coat', 'Modi Jacket Set', 'Nehru Jacket Set'],
  'Shirts': ['Silk Shirt', 'Cotton Shirt', 'Linen Shirt', 'Khadi Shirt', 'Printed Shirt', 'Solid Shirt', 'Striped Shirt', 'Checks Shirt', 'Formal Shirt', 'Casual Shirt'],
  'Pants': ['Silk Dhoti', 'Cotton Dhoti', 'Linen Pants', 'Churidar', 'Pajama Set', 'Nehru Pants', 'Slim Fit Pants', 'Straight Pants', 'Dhoti Pants', 'Jodhpur Pants'],
  'Jackets': ['Nehru Jacket', 'Bandhgala Jacket', 'Silk Waistcoat', 'Velvet Jacket', 'Quilted Jacket', 'Denim Jacket', 'Printed Jacket', 'Embroidered Jacket', 'Cotton Jacket', 'Linen Jacket'],
  'Suits': ['Indo-Western Suit', 'Classic Suit', 'Brocade Suit', 'Tuxedo Set', 'Jodhpuri Suit', 'Three-Piece Set', 'Slim Fit Suit', 'Angrakha Set', 'Achkan Set', 'Modern Suit']
};

const kidsStyles: Record<string, string[]> = {
  'Girls': ['Lehenga Choli', 'Half Saree', 'Gown', 'Kurti Set', 'Sharara Set', 'Anarkali', 'Frock', 'Silk Dress', 'Party Frock', 'Ethnic Gown'],
  'Boys': ['Kurta Pajama', 'Sherwani Set', 'Nehru Jacket Set', 'Dhoti Kurta', 'Silk Suit', 'Prince Coat', 'Pathani Set', 'Indo-Western Set', 'Printed Kurta', 'Festive Set'],
  'Infant': ['Silk Romper', 'Ethnic Dungaree', 'Festive Onesie', 'Kurta Set (0-2yr)', 'Lehenga (0-2yr)', 'Silk Frock', 'Ethnic Shorts Set', 'Cotton Kurta', 'Printed Dress', 'Party Wear Set'],
  'Teens': ['Trendy Kurta', 'Fusion Set', 'Denim Jacket Set', 'Printed Shirt Set', 'Graphic Kurti', 'Modern Sherwani', 'Stylish Gown', 'Casual Ethnic Set', 'Sporty Kurta', 'Funky Frock']
};

const colorPrefixes = ['Ruby', 'Emerald', 'Sapphire', 'Pearl', 'Ivory', 'Crimson', 'Indigo', 'Coral', 'Mauve', 'Teal', 'Maroon', 'Navy', 'Blush', 'Olive', 'Charcoal', 'Mint', 'Rust', 'Lavender', 'Turquoise', 'Burgundy', 'Forest', 'Midnight', 'Amber', 'Copper', 'Bronze', 'Scarlet', 'Jade', 'Onyx', 'Rose', 'Sky'];

const occasionTags: string[][] = [
  ['wedding', 'bridal', 'premium'],
  ['party', 'evening', 'glamorous'],
  ['festive', 'celebration', 'colorful'],
  ['casual', 'everyday', 'comfort'],
  ['office', 'professional', 'formal'],
  ['traditional', 'heritage', 'classic'],
  ['modern', 'trendy', 'contemporary'],
  ['summer', 'lightweight', 'breathable'],
  ['designer', 'exclusive', 'luxury'],
  ['handloom', 'artisan', 'handmade']
];

const ageGroupSets: AgeGroup[][] = [
  ['teens', 'young-adults'],
  ['young-adults', 'adults'],
  ['adults', 'mature-adults'],
  ['mature-adults', 'seniors'],
  ['teens', 'young-adults', 'adults'],
  ['young-adults', 'adults', 'mature-adults'],
  ['adults', 'mature-adults', 'seniors'],
  ['teens', 'young-adults'],
  ['young-adults', 'adults'],
  ['adults', 'mature-adults']
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateWomenProducts(): Product[] {
  const products: Product[] = [];
  const subcats = Object.keys(womenStyles);
  let id = 1;

  for (const subcat of subcats) {
    const styles = womenStyles[subcat];
    for (let cycle = 0; cycle < 25; cycle++) {
      for (const style of styles) {
        const prefix = colorPrefixes[id % colorPrefixes.length];
        const imgId = womenImages[id % womenImages.length];
        const seed = id * 7 + 13;
        const price = Math.floor(seededRandom(seed) * 18000) + 1200;
        const tags = occasionTags[id % occasionTags.length];
        const ages = ageGroupSets[id % ageGroupSets.length];
        const rating = 3.5 + seededRandom(seed + 1) * 1.5;
        const isNew = id % 7 === 0;
        const isBestseller = id % 11 === 0;
        const isSale = id % 13 === 0;

        products.push({
          id: `w-${id}`,
          name: `${prefix} ${style}`,
          category: 'women',
          subcategory: subcat,
          price,
          comparePrice: isSale ? Math.floor(price * 1.4) : undefined,
          image: `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&q=80&w=600&h=750`,
          description: `Exquisite ${style.toLowerCase()} featuring premium silk craftsmanship. Handcrafted by skilled artisans with attention to every detail. Perfect for weddings, festivals, and special occasions.`,
          rating: Math.round(rating * 10) / 10,
          reviews: Math.floor(seededRandom(seed + 2) * 500) + 5,
          inStock: seededRandom(seed + 3) > 0.1,
          tags,
          ageGroups: ages,
          isNew,
          isBestseller,
          isSale,
        });
        id++;
      }
    }
  }
  return products;
}

function generateMenProducts(): Product[] {
  const products: Product[] = [];
  const subcats = Object.keys(menStyles);
  let id = 1;

  for (const subcat of subcats) {
    const styles = menStyles[subcat];
    for (let cycle = 0; cycle < 25; cycle++) {
      for (const style of styles) {
        const prefix = colorPrefixes[id % colorPrefixes.length];
        const imgId = menImages[id % menImages.length];
        const seed = id * 11 + 29;
        const price = Math.floor(seededRandom(seed) * 15000) + 999;
        const tags = occasionTags[id % occasionTags.length];
        const ages = ageGroupSets[id % ageGroupSets.length];
        const rating = 3.5 + seededRandom(seed + 1) * 1.5;
        const isNew = id % 7 === 0;
        const isBestseller = id % 11 === 0;
        const isSale = id % 13 === 0;

        products.push({
          id: `m-${id}`,
          name: `${prefix} ${style}`,
          category: 'men',
          subcategory: subcat,
          price,
          comparePrice: isSale ? Math.floor(price * 1.4) : undefined,
          image: `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&q=80&w=600&h=750`,
          description: `Premium ${style.toLowerCase()} crafted with the finest fabrics. Designed for the modern Indian man who values tradition and style. Ideal for ceremonies, festivals, and daily wear.`,
          rating: Math.round(rating * 10) / 10,
          reviews: Math.floor(seededRandom(seed + 2) * 400) + 5,
          inStock: seededRandom(seed + 3) > 0.1,
          tags,
          ageGroups: ages,
          isNew,
          isBestseller,
          isSale,
        });
        id++;
      }
    }
  }
  return products;
}

function generateKidsProducts(): Product[] {
  const products: Product[] = [];
  const subcats = Object.keys(kidsStyles);
  let id = 1;

  for (const subcat of subcats) {
    const styles = kidsStyles[subcat];
    for (let cycle = 0; cycle < 25; cycle++) {
      for (const style of styles) {
        const prefix = colorPrefixes[id % colorPrefixes.length];
        const imgId = kidsImages[id % kidsImages.length];
        const seed = id * 17 + 37;
        const price = Math.floor(seededRandom(seed) * 5000) + 499;
        const tags = occasionTags[id % occasionTags.length];
        const ages: AgeGroup[] = subcat === 'Infant' ? ['teens'] : subcat === 'Teens' ? ['teens', 'young-adults'] : ['teens'];
        const rating = 3.5 + seededRandom(seed + 1) * 1.5;
        const isNew = id % 7 === 0;
        const isBestseller = id % 11 === 0;
        const isSale = id % 13 === 0;

        products.push({
          id: `k-${id}`,
          name: `${prefix} ${style}`,
          category: 'kids',
          subcategory: subcat,
          price,
          comparePrice: isSale ? Math.floor(price * 1.4) : undefined,
          image: `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&q=80&w=600&h=750`,
          description: `Adorable ${style.toLowerCase()} for your little ones. Made with soft, skin-friendly fabrics ensuring comfort and style. Perfect for birthdays, festivals, and family gatherings.`,
          rating: Math.round(rating * 10) / 10,
          reviews: Math.floor(seededRandom(seed + 2) * 300) + 5,
          inStock: seededRandom(seed + 3) > 0.1,
          tags,
          ageGroups: ages,
          isNew,
          isBestseller,
          isSale,
        });
        id++;
      }
    }
  }
  return products;
}

export const productsData: Product[] = [
  ...generateWomenProducts(),
  ...generateMenProducts(),
  ...generateKidsProducts(),
];

export const getProductsByCategory = (category: string): Product[] => {
  switch (category) {
    case 'women': return productsData.filter(p => p.category === 'women');
    case 'men': return productsData.filter(p => p.category === 'men');
    case 'kids': return productsData.filter(p => p.category === 'kids');
    case 'new-arrivals': return productsData.filter(p => p.isNew);
    case 'bestsellers': return productsData.filter(p => p.isBestseller);
    case 'sale': return productsData.filter(p => p.isSale);
    case 'silk': return productsData.filter(p => p.name.toLowerCase().includes('silk'));
    default: return productsData;
  }
};

export const getProductsBySubcategory = (category: string, subcategory: string): Product[] => {
  return productsData.filter(p => p.category === category && p.subcategory === subcategory);
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

export const getProductById = (id: string): Product | undefined => {
  return productsData.find(p => p.id === id);
};

export const getSubcategories = (category: string): string[] => {
  const subcats = new Set(productsData.filter(p => p.category === category).map(p => p.subcategory));
  return Array.from(subcats);
};

export const searchProducts = (query: string): Product[] => {
  const q = query.toLowerCase();
  return productsData.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q) ||
    p.tags.some(t => t.includes(q))
  );
};

export const getProductsByTag = (tag: string): Product[] => {
  return productsData.filter(p => p.tags.includes(tag));
};

export const getTotalProductCount = (): number => productsData.length;

export const getCategoryCounts = () => ({
  women: productsData.filter(p => p.category === 'women').length,
  men: productsData.filter(p => p.category === 'men').length,
  kids: productsData.filter(p => p.category === 'kids').length,
  total: productsData.length,
});