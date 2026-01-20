// Business Type Photo Mapping System
// Maps business types to specific photos for display on customer home page

export interface BusinessTypePhoto {
  type: string;
  photoUrl: string;
  altText: string;
  category: string;
}

export const businessTypePhotos: BusinessTypePhoto[] = [
  // Tailoring & Fashion
  {
    type: "Tailoring",
    photoUrl: "https://images.unsplash.com/photo-1622024447801-92bc9e113fc0?w=400&h=300&fit=crop&crop=center",
    altText: "Tailoring and fashion services",
    category: "fashion"
  },
  {
    type: "Fashion Design",
    photoUrl: "https://images.unsplash.com/photo-1558769132-cb1aea45c1e5?w=400&h=300&fit=crop&crop=center", 
    altText: "Fashion design services",
    category: "fashion"
  },
  {
    type: "Clothing Alterations",
    photoUrl: "https://images.unsplash.com/photo-1622024447801-92bc9e113fc0?w=400&h=300&fit=crop&crop=center",
    altText: "Clothing alterations services",
    category: "fashion"
  },
  
  // Food & Catering
  {
    type: "Home Food",
    photoUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0a6a6?w=400&h=300&fit=crop&crop=center",
    altText: "Homemade food services",
    category: "food"
  },
  {
    type: "Catering",
    photoUrl: "https://images.unsplash.com/photo-1556659794-3648a1d84a4c?w=400&h=300&fit=crop&crop=center",
    altText: "Catering services",
    category: "food"
  },
  {
    type: "Tiffin Service",
    photoUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0a6a6?w=400&h=300&fit=crop&crop=center",
    altText: "Tiffin services",
    category: "food"
  },
  {
    type: "Bakery",
    photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center",
    altText: "Bakery services",
    category: "food"
  },
  
  // Beauty & Wellness
  {
    type: "Mehendi",
    photoUrl: "https://images.unsplash.com/photo-1610986323225-422a9122e3a5?w=400&h=300&fit=crop&crop=center",
    altText: "Mehendi services",
    category: "beauty"
  },
  {
    type: "Beauty Parlour",
    photoUrl: "https://images.unsplash.com/photo-1560069002-32d32d496c3c?w=400&h=300&fit=crop&crop=center",
    altText: "Beauty parlour services",
    category: "beauty"
  },
  {
    type: "Hair Salon",
    photoUrl: "https://images.unsplash.com/photo-1560069002-32d32d496c3c?w=400&h=300&fit=crop&crop=center",
    altText: "Hair salon services",
    category: "beauty"
  },
  {
    type: "Makeup Artist",
    photoUrl: "https://images.unsplash.com/photo-1596462502278-27d381488566?w=400&h=300&fit=crop&crop=center",
    altText: "Makeup artist services",
    category: "beauty"
  },
  
  // Handicrafts & Art
  {
    type: "Handicrafts",
    photoUrl: "https://images.unsplash.com/photo-1605000797494-9a0d3c1b5c84?w=400&h=300&fit=crop&crop=center",
    altText: "Handicrafts services",
    category: "art"
  },
  {
    type: "Jewelry Making",
    photoUrl: "https://images.unsplash.com/photo-1610364894701-a38e0a764c6e?w=400&h=300&fit=crop&crop=center",
    altText: "Jewelry making services",
    category: "art"
  },
  {
    type: "Painting",
    photoUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&crop=center",
    altText: "Painting services",
    category: "art"
  },
  {
    type: "Traditional Crafts",
    photoUrl: "https://images.unsplash.com/photo-1605000797494-9a0d3c1b5c84?w=400&h=300&fit=crop&crop=center",
    altText: "Traditional crafts services",
    category: "art"
  },
  
  // Education & Services
  {
    type: "Tuition",
    photoUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&crop=center",
    altText: "Tuition services",
    category: "education"
  },
  {
    type: "Cooking Classes",
    photoUrl: "https://images.unsplash.com/photo-1556659794-3648a1d84a4c?w=400&h=300&fit=crop&crop=center",
    altText: "Cooking classes",
    category: "education"
  },
  {
    type: "Art Classes",
    photoUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&crop=center",
    altText: "Art classes",
    category: "education"
  },
  
  // Home Services
  {
    type: "Cleaning Services",
    photoUrl: "https://images.unsplash.com/photo-1586473219015-91afd0377815?w=400&h=300&fit=crop&crop=center",
    altText: "Cleaning services",
    category: "home"
  },
  {
    type: "Home Decor",
    photoUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
    altText: "Home decoration services",
    category: "home"
  },
  {
    type: "Gardening",
    photoUrl: "https://images.unsplash.com/photo-1416879595882-de33a2b2fc98?w=400&h=300&fit=crop&crop=center",
    altText: "Gardening services",
    category: "home"
  }
];

// Function to get photo for a business type
export function getBusinessTypePhoto(businessType: string): BusinessTypePhoto | null {
  // First try exact match
  let photo = businessTypePhotos.find(p => 
    p.type.toLowerCase() === businessType.toLowerCase()
  );
  
  // If no exact match, try partial match
  if (!photo) {
    photo = businessTypePhotos.find(p => 
      businessType.toLowerCase().includes(p.type.toLowerCase()) ||
      p.type.toLowerCase().includes(businessType.toLowerCase())
    );
  }
  
  // If still no match, try category-based fallback
  if (!photo) {
    const categoryFallbacks: { [key: string]: string } = {
      'tailor': 'Tailoring',
      'fashion': 'Fashion Design',
      'food': 'Home Food',
      'cater': 'Catering',
      'beauty': 'Beauty Parlour',
      'mehend': 'Mehendi',
      'hair': 'Hair Salon',
      'makeup': 'Makeup Artist',
      'craft': 'Handicrafts',
      'jewel': 'Jewelry Making',
      'paint': 'Painting',
      'tuiti': 'Tuition',
      'class': 'Cooking Classes',
      'clean': 'Cleaning Services',
      'decor': 'Home Decor',
      'garden': 'Gardening'
    };
    
    for (const [keyword, fallbackType] of Object.entries(categoryFallbacks)) {
      if (businessType.toLowerCase().includes(keyword)) {
        photo = businessTypePhotos.find(p => p.type === fallbackType);
        if (photo) break;
      }
    }
  }
  
  return photo || null;
}

// Function to get a default photo for unknown business types
export function getDefaultBusinessPhoto(): BusinessTypePhoto {
  return {
    type: "Default",
    photoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
    altText: "Local business service",
    category: "default"
  };
}

// Function to get placeholder photo while loading
export function getPlaceholderPhoto(): BusinessTypePhoto {
  return {
    type: "Placeholder",
    photoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center&blur=10",
    altText: "Loading business image",
    category: "placeholder"
  };
}
