export const translations: Record<string, Record<string, string>> = {
  en: {
    // Menu & Navigation
    home: "Home",
    search: "Search Services",
    bookings: "Booking History",
    favorites: "Favorites",
    reviews: "Reviews",
    profile: "Profile",
    logout: "Logout",
    dashboard: "Dashboard",
    customers: "Customers",

    // Buttons & Actions
    book_now: "Book Now",
    call: "Call",
    whatsapp: "WhatsApp",
    search_services: "Search Services",
    confirm_booking: "Confirm Booking",
    save_changes: "Save Changes",
    edit_profile: "Edit Profile",
    view_profile: "View Profile",
    use_current_location: "Use Current Location",
    show_map: "Show Map",

    // Labels
    my_bookings: "My Bookings",
    welcome: "Welcome",
    service: "Service",
    location: "Location",
    address: "Address",
    business_owner: "Business Owner",
    phone: "Phone",
    password: "Password",
    email: "Email",
    date: "Date",
    time: "Time",
    price: "Price",
    rating: "Rating",

    // Status
    completed: "Completed",
    pending: "Pending",
    upcoming: "Upcoming",
    cancelled: "Cancelled",
    confirmed: "Confirmed",
  },

  hi: {
    // Menu & Navigation
    home: "होम",
    search: "सेवाएं खोजें",
    bookings: "बुकिंग इतिहास",
    favorites: "पसंदीदा",
    reviews: "समीक्षाएं",
    profile: "प्रोफ़ाइल",
    logout: "लॉगआउट",
    dashboard: "डैशबोर्ड",
    customers: "ग्राहक",

    // Buttons & Actions
    book_now: "अभी बुक करें",
    call: "कॉल करें",
    whatsapp: "व्हाट्सएप",
    search_services: "सेवाएं खोजें",
    confirm_booking: "बुकिंग की पुष्टि करें",
    save_changes: "परिवर्तन सहेजें",
    edit_profile: "प्रोफ़ाइल संपादित करें",
    view_profile: "प्रोफ़ाइल देखें",
    use_current_location: "मौजूदा स्थान का उपयोग करें",
    show_map: "मानचित्र दिखाएं",

    // Labels
    my_bookings: "मेरी बुकिंग",
    welcome: "स्वागत है",
    service: "सेवा",
    location: "स्थान",
    address: "पता",
    business_owner: "व्यवसाय मालिक",
    phone: "फ़ोन",
    password: "पासवर्ड",
    email: "ईमेल",
    date: "तारीख",
    time: "समय",
    price: "कीमत",
    rating: "रेटिंग",

    // Status
    completed: "पूर्ण",
    pending: "लंबित",
    upcoming: "आगामी",
    cancelled: "रद्द",
    confirmed: "पुष्टि",

    // Business Registration
    business_name: "व्यवसाय का नाम",
    owner_name: "मालिक का नाम",
    business_type: "व्यवसाय प्रकार",
    working_hours: "कार्य समय",
    price_range: "मूल्य सीमा",
    business_description: "व्यवसाय विवरण",

    // Booking
    select_service: "सेवा चुनें",
    select_date: "तारीख चुनें",
    select_time: "समय चुनें",
    additional_notes: "अतिरिक्त नोट्स",
    booking_successful: "बुकिंग सफल",
    booking_failed: "बुकिंग विफल",

    // Search
    nearby_businesses: "आस-पास के व्यवसाय",
    search_location: "स्थान खोजें",
    current_location: "वर्तमान स्थान",
  },

  mr: {
    // Menu & Navigation
    home: "होम",
    search: "सेवा शोधा",
    bookings: "बुकिंग हिस्ट्री",
    favorites: "आवडते",
    reviews: "समीक्षा",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",
    dashboard: "डॅशबोर्ड",
    customers: "ग्राहक",

    // Buttons & Actions
    book_now: "आता बुक करा",
    call: "कॉल करा",
    whatsapp: "व्हाट्सअॅप",
    search_services: "सेवा शोधा",
    confirm_booking: "बुकिंग पुष्टी करा",
    save_changes: "बदल सेव करा",
    edit_profile: "प्रोफाइल संपादित करा",
    view_profile: "प्रोफाइल पहा",
    use_current_location: "सध्याचे स्थान वापरा",
    show_map: "नकाशा दाखवा",

    // Labels
    my_bookings: "माझी बुकिंग",
    welcome: "स्वागत आहे",
    service: "सेवा",
    location: "स्थान",
    address: "पत्ता",
    business_owner: "व्यवसाय मालक",
    phone: "फोन",
    password: "पासवर्ड",
    email: "ईमेल",
    date: "तारीख",
    time: "वेळ",
    price: "किंमत",
    rating: "रेटिंग",

    // Status
    completed: "पूर्ण",
    pending: "प्रलंबित",
    upcoming: "आगामी",
    cancelled: "रद्द",
    confirmed: "पुष्टी",
  },
}

// Simple translation helper function
export const t = (key: string, language: string = "en"): string => {
  const lang = (language as keyof typeof translations) || "en"
  return translations[lang]?.[key] || key
}
