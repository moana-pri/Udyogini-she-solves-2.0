export const businessTypePhotos: Record<string, string> = {
  // Direct mappings
  "beauty-parlour": "/images/business-types/beauty-parlour.jpg",
  "tailoring": "/images/business-types/tailoring.jpg",
  "alterations": "/images/business-types/alterations.jpg",
  "mehendi": "/images/business-types/mehendi.jpg",
  "handicrafts": "/images/business-types/handicrafts.jpg",
  "jewelry": "/images/business-types/jewelry.jpg",
  "fashion-design": "/images/business-types/fashion-design.jpg",
  "art-classes": "/images/business-types/art-classes.jpg",
  "cooking": "/images/business-types/cooking.jpg",
  "tuition": "/images/business-types/tuition.jpg",
  
  // Variations and alternate names
  "tailoring-and-fashion": "/images/business-types/tailoring.jpg",
  "tailoring-fashion": "/images/business-types/tailoring.jpg",
  "tailoringand-fashion": "/images/business-types/tailoring.jpg",
  
  "mehendi-art": "/images/business-types/mehendi.jpg",
  "mehendi-application": "/images/business-types/mehendi.jpg",
  "mehndi": "/images/business-types/mehendi.jpg",
  "mehndi-art": "/images/business-types/mehendi.jpg",
  
  "handicrafts-and-jewelry": "/images/business-types/handicrafts.jpg",
  "handicrafts-jewelry": "/images/business-types/handicrafts.jpg",
  "handicraftsand-jewelry": "/images/business-types/handicrafts.jpg",
  
  "art-class": "/images/business-types/art-classes.jpg",
  "cooking-class": "/images/business-types/cooking.jpg",
  "cooking-classes": "/images/business-types/cooking.jpg",
  
  "fashion": "/images/business-types/fashion-design.jpg",
};

// Alternative images for rotation when same business type appears multiple times
export const alternativeImages: Record<string, string[]> = {
  "handicrafts": ["/images/business-types/handicrafts.jpg", "/images/business-types/jewelry.jpg"],
  "handicrafts-and-jewelry": ["/images/business-types/handicrafts.jpg", "/images/business-types/jewelry.jpg"],
  "tailoring": ["/images/business-types/tailoring.jpg", "/images/business-types/alterations.jpg", "/images/business-types/fashion-design.jpg"],
  "tailoring-and-fashion": ["/images/business-types/tailoring.jpg", "/images/business-types/alterations.jpg", "/images/business-types/fashion-design.jpg"],
};

export function getBusinessTypePhoto(type?: string, businessId?: string | number) {
  // Returns an object with `photoUrl` and `altText` to match component expectations
  if (!type) {
    return {
      photoUrl: "/images/business-types/tailoring.jpg",
      altText: "Business image"
    };
  }

  // Normalize the type: lowercase, replace & with 'and', replace spaces with hyphens
  const normalizedKey = type
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  // Direct lookup
  let baseImage = businessTypePhotos[normalizedKey];

  // Try partial matches if direct lookup fails
  if (!baseImage) {
    // Try partial matches for handicrafts-related types
    if (normalizedKey.includes("handicraft") && normalizedKey.includes("jewelry")) {
      baseImage = businessTypePhotos["handicrafts-and-jewelry"];
    } else if (normalizedKey.includes("jewelry")) {
      baseImage = businessTypePhotos["jewelry"];
    } else if (normalizedKey.includes("handicraft")) {
      baseImage = businessTypePhotos["handicrafts"];
    }
    // Try partial matches for tailoring-related types
    else if (normalizedKey.includes("tailoring") && normalizedKey.includes("fashion")) {
      baseImage = businessTypePhotos["tailoring-and-fashion"];
    } else if (normalizedKey.includes("tailoring")) {
      baseImage = businessTypePhotos["tailoring"];
    } else if (normalizedKey.includes("alterations")) {
      baseImage = businessTypePhotos["alterations"];
    }
    // Try partial matches for mehendi-related types
    else if (normalizedKey.includes("mehendi") || normalizedKey.includes("mehndi")) {
      baseImage = businessTypePhotos["mehendi-art"];
    }
    // Try partial matches for beauty
    else if (normalizedKey.includes("beauty") || normalizedKey.includes("parlour") || normalizedKey.includes("parlor")) {
      baseImage = businessTypePhotos["beauty-parlour"];
    }
    // Try partial matches for art
    else if (normalizedKey.includes("art") && normalizedKey.includes("class")) {
      baseImage = businessTypePhotos["art-classes"];
    } else if (normalizedKey.includes("art")) {
      baseImage = businessTypePhotos["art-classes"];
    }
    // Try partial matches for cooking
    else if (normalizedKey.includes("cooking") || normalizedKey.includes("food") || normalizedKey.includes("catering")) {
      baseImage = businessTypePhotos["cooking"];
    }
    // Try partial matches for tuition
    else if (normalizedKey.includes("tuition") || normalizedKey.includes("education")) {
      baseImage = businessTypePhotos["tuition"];
    }
    // Default fallback
    else {
      baseImage = "/images/business-types/tailoring.jpg";
    }
  }

  // If businessId is provided and we have alternative images, rotate through them
  let selectedImage = baseImage;
  if (businessId && alternativeImages[normalizedKey]) {
    const alternatives = alternativeImages[normalizedKey];
    const hash = String(businessId).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    selectedImage = alternatives[hash % alternatives.length];
  }

  return {
    photoUrl: selectedImage,
    altText: `${type} business`
  };
}

export function getPlaceholderPhoto() {
  return {
    photoUrl: "/images/business-types/default-business.jpg",
    altText: "Placeholder business image"
  };
}

export function getDefaultBusinessPhoto() {
  return {
    photoUrl: "/images/business-types/default-business.jpg",
    altText: "Default business image"
  };
}
