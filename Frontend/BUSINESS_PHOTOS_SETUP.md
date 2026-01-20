# Business Type Photos Setup Guide

## 📁 Directory Structure

Create the following directory structure in your `public` folder:

```
public/
└── images/
    └── business-types/
        ├── tailoring.jpg
        ├── fashion-design.jpg
        ├── alterations.jpg
        ├── home-food.jpg
        ├── catering.jpg
        ├── tiffin.jpg
        ├── bakery.jpg
        ├── mehendi.jpg
        ├── beauty-parlour.jpg
        ├── hair-salon.jpg
        ├── makeup.jpg
        ├── handicrafts.jpg
        ├── jewelry.jpg
        ├── painting.jpg
        ├── traditional-crafts.jpg
        ├── tuition.jpg
        ├── cooking-classes.jpg
        ├── art-classes.jpg
        ├── cleaning.jpg
        ├── home-decor.jpg
        ├── gardening.jpg
        ├── default-business.jpg
        └── placeholder.jpg
```

## 🖼️ Image Requirements

### Specifications:
- **Size**: 400x300 pixels (4:3 aspect ratio)
- **Format**: JPG or PNG
- **Quality**: Optimized for web (under 100KB each)
- **Style**: Professional, high-quality photos representing each business type

### Business Type Photo Guidelines:

#### 🧵 **Fashion & Tailoring**
- **Tailoring**: Person sewing or measuring fabric
- **Fashion Design**: Designer sketching or fabric selection
- **Alterations**: Tailor adjusting clothing

#### 🍽️ **Food & Catering**
- **Home Food**: Homemade dishes being prepared
- **Catering**: Catered event setup
- **Tiffin**: Tiffin boxes being packed
- **Bakery**: Fresh baked goods display

#### 💄 **Beauty & Wellness**
- **Mehendi**: Hands with mehendi designs
- **Beauty Parlour**: Beauty treatments in progress
- **Hair Salon**: Hair styling or cutting
- **Makeup**: Professional makeup application

#### 🎨 **Handicrafts & Art**
- **Handicrafts**: Artisan creating crafts
- **Jewelry**: Jewelry making process
- **Painting**: Artist painting
- **Traditional Crafts**: Traditional craft work

#### 📚 **Education & Services**
- **Tuition**: Teaching session
- **Cooking Classes**: Cooking class in progress
- **Art Classes**: Art instruction

#### 🏠 **Home Services**
- **Cleaning**: Professional cleaning service
- **Home Decor**: Home decoration work
- **Gardening**: Gardening services

## 🎯 Photo Sourcing Options

### Option 1: Stock Photos (Recommended)
Use these free stock photo websites:
- **Unsplash**: unsplash.com
- **Pexels**: pexels.com
- **Pixabay**: pixabay.com

Search terms for each business type:
- "tailoring business", "sewing service"
- "homemade food", "catering service"
- "mehendi design", "beauty parlour"
- "handicrafts", "jewelry making"
- "home cleaning", "gardening service"

### Option 2: Custom Photos
Take photos of actual local businesses:
- Contact local women entrepreneurs
- Request permission to use their photos
- Ensure high-quality, professional appearance

### Option 3: AI Generated Images
Use AI image generation tools:
- **DALL-E**, **Midjourney**, **Stable Diffusion**
- Prompts: "professional tailoring service, indian woman sewing, realistic photo"

## 📋 Implementation Checklist

### ✅ **Required Actions:**

1. **Create Directory Structure**
   ```bash
   mkdir -p public/images/business-types
   ```

2. **Add 22 Photos** (one for each business type + defaults)
   - Follow naming convention exactly
   - Ensure consistent size and quality
   - Test all images load correctly

3. **Test Photo Display**
   - Navigate to customer home page
   - Search for businesses
   - Verify correct photos appear for each business type

4. **Fallback Testing**
   - Test with unknown business types
   - Verify default photo appears
   - Test error handling for missing images

## 🚀 Quick Start with Placeholders

If you need immediate testing, use these placeholder services:

### Placeholder Images (Temporary)
```javascript
// Update business-type-photos.ts temporarily:
photoUrl: `https://picsum.photos/seed/${type}/400/300.jpg`
```

### Icon Fallbacks
```javascript
// Use Lucide icons as fallbacks:
import { Scissors, UtensilsCrossed, Palette } from "lucide-react"
```

## 🎨 Design Tips

### Photo Selection Criteria:
1. **Authenticity**: Real business photos preferred
2. **Cultural Relevance**: Indian context where appropriate
3. **Professional Quality**: Good lighting, composition
4. **Consistency**: Similar style across all photos
5. **Diversity**: Represent different types of women entrepreneurs

### Color Scheme:
- Warm, inviting colors
- Good contrast with card design
- Consistent lighting style
- Professional appearance

## 📱 Mobile Optimization

- Ensure photos look good on mobile devices
- Test loading speed
- Verify responsive behavior
- Check image quality on different screen sizes

## 🔧 Troubleshooting

### Common Issues:
1. **Images not loading**: Check file paths and names
2. **Slow loading**: Optimize image sizes
3. **Wrong photos**: Verify business type mapping
4. **Broken images**: Test fallback system

### Debug Steps:
1. Check browser console for image errors
2. Verify file structure in public folder
3. Test with different business types
4. Check network tab for failed requests

## 📊 Performance Optimization

- Use Next.js Image optimization
- Implement lazy loading for images
- Compress images without quality loss
- Consider WebP format for better compression

Once you have the photos ready, the system will automatically display the correct photo for each business type! 🎉
