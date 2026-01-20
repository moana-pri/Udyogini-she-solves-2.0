// import express from "express";
// import Business from "../models/Businessloc.js";

// const router = express.Router();

// router.get("/nearby", async (req, res) => {
//   try {
//     const { lat, lng, radius = 5 } = req.query;

//     if (!lat || !lng) {
//       return res.status(400).json({ message: "Latitude & longitude required" });
//     }

//     const businesses = await Business.find({
//       location: {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: [
//               parseFloat(lng),
//               parseFloat(lat)
//             ]
//           },
//           $maxDistance: radius * 1000
//         }
//       }
//     });

//     res.json(businesses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;
// router.post("/add", async (req, res) => {
//   const business = new Business(req.body);
//   await business.save();
//   res.json({ message: "Business added" });
// });
import express from "express";
import BusinessLoc from "../models/BusinessLoc.js";
import Business from "../models/Business.js";

const router = express.Router();

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const locations = await BusinessLoc.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: 5000 // 5 km
        }
      }
    }).populate("businessId");

    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/add-location", async (req, res) => {
  const { businessId, lat, lng } = req.body;

  const loc = await BusinessLoc.create({
    businessId,
    location: {
      type: "Point",
      coordinates: [lng, lat]
    }
  });

  res.json(loc);
});

export default router;
