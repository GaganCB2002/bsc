export type AgeGroup = 'teens' | 'young-adults' | 'adults' | 'mature-adults' | 'seniors';

export interface AgeRecommendation {
  ageGroup: AgeGroup;
  label: string;
  ageRange: string;
  tags: string[];
  categories: string[];
  styles: string[];
  description: string;
}

export const ageRecommendations: Record<AgeGroup, AgeRecommendation> = {
  teens: {
    ageGroup: 'teens',
    label: 'Trendy & Fun',
    ageRange: 'Under 20',
    tags: ['trendy', 'casual', 'fun', 'bright', 'youthful'],
    categories: ['kids', 'women', 'men'],
    styles: ['casual', 'streetwear', 'fusion', 'bright-colors'],
    description: 'Trendy styles with bright colors and modern designs for the young and energetic!'
  },
  'young-adults': {
    ageGroup: 'young-adults',
    label: 'Modern & Trendy',
    ageRange: '20-30',
    tags: ['trendy', 'modern', 'stylish', 'party', 'designer', 'fusion', 'contemporary'],
    categories: ['women', 'men'],
    styles: ['party-wear', 'designer', 'fusion', 'contemporary', 'office-wear'],
    description: 'Modern designs perfect for parties, office, and social gatherings. Trendy styles that make a statement!'
  },
  adults: {
    ageGroup: 'adults',
    label: 'Elegant & Classic',
    ageRange: '31-45',
    tags: ['elegant', 'classic', 'premium', 'silk', 'traditional', 'office'],
    categories: ['women', 'men'],
    styles: ['traditional', 'premium', 'silk', 'office-wear', 'formal'],
    description: 'Elegant and premium collection with traditional silk sarees and classic ethnic wear for the sophisticated shopper.'
  },
  'mature-adults': {
    ageGroup: 'mature-adults',
    label: 'Premium & Traditional',
    ageRange: '46-60',
    tags: ['premium', 'traditional', 'comfort', 'silk', 'handloom', 'classic'],
    categories: ['women', 'men'],
    styles: ['traditional', 'comfort', 'premium', 'handloom', 'classic'],
    description: 'Premium handloom and traditional collections with emphasis on comfort and timeless elegance.'
  },
  seniors: {
    ageGroup: 'seniors',
    label: 'Comfort & Quality',
    ageRange: '60+',
    tags: ['comfort', 'lightweight', 'easy-wear', 'cotton', 'soft'],
    categories: ['women', 'men'],
    styles: ['comfort', 'lightweight', 'cotton', 'easy-care'],
    description: 'Comfortable, lightweight designs with easy-wear fabrics for ultimate relaxation and style.'
  }
};

export function getAgeGroup(age: number): AgeGroup {
  if (age < 20) return 'teens';
  if (age <= 30) return 'young-adults';
  if (age <= 45) return 'adults';
  if (age <= 60) return 'mature-adults';
  return 'seniors';
}

export function getAgeRecommendation(age: number): AgeRecommendation {
  return ageRecommendations[getAgeGroup(age)];
}

export function getPersonalizedTag(age: number, gender: string): string {
  const group = getAgeGroup(age);
  const genderTag = gender === 'male' ? "Men's" : gender === 'female' ? "Women's" : '';
  const styleTag = ageRecommendations[group].tags[0];
  return `${genderTag} ${styleTag}`.trim();
}
