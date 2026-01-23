import Business from "../models/Business.js";
import User from "../models/User.js";
import { translateBusinessContent } from "../utils/translateText.js";

/**
 * Fetch business with translated content for customers
 * Translates business description based on customer's preferred language
 */
export async function getBusinessForCustomer(req, res) {
  try {
    const { businessId } = req.params;
    const customerId = req.user?.id;
    const customerPreferredLanguage = req.user?.preferredLanguage || "en";

    console.log(`👤 Customer fetching business: ${businessId}`);
    console.log(`🌐 Customer preferred language: ${customerPreferredLanguage}`);

    // Validate ObjectId
    if (!businessId) {
      return res
        .status(400)
        .json({ message: "Business ID required" });
    }

    // Fetch business
    const business = await Business.findById(businessId);
    if (!business) {
      return res
        .status(404)
        .json({ message: "Business not found" });
    }

    const businessLanguage = business.language || "en";
    console.log(`🏢 Business language: ${businessLanguage}`);

    // Convert to plain object to avoid Mongoose document issues
    let businessData = business.toObject();

    // Translate if languages differ
    if (businessLanguage !== customerPreferredLanguage) {
      console.log(`🔄 Translation needed: ${businessLanguage} → ${customerPreferredLanguage}`);
      businessData = await translateBusinessContent(
        businessData,
        businessLanguage,
        customerPreferredLanguage,
        ["description"] // Fields to translate
      );
      // Mark that this is translated data (not stored in DB)
      businessData._translated = true;
      businessData._translatedLanguage = customerPreferredLanguage;
    }

    res.json(businessData);
  } catch (error) {
    console.error("❌ Error fetching business for customer:", error);
    res.status(500).json({
      message: "Error fetching business",
      error: error.message
    });
  }
}

/**
 * Fetch multiple businesses with translated content for customers
 * Used for search results, nearby businesses, etc.
 */
export async function getBusinessesForCustomer(req, res) {
  try {
    const customerPreferredLanguage = req.user?.preferredLanguage || "en";

    console.log(`👤 Customer fetching businesses`);
    console.log(`🌐 Customer preferred language: ${customerPreferredLanguage}`);

    // Get query filters from request
    const { type, location, radius = 10 } = req.query;

    let query = {};
    if (type) query.businessType = type;
    if (location) query["location.address"] = { $regex: location, $options: "i" };

    // Fetch businesses
    const businesses = await Business.find(query).limit(20);

    console.log(`📊 Found ${businesses.length} businesses`);

    // Translate each business if needed
    const translatedBusinesses = await Promise.all(
      businesses.map(async (business) => {
        const businessLanguage = business.language || "en";
        let businessData = business.toObject();

        if (businessLanguage !== customerPreferredLanguage) {
          console.log(`🔄 Translating business: ${business.businessName}`);
          businessData = await translateBusinessContent(
            businessData,
            businessLanguage,
            customerPreferredLanguage,
            ["description"]
          );
          businessData._translated = true;
          businessData._translatedLanguage = customerPreferredLanguage;
        }

        return businessData;
      })
    );

    res.json(translatedBusinesses);
  } catch (error) {
    console.error("❌ Error fetching businesses for customer:", error);
    res.status(500).json({
      message: "Error fetching businesses",
      error: error.message
    });
  }
}

export default { getBusinessForCustomer, getBusinessesForCustomer };
