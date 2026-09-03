export interface Product {
  id: string;
  name: string;
  category: 'women' | 'men' | 'kids';
  subcategory: string;
  price: number;
  comparePrice?: number;
  image: string;
  images: string[];
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isSale?: boolean;
  virtualTryOn?: boolean;
  garmentType?: 'top' | 'bottom' | 'dress' | 'outerwear' | 'accessory';
  brand?: string;
  colors?: string[];
  sizes?: string[];
}

const fashionImages: Record<string, string[]> = {
  outerwear: [
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&q=80&w=600&h=750',
  ],
  tops: [
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600&h=750',
  ],
  bottoms: [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600&h=750',
  ],
  dresses: [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1574607383476-f517f260d30b?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600&h=750',
  ],
  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600&h=750',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=600&h=750',
    'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80&w=600&h=750',
  ],
};

const womenProducts: Product[] = [
  {
    id: 'w-1', name: 'Camel Wool Trench Coat', category: 'women', subcategory: 'Coats',
    price: 449, comparePrice: 599, image: fashionImages.outerwear[0],
    images: fashionImages.outerwear, description: 'Classic double-breasted trench coat in premium camel wool. Timeless elegance for the modern woman.',
    rating: 4.8, reviews: 124, inStock: true, tags: ['new', 'bestseller', 'wedding', 'traditional'], isNew: true, isBestseller: true, isSale: true,
    virtualTryOn: true, garmentType: 'outerwear', brand: 'BSC Exclusive', colors: ['Camel', 'Black', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'w-2', name: 'Olive Bomber Jacket', category: 'women', subcategory: 'Jackets',
    price: 159, image: fashionImages.outerwear[1],
    images: fashionImages.outerwear, description: 'Satin-finish bomber jacket in olive green. Perfect for casual layering.',
    rating: 4.6, reviews: 89, inStock: true, tags: ['casual', 'festive'], virtualTryOn: true, garmentType: 'outerwear',
    brand: 'BSC Exclusive', colors: ['Olive', 'Black', 'Burgundy'], sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'w-3', name: 'Ivory Silk Blouse', category: 'women', subcategory: 'Tops',
    price: 129, image: fashionImages.tops[0],
    images: fashionImages.tops, description: 'Luxurious silk blouse with relaxed fit. Perfect for office or evening wear.',
    rating: 4.7, reviews: 156, inStock: true, tags: ['bestseller', 'festive', 'traditional'], isBestseller: true, virtualTryOn: true, garmentType: 'top',
    brand: 'BSC Exclusive', colors: ['Ivory', 'Blush', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'w-4', name: 'Midnight Velvet Dress', category: 'women', subcategory: 'Dresses',
    price: 289, comparePrice: 349, image: fashionImages.dresses[0],
    images: fashionImages.dresses, description: 'Floor-length velvet gown with subtle shimmer. Ideal for cocktail events.',
    rating: 4.9, reviews: 67, inStock: true, tags: ['party', 'sale', 'wedding', 'festive'], isSale: true, virtualTryOn: true, garmentType: 'dress',
    brand: 'BSC Exclusive', colors: ['Midnight', 'Emerald', 'Wine'], sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'w-5', name: 'High-Rise Tailored Trousers', category: 'women', subcategory: 'Bottoms',
    price: 149, image: fashionImages.bottoms[0],
    images: fashionImages.bottoms, description: 'Precision-cut wide-leg trousers in stretch wool blend.',
    rating: 4.5, reviews: 203, inStock: true, tags: ['office', 'traditional'], virtualTryOn: true, garmentType: 'bottom',
    brand: 'BSC Exclusive', colors: ['Black', 'Charcoal', 'Cream'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'w-6', name: 'Red Carpet Evening Gown', category: 'women', subcategory: 'Dresses',
    price: 599, comparePrice: 799, image: fashionImages.dresses[1],
    images: fashionImages.dresses, description: 'Show-stopping sequined gown with thigh-high slit.',
    rating: 4.9, reviews: 42, inStock: true, tags: ['party', 'luxury', 'traditional'], isSale: true, virtualTryOn: true, garmentType: 'dress',
    brand: 'BSC Exclusive', colors: ['Red', 'Black', 'Gold'], sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'w-7', name: 'Leather Crossbody Bag', category: 'women', subcategory: 'Accessories',
    price: 199, image: fashionImages.accessories[0],
    images: fashionImages.accessories, description: 'Italian leather crossbody with gold hardware.',
    rating: 4.7, reviews: 178, inStock: true, tags: ['bestseller', 'festive', 'traditional'], isBestseller: true,
    brand: 'BSC Exclusive', colors: ['Black', 'Tan', 'Burgundy'], sizes: ['One Size'],
  },
  {
    id: 'w-8', name: 'Chunky Platform Sneakers', category: 'women', subcategory: 'Shoes',
    price: 179, comparePrice: 219, image: fashionImages.shoes[0],
    images: fashionImages.shoes, description: 'Statement platform sneakers in premium leather.',
    rating: 4.6, reviews: 134, inStock: true, tags: ['casual', 'sale', 'wedding'], isSale: true,
    brand: 'BSC Exclusive', colors: ['White', 'Black', 'Pink'], sizes: ['5', '6', '7', '8', '9'],
  },
  {
    id: 'w-9', name: 'Cashmere Wrap Scarf', category: 'women', subcategory: 'Accessories',
    price: 89, image: fashionImages.accessories[1],
    images: fashionImages.accessories, description: 'Pure cashmere scarf in a versatile neutral tone.',
    rating: 4.8, reviews: 92, inStock: true, tags: ['new'], isNew: true,
    brand: 'BSC Exclusive', colors: ['Camel', 'Grey', 'Ivory'], sizes: ['One Size'],
  },
  {
    id: 'w-10', name: 'Pleated Midi Skirt', category: 'women', subcategory: 'Bottoms',
    price: 119, image: fashionImages.bottoms[1],
    images: fashionImages.bottoms, description: 'Flowing pleated midi skirt with elastic waistband.',
    rating: 4.5, reviews: 167, inStock: true, tags: ['casual', 'festive'], virtualTryOn: true, garmentType: 'bottom',
    brand: 'BSC Exclusive', colors: ['Black', 'Navy', 'Sage'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'w-11', name: 'Wool Blend Blazer', category: 'women', subcategory: 'Outerwear',
    price: 249, comparePrice: 329, image: fashionImages.outerwear[2],
    images: fashionImages.outerwear, description: 'Structured blazer in Italian wool blend. Power dressing redefined.',
    rating: 4.7, reviews: 145, inStock: true, tags: ['office', 'sale'], isSale: true, virtualTryOn: true, garmentType: 'outerwear',
    brand: 'BSC Exclusive', colors: ['Charcoal', 'Navy', 'Camel'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'w-12', name: 'Oversized Linen Shirt', category: 'women', subcategory: 'Tops',
    price: 99, image: fashionImages.tops[1],
    images: fashionImages.tops, description: 'Relaxed-fit linen shirt for effortless summer style.',
    rating: 4.4, reviews: 198, inStock: true, tags: ['casual', 'new'], isNew: true, virtualTryOn: true, garmentType: 'top',
    brand: 'BSC Exclusive', colors: ['White', 'Sky Blue', 'Sage'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
];

const menProducts: Product[] = [
  {
    id: 'm-1', name: 'Army Green Puffer Jacket', category: 'men', subcategory: 'Jackets',
    price: 189, comparePrice: 249, image: fashionImages.outerwear[1],
    images: fashionImages.outerwear, description: 'Insulated puffer jacket with matte finish. Warmth meets style.',
    rating: 4.7, reviews: 203, inStock: true, tags: ['new', 'sale'], isNew: true, isSale: true, virtualTryOn: true, garmentType: 'outerwear',
    brand: 'BSC Exclusive', colors: ['Army Green', 'Black', 'Navy'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'm-2', name: 'Indigo Denim Trucker Jacket', category: 'men', subcategory: 'Jackets',
    price: 119, image: fashionImages.outerwear[2],
    images: fashionImages.outerwear, description: 'Classic trucker silhouette in raw indigo denim.',
    rating: 4.6, reviews: 178, inStock: true, tags: ['bestseller', 'festive', 'traditional'], isBestseller: true, virtualTryOn: true, garmentType: 'outerwear',
    brand: 'BSC Exclusive', colors: ['Indigo', 'Light Wash', 'Black'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'm-3', name: 'Brown Leather Biker Jacket', category: 'men', subcategory: 'Jackets',
    price: 349, comparePrice: 449, image: fashionImages.outerwear[0],
    images: fashionImages.outerwear, description: 'Hand-finished genuine leather biker jacket. An investment piece.',
    rating: 4.9, reviews: 89, inStock: true, tags: ['luxury', 'sale'], isSale: true, virtualTryOn: true, garmentType: 'outerwear',
    brand: 'BSC Exclusive', colors: ['Brown', 'Black'], sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'm-4', name: 'Slim Fit Oxford Shirt', category: 'men', subcategory: 'Tops',
    price: 79, image: fashionImages.tops[0],
    images: fashionImages.tops, description: 'Premium cotton oxford with a modern slim fit.',
    rating: 4.5, reviews: 267, inStock: true, tags: ['casual', 'bestseller'], isBestseller: true, virtualTryOn: true, garmentType: 'top',
    brand: 'BSC Exclusive', colors: ['White', 'Blue', 'Pink'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'm-5', name: 'Tailored Chino Trousers', category: 'men', subcategory: 'Bottoms',
    price: 99, image: fashionImages.bottoms[0],
    images: fashionImages.bottoms, description: 'Flat-front chinos in stretch cotton twill.',
    rating: 4.4, reviews: 312, inStock: true, tags: ['casual', 'festive'], virtualTryOn: true, garmentType: 'bottom',
    brand: 'BSC Exclusive', colors: ['Khaki', 'Navy', 'Olive', 'Black'], sizes: ['28', '30', '32', '34', '36', '38'],
  },
  {
    id: 'm-6', name: 'Merino Wool Crewneck', category: 'men', subcategory: 'Tops',
    price: 129, image: fashionImages.tops[2],
    images: fashionImages.tops, description: 'Ultra-fine merino wool sweater. Layering essential.',
    rating: 4.7, reviews: 156, inStock: true, tags: ['new'], isNew: true, virtualTryOn: true, garmentType: 'top',
    brand: 'BSC Exclusive', colors: ['Charcoal', 'Navy', 'Camel', 'Burgundy'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'm-7', name: 'Running Sneakers', category: 'men', subcategory: 'Shoes',
    price: 159, comparePrice: 199, image: fashionImages.shoes[1],
    images: fashionImages.shoes, description: 'Lightweight performance sneakers with cushion sole.',
    rating: 4.6, reviews: 234, inStock: true, tags: ['casual', 'sale', 'wedding'], isSale: true,
    brand: 'BSC Exclusive', colors: ['White/Black', 'All Black', 'Grey/Orange'], sizes: ['7', '8', '9', '10', '11', '12'],
  },
  {
    id: 'm-8', name: 'Canvas Weekender Bag', category: 'men', subcategory: 'Accessories',
    price: 149, image: fashionImages.accessories[0],
    images: fashionImages.accessories, description: 'Heavy-duty canvas weekender with leather handles.',
    rating: 4.5, reviews: 112, inStock: true, tags: ['travel'],
    brand: 'BSC Exclusive', colors: ['Khaki', 'Navy', 'Black'], sizes: ['One Size'],
  },
  {
    id: 'm-9', name: 'Cashmere V-Neck Sweater', category: 'men', subcategory: 'Tops',
    price: 199, comparePrice: 259, image: fashionImages.tops[3],
    images: fashionImages.tops, description: 'Luxuriously soft cashmere in a classic V-neck silhouette.',
    rating: 4.8, reviews: 98, inStock: true, tags: ['luxury', 'sale'], isSale: true, virtualTryOn: true, garmentType: 'top',
    brand: 'BSC Exclusive', colors: ['Navy', 'Camel', 'Charcoal'], sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'm-10', name: 'Straight Leg Selvedge Jeans', category: 'men', subcategory: 'Bottoms',
    price: 139, image: fashionImages.bottoms[2],
    images: fashionImages.bottoms, description: 'Japanese selvedge denim with raw edge finish.',
    rating: 4.6, reviews: 189, inStock: true, tags: ['casual', 'new'], isNew: true, virtualTryOn: true, garmentType: 'bottom',
    brand: 'BSC Exclusive', colors: ['Dark Indigo', 'Raw', 'Light Wash'], sizes: ['28', '30', '32', '34', '36'],
  },
  {
    id: 'm-11', name: 'Wool Overcoat', category: 'men', subcategory: 'Outerwear',
    price: 399, comparePrice: 529, image: fashionImages.outerwear[3],
    images: fashionImages.outerwear, description: 'Full-length wool overcoat. The ultimate cold-weather statement.',
    rating: 4.9, reviews: 67, inStock: true, tags: ['luxury', 'sale'], isSale: true, virtualTryOn: true, garmentType: 'outerwear',
    brand: 'BSC Exclusive', colors: ['Charcoal', 'Camel', 'Black'], sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'm-12', name: 'Linen Polo Shirt', category: 'men', subcategory: 'Tops',
    price: 69, image: fashionImages.tops[1],
    images: fashionImages.tops, description: 'Breathable linen polo for smart-casual days.',
    rating: 4.3, reviews: 245, inStock: true, tags: ['casual', 'festive'], virtualTryOn: true, garmentType: 'top',
    brand: 'BSC Exclusive', colors: ['White', 'Navy', 'Sage', 'Coral'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
];

const kidsProducts: Product[] = [
  {
    id: 'k-1', name: 'Mini Denim Jacket', category: 'kids', subcategory: 'Jackets',
    price: 49, image: fashionImages.outerwear[2],
    images: fashionImages.outerwear, description: 'Adorable mini denim jacket for toddlers.',
    rating: 4.7, reviews: 89, inStock: true, tags: ['new', 'bestseller', 'wedding', 'traditional'], isNew: true, isBestseller: true,
    brand: 'BSC Kids', colors: ['Blue', 'Pink'], sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
  },
  {
    id: 'k-2', name: 'Rainbow Knit Sweater', category: 'kids', subcategory: 'Tops',
    price: 39, image: fashionImages.tops[0],
    images: fashionImages.tops, description: 'Colorful knit sweater with rainbow stripe pattern.',
    rating: 4.6, reviews: 67, inStock: true, tags: ['casual', 'festive'],
    brand: 'BSC Kids', colors: ['Multi', 'Blue'], sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
  },
  {
    id: 'k-3', name: 'Cargo Jogger Pants', category: 'kids', subcategory: 'Bottoms',
    price: 35, comparePrice: 45, image: fashionImages.bottoms[1],
    images: fashionImages.bottoms, description: 'Comfortable cargo joggers with elastic cuffs.',
    rating: 4.5, reviews: 134, inStock: true, tags: ['casual', 'sale', 'wedding'], isSale: true,
    brand: 'BSC Kids', colors: ['Khaki', 'Navy', 'Black'], sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
  },
  {
    id: 'k-4', name: 'Canvas Sneakers', category: 'kids', subcategory: 'Shoes',
    price: 29, image: fashionImages.shoes[2],
    images: fashionImages.shoes, description: 'Easy slip-on canvas sneakers for active kids.',
    rating: 4.4, reviews: 198, inStock: true, tags: ['bestseller', 'festive', 'traditional'], isBestseller: true,
    brand: 'BSC Kids', colors: ['White', 'Red', 'Blue'], sizes: ['10C', '11C', '12C', '13C', '1Y', '2Y'],
  },
];

export const productsData: Product[] = [...womenProducts, ...menProducts, ...kidsProducts];

export const getProductsByCategory = (category: string): Product[] => {
  switch (category) {
    case 'women': return productsData.filter(p => p.category === 'women');
    case 'men': return productsData.filter(p => p.category === 'men');
    case 'kids': return productsData.filter(p => p.category === 'kids');
    case 'new-arrivals': return productsData.filter(p => p.isNew);
    case 'bestsellers': return productsData.filter(p => p.isBestseller);
    case 'sale': return productsData.filter(p => p.isSale);
    default: return productsData;
  }
};

export const getProductsBySubcategory = (category: string, subcategory: string): Product[] => {
  return productsData.filter(p => p.category === category && p.subcategory === subcategory);
};

export const getProductById = (id: string): Product | undefined => {
  return productsData.find(p => p.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const q = query.toLowerCase();
  return productsData.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q) ||
    p.tags.some(t => t.includes(q))
  );
};

export const getTotalProductCount = (): number => productsData.length;

export const getCategoryCounts = () => ({
  women: productsData.filter(p => p.category === 'women').length,
  men: productsData.filter(p => p.category === 'men').length,
  kids: productsData.filter(p => p.category === 'kids').length,
  total: productsData.length,
});

export const getSubcategories = (category: string): string[] => {
  const subcats = new Set(productsData.filter(p => p.category === category).map(p => p.subcategory));
  return Array.from(subcats);
};

export const getProductsByTag = (tag: string): Product[] => {
  return productsData.filter(p => p.tags.includes(tag));
};

export const getProductsByAgeGroup = (): Product[] => {
  return productsData;
};

export const getPersonalizedProducts = (_age: number, gender: string, limit: number = 12): Product[] => {
  let filtered = productsData;
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

