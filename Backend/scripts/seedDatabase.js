import mongoose from "mongoose"
import dotenv from "dotenv"
import Business from "../models/Business.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"

dotenv.config()

const sampleBusinesses = [
  // Beauty Parlour (10)
  {
    businessName: "Priya's Beauty Parlour",
    businessType: "Beauty Parlour",
    location: { address: "Sukhsagar Nagar Lane 10, Kondhawa Budruk, Pune, MH-411046", coordinates: [73.8435, 18.4763] },
    phone: "9876543210",
    workingHours: "9 AM - 7 PM",
    priceRange: "₹200-₹800",
    description: "Full bridal makeup and beauty services with experienced professionals",
  },
  {
    businessName: "Shiny Salon & Spa",
    businessType: "Beauty Parlour",
    location: { address: "Bibwewadi, Pune, MH-411037", coordinates: [73.8234, 18.4567] },
    phone: "9876543211",
    workingHours: "10 AM - 8 PM",
    priceRange: "₹300-₹900",
    description: "Premium beauty and wellness center",
  },
  {
    businessName: "Glow Studio",
    businessType: "Beauty Parlour",
    location: { address: "Kothrud, Pune, MH-411038", coordinates: [73.8167, 18.5245] },
    phone: "9876543212",
    workingHours: "9 AM - 7 PM",
    priceRange: "₹250-₹700",
    description: "Facials, threading, waxing and hair treatment",
  },
  {
    businessName: "Beauty Haven",
    businessType: "Beauty Parlour",
    location: { address: "Aundh, Pune, MH-411007", coordinates: [73.8018, 18.5634] },
    phone: "9876543213",
    workingHours: "10 AM - 8 PM",
    priceRange: "₹200-₹750",
    description: "Traditional and modern beauty treatments",
  },
  {
    businessName: "Radiance Beauty Center",
    businessType: "Beauty Parlour",
    location: { address: "Hinjewadi, Pune, MH-411057", coordinates: [73.7321, 18.5912] },
    phone: "9876543214",
    workingHours: "9 AM - 7 PM",
    priceRange: "₹300-₹800",
    description: "Expert skin care and makeup services",
  },
  {
    businessName: "Luxe Aesthetics",
    businessType: "Beauty Parlour",
    location: { address: "Viman Nagar, Pune, MH-411014", coordinates: [73.8856, 18.5731] },
    phone: "9876543215",
    workingHours: "10 AM - 8 PM",
    priceRange: "₹400-₹1000",
    description: "Premium aesthetic and beauty treatments",
  },
  {
    businessName: "Petal Beauty Studio",
    businessType: "Beauty Parlour",
    location: { address: "Baner, Pune, MH-411045", coordinates: [73.7768, 18.5620] },
    phone: "9876543216",
    workingHours: "9 AM - 7 PM",
    priceRange: "₹250-₹700",
    description: "Modern salon with trained beauticians",
  },
  {
    businessName: "Sparkle Salon",
    businessType: "Beauty Parlour",
    location: { address: "Katraj, Pune, MH-411046", coordinates: [73.8456, 18.3892] },
    phone: "9876543217",
    workingHours: "10 AM - 8 PM",
    priceRange: "₹200-₹600",
    description: "Affordable beauty services for all",
  },
  {
    businessName: "Glow & Shine",
    businessType: "Beauty Parlour",
    location: { address: "Deccan, Pune, MH-411004", coordinates: [73.8323, 18.5246] },
    phone: "9876543218",
    workingHours: "9 AM - 7 PM",
    priceRange: "₹300-₹850",
    description: "Complete beauty and wellness package",
  },
  {
    businessName: "Masha's Beauty Lounge",
    businessType: "Beauty Parlour",
    location: { address: "Yerawada, Pune, MH-411006", coordinates: [73.8934, 18.5841] },
    phone: "9876543219",
    workingHours: "10 AM - 8 PM",
    priceRange: "₹280-₹750",
    description: "Personalized beauty solutions",
  },

  // Tailoring & Fashion (10)
  {
    businessName: "Lakshmi Tailors",
    businessType: "Tailoring & Fashion",
    location: { address: "Camp, Pune, MH-411001", coordinates: [73.8567, 18.5204] },
    phone: "9876543220",
    workingHours: "9 AM - 6 PM",
    priceRange: "₹500+",
    description: "Expert tailoring for all occasions",
  },
  {
    businessName: "Stitches & Style",
    businessType: "Tailoring & Fashion",
    location: { address: "FC Road, Pune, MH-411004", coordinates: [73.8234, 18.5349] },
    phone: "9876543221",
    workingHours: "10 AM - 7 PM",
    priceRange: "₹600+",
    description: "Modern tailoring with traditional touch",
  },
  {
    businessName: "Designer Threads",
    businessType: "Tailoring & Fashion",
    location: { address: "Market Yard, Pune, MH-411037", coordinates: [73.8456, 18.4823] },
    phone: "9876543222",
    workingHours: "9 AM - 6 PM",
    priceRange: "₹800+",
    description: "Exclusive design and custom tailoring",
  },
  {
    businessName: "Priya's Tailoring Studio",
    businessType: "Tailoring & Fashion",
    location: { address: "Peth, Pune, MH-411030", coordinates: [73.8723, 18.5156] },
    phone: "9876543223",
    workingHours: "10 AM - 7 PM",
    priceRange: "₹500+",
    description: "Fast and quality tailoring services",
  },
  {
    businessName: "Elite Fashion Tailors",
    businessType: "Tailoring & Fashion",
    location: { address: "Pashan, Pune, MH-411021", coordinates: [73.7923, 18.5789] },
    phone: "9876543224",
    workingHours: "9 AM - 6 PM",
    priceRange: "₹700+",
    description: "Premium tailoring for special occasions",
  },
  {
    businessName: "Elegant Stitches",
    businessType: "Tailoring & Fashion",
    location: { address: "Dhanori, Pune, MH-411015", coordinates: [73.9123, 18.5892] },
    phone: "9876543225",
    workingHours: "10 AM - 7 PM",
    priceRange: "₹600+",
    description: "Custom design and alteration services",
  },
  {
    businessName: "Style Couture",
    businessType: "Tailoring & Fashion",
    location: { address: "Bavdhan, Pune, MH-411021", coordinates: [73.7845, 18.5234] },
    phone: "9876543226",
    workingHours: "9 AM - 6 PM",
    priceRange: "₹900+",
    description: "Luxury tailoring and design",
  },
  {
    businessName: "Artisan Tailors",
    businessType: "Tailoring & Fashion",
    location: { address: "Wakad, Pune, MH-411057", coordinates: [73.8012, 18.5923] },
    phone: "9876543227",
    workingHours: "10 AM - 7 PM",
    priceRange: "₹550+",
    description: "Handcrafted tailoring with attention to detail",
  },
  {
    businessName: "Trend Setters Tailor",
    businessType: "Tailoring & Fashion",
    location: { address: "Hadapsar, Pune, MH-411028", coordinates: [73.9234, 18.4456] },
    phone: "9876543228",
    workingHours: "9 AM - 6 PM",
    priceRange: "₹650+",
    description: "Latest fashion trends and tailoring",
  },
  {
    businessName: "Traditional Stitches",
    businessType: "Tailoring & Fashion",
    location: { address: "Mundhwa, Pune, MH-411036", coordinates: [73.8923, 18.4678] },
    phone: "9876543229",
    workingHours: "10 AM - 7 PM",
    priceRange: "₹500+",
    description: "Traditional ethnic wear tailoring",
  },

  // Mehendi Art (10)
  {
    businessName: "Ayesha Mehendi Art",
    businessType: "Mehendi Art",
    location: { address: "Andheri, Pune, MH-411001", coordinates: [73.8234, 18.5678] },
    phone: "9876543230",
    workingHours: "10 AM - 10 PM",
    priceRange: "₹1500+",
    description: "Bridal and party mehendi expert",
  },
  {
    businessName: "Henna Studio",
    businessType: "Mehendi Art",
    location: { address: "Sinhagad Road, Pune, MH-411051", coordinates: [73.7623, 18.3421] },
    phone: "9876543231",
    workingHours: "10 AM - 9 PM",
    priceRange: "₹1000+",
    description: "Traditional and modern mehendi designs",
  },
  {
    businessName: "Mehendi Magic",
    businessType: "Mehendi Art",
    location: { address: "Karvenagar, Pune, MH-411052", coordinates: [73.8234, 18.3567] },
    phone: "9876543232",
    workingHours: "11 AM - 10 PM",
    priceRange: "₹1200+",
    description: "Creative mehendi artwork",
  },
  {
    businessName: "Natural Mehendi Lounge",
    businessType: "Mehendi Art",
    location: { address: "Fatima Nagar, Pune, MH-411053", coordinates: [73.8567, 18.3812] },
    phone: "9876543233",
    workingHours: "10 AM - 9 PM",
    priceRange: "₹1100+",
    description: "100% natural mehendi application",
  },
  {
    businessName: "Bridal Mehendi Center",
    businessType: "Mehendi Art",
    location: { address: "Dhayari, Pune, MH-411041", coordinates: [73.7834, 18.3245] },
    phone: "9876543234",
    workingHours: "10 AM - 10 PM",
    priceRange: "₹2000+",
    description: "Specialized bridal mehendi services",
  },
  {
    businessName: "Artistry Mehendi",
    businessType: "Mehendi Art",
    location: { address: "Khand, Pune, MH-411048", coordinates: [73.8456, 18.3923] },
    phone: "9876543235",
    workingHours: "11 AM - 10 PM",
    priceRange: "₹1400+",
    description: "Artistic mehendi designs",
  },
  {
    businessName: "Shri Mehendi Studio",
    businessType: "Mehendi Art",
    location: { address: "Yavat, Pune, MH-412216", coordinates: [73.7923, 18.2834] },
    phone: "9876543236",
    workingHours: "10 AM - 9 PM",
    priceRange: "₹1300+",
    description: "Expert mehendi and body art",
  },
  {
    businessName: "Golden Hands Mehendi",
    businessType: "Mehendi Art",
    location: { address: "Pune City, Pune, MH-411043", coordinates: [73.8789, 18.3456] },
    phone: "9876543237",
    workingHours: "10 AM - 10 PM",
    priceRange: "₹1600+",
    description: "Premium mehendi application",
  },
  {
    businessName: "Festival Mehendi Design",
    businessType: "Mehendi Art",
    location: { address: "Uruli Kanchan, Pune, MH-412202", coordinates: [73.9123, 18.2234] },
    phone: "9876543238",
    workingHours: "11 AM - 9 PM",
    priceRange: "₹1000+",
    description: "Festival and celebration mehendi",
  },
  {
    businessName: "Professional Mehendi Artist",
    businessType: "Mehendi Art",
    location: { address: "Pimpri, Pune, MH-411018", coordinates: [73.7654, 18.6312] },
    phone: "9876543239",
    workingHours: "10 AM - 10 PM",
    priceRange: "₹1200+",
    description: "Certified professional mehendi services",
  },

  // Handicrafts & Jewelry (10)
  {
    businessName: "Artisan Jewelry",
    businessType: "Handicrafts & Jewelry",
    location: { address: "Lakdi Pool, Pune, MH-411030", lat: 18.5289, lng: 73.8234 },
    phone: "9876543240",
    workingHours: "10 AM - 7 PM",
    priceRange: "₹1000+",
    description: "Handmade traditional jewelry",
  },
  {
    businessName: "Traditional Crafts Hub",
    businessType: "Handicrafts & Jewelry",
    location: { address: "Shaniwar Peth, Pune, MH-411030", lat: 18.5156, lng: 73.8456 },
    phone: "9876543241",
    workingHours: "10 AM - 8 PM",
    priceRange: "₹800+",
    description: "Heritage handicrafts and jewelry",
  },
  {
    businessName: "Golden Crafts",
    businessType: "Handicrafts & Jewelry",
    location: { address: "Ravivar Peth, Pune, MH-411002", lat: 18.5234, lng: 73.8567 },
    phone: "9876543242",
    workingHours: "11 AM - 7 PM",
    priceRange: "₹1500+",
    description: "Premium handcrafted jewelry",
  },
  {
    businessName: "Ethnic Treasures",
    businessType: "Handicrafts & Jewelry",
    location: { address: "Chowk, Pune, MH-411002", lat: 18.5189, lng: 73.8489 },
    phone: "9876543243",
    workingHours: "10 AM - 7 PM",
    priceRange: "₹900+",
    description: "Ethnic and traditional designs",
  },
  {
    businessName: "Artisan's Paradise",
    businessType: "Handicrafts & Jewelry",
    location: { address: "Budhwar Peth, Pune, MH-411002", lat: 18.5234, lng: 73.8312 },
    phone: "9876543244",
    workingHours: "10 AM - 8 PM",
    priceRange: "₹1200+",
    description: "Unique handicrafts and jewelry collection",
  },
  {
    businessName: "Precious Moments Jewelry",
    businessType: "Handicrafts & Jewelry",
    location: { address: "Mandai, Pune, MH-411001", lat: 18.5156, lng: 73.8234 },
    phone: "9876543245",
    workingHours: "11 AM - 7 PM",
    priceRange: "₹2000+",
    description: "Luxury handmade jewelry",
  },
  {
    businessName: "Craft & Adorn",
    businessType: "Handicrafts & Jewelry",
    location: { address: "Ganj Peth, Pune, MH-411001", lat: 18.5267, lng: 73.8378 },
    phone: "9876543246",
    workingHours: "10 AM - 7 PM",
    priceRange: "₹1100+",
    description: "Crafted jewelry with custom designs",
  },
  {
    businessName: "Heritage Designs",
    businessType: "Handicrafts & Jewelry",
    location: { address: "Hari Om Nagar, Pune, MH-411031", lat: 18.5234, lng: 73.8645 },
    phone: "9876543247",
    workingHours: "10 AM - 8 PM",
    priceRange: "₹1300+",
    description: "Traditional heritage jewelry",
  },
  {
    businessName: "Craftwork Studio",
    businessType: "Handicrafts & Jewelry",
    location: { address: "Vinayak Nagar, Pune, MH-411031", lat: 18.5189, lng: 73.8512 },
    phone: "9876543248",
    workingHours: "11 AM - 7 PM",
    priceRange: "₹950+",
    description: "Studio for custom crafts",
  },
  {
    businessName: "Bead Art & Jewelry",
    businessType: "Handicrafts & Jewelry",
    location: { address: "Opp. Patil Market, Pune, MH-411031", lat: 18.5145, lng: 73.8423 },
    phone: "9876543249",
    workingHours: "10 AM - 7 PM",
    priceRange: "₹800+",
    description: "Bead and art jewelry collection",
  },
]

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Don't delete - just add new ones that don't exist
    console.log("🔍 Checking for existing businesses...")

    let addedCount = 0

    // For each business, create or update the business record
    for (const biz of sampleBusinesses) {
      // Normalize location to GeoJSON format
      let location = biz.location;
      if (biz.location.coordinates) {
        location = {
          address: biz.location.address,
          type: 'Point',
          coordinates: [biz.location.coordinates[0], biz.location.coordinates[1]] // [lng, lat]
        };
      } else if (biz.location.lat && biz.location.lng) {
        location = {
          address: biz.location.address,
          type: 'Point',
          coordinates: [biz.location.lng, biz.location.lat] // [lng, lat]
        };
      }

      // Check if business already exists
      const exists = await Business.findOne({ businessName: biz.businessName })
      if (exists) {
        // Update existing business with proper location data
        await Business.findByIdAndUpdate(exists._id, {
          location,
          workingHours: biz.workingHours,
          priceRange: biz.priceRange,
          description: biz.description
        })
        console.log(`🔄 Updated: ${biz.businessName}`)
        continue
      }

      // Create a unique phone for each
      const hashedPassword = await bcrypt.hash("password123", 10)

      // Check if user with this phone exists
      let user = await User.findOne({ phone: biz.phone })
      if (!user) {
        user = await User.create({
          fullName: biz.businessName.split("'")[0] || "Owner",
          phone: biz.phone,
          password: hashedPassword,
          role: "business_owner",
          preferredLanguage: "en",
        })
      }

      await Business.create({
        ownerId: user._id,
        businessName: biz.businessName,
        businessType: biz.businessType,
        description: biz.description,
        location,
        workingHours: biz.workingHours,
        priceRange: biz.priceRange,
        phone: biz.phone,
      })

      console.log(`✅ Created: ${biz.businessName}`)
      addedCount++
    }

    console.log(`\n✅ Successfully added ${addedCount} new businesses!`)
    process.exit(0)
  } catch (err) {
    console.error("❌ Seeding error:", err)
    process.exit(1)
  }
}

seedDatabase()
