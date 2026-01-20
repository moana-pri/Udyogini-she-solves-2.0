// Example: How to Use Translations in Your Components

import { getTranslation } from "@/lib/translations"

// In a React component:
"use client"

import { useState, useEffect } from "react"

export function MyComponent() {
  const [language, setLanguage] = useState("en")

  // Get language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)
  }, [])

  // Usage 1: Direct translation call
  const welcomeText = getTranslation("welcome", language)
  const dashboardText = getTranslation("dashboard", language)
  const searchText = getTranslation("search_services", language)

  return (
    <div>
      <h1>{welcomeText}</h1>
      <p>{dashboardText}</p>
      <button>{searchText}</button>
    </div>
  )
}

// ============================================
// CURRENT TRANSLATION KEYS AVAILABLE
// ============================================

/*
COMMON KEYS:
- welcome
- logout
- profile
- settings
- language
- search
- nearby
- bookings
- home

DASHBOARD KEYS:
- dashboard
- customer_dashboard
- quick_actions
- find_service
- my_bookings
- favorites
- recent_bookings
- no_bookings
- upcoming_services
- past_services

SEARCH KEYS:
- search_services
- nearby_services
- service_type
- location
- search_by_name
- distance
- price_range
- rating
- reviews

BUSINESS DETAILS:
- book_now
- call
- view_profile
- working_hours
- about
- location_info

BOOKING KEYS:
- schedule_booking
- select_date
- select_time
- confirm_booking
- booking_confirmed
- booking_pending
- cancel_booking
- contact_business

PROFILE KEYS:
- my_profile
- edit_profile
- full_name
- phone
- email
- address
- preferred_language
- save_changes

AUTH KEYS:
- login
- register
- logout
- customer
- business_owner
- register_as_customer
- register_as_business
- password
- confirm_password
- business_name
- business_type
*/

// ============================================
// TO ADD NEW TRANSLATION KEYS
// ============================================

/*
1. Open Frontend/lib/translations.ts
2. Add new key in all three language objects (en, hi, mr):

export const translations = {
  en: {
    "new_key": "English text"
  },
  hi: {
    "new_key": "हिंदी पाठ"
  },
  mr: {
    "new_key": "मराठी पाठ"
  }
}

3. Use in component:
const newText = getTranslation("new_key", language)

*/

// ============================================
// SUPPORTED LANGUAGES
// ============================================

/*
- "en" → English
- "hi" → Hindi
- "mr" → Marathi

Language is stored in:
- localStorage as "language" key
- Database as "preferredLanguage" field in User

To change language:
1. Click EN/HI/MR button in header
2. Page reloads
3. All getTranslation() calls use new language
*/
