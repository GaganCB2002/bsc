export interface Product {
  id: string;
  name: string;
  category: 'men' | 'women' | 'kids';
  price: number;
  image: string;
  description: string;
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
    men: ['Classic', 'Premium', 'Royal', 'Executive', 'Heritage', 'Signature'],
    women: ['Bridal', 'Kanchipuram', 'Banarasi', 'Designer', 'Pure Silk', 'Traditional'],
    kids: ['Festive', 'Playful', 'Comfort', 'Little', 'Junior', 'Premium']
  };

  const types = {
    men: ['Kurta Set', 'Sherwani', 'Silk Shirt', 'Dhoti Combo', 'Nehru Jacket'],
    women: ['Saree', 'Lehenga', 'Salwar Suit', 'Anarkali', 'Silk Drape'],
    kids: ['Ethnic Suit', 'Lehenga Choli', 'Kurta Pajama', 'Frock', 'Silk Set']
  };

  for (let i = 1; i <= count; i++) {
    const prefix = prefixes[category][i % prefixes[category].length];
    const type = types[category][i % types[category].length];
    const imageId = images[i % images.length];
    
    products.push({
      id: `${category}-${i}`,
      name: `${prefix} ${type}`,
      category,
      price: Math.floor(Math.random() * 15000) + 1500,
      image: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=800&h=1000`,
      description: `Experience the finest craftsmanship with this exquisite ${type.toLowerCase()} from BSC Exclusive. Made with premium materials and designed for utmost comfort and elegance.`
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
  return productsData.filter(p => p.category === category);
};

export const getProductById = (id: string) => {
  return productsData.find(p => p.id === id);
};
