import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Test business profile endpoint
async function testBusinessProfile() {
  console.log('🧪 Testing business profile endpoint...');

  try {
    // First, login as a business owner to get token
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '9876543210', // Priya's Beauty Parlour owner
        password: 'password123'
      })
    });

    if (!loginRes.ok) {
      console.log('❌ Login failed');
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;

    console.log('✅ Login successful, token received');

    // Test business profile fetch
    const profileRes = await fetch(`${API_BASE}/business/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📡 Profile response status:', profileRes.status);

    if (!profileRes.ok) {
      const errorData = await profileRes.json();
      console.log('❌ Profile fetch failed:', errorData);
      return;
    }

    const profileData = await profileRes.json();
    console.log('✅ Profile data received:', JSON.stringify(profileData, null, 2));

    // Test booking creation
    console.log('🧪 Testing booking creation...');

    // Get a business ID first
    const businessRes = await fetch(`${API_BASE}/business/nearby?lat=18.5204&lng=73.8567&radius=50`);
    if (!businessRes.ok) {
      console.log('❌ Failed to fetch businesses');
      return;
    }

    const businesses = await businessRes.json();
    if (businesses.length === 0) {
      console.log('❌ No businesses found');
      return;
    }

    const businessId = businesses[0]._id;
    console.log('📍 Using business ID:', businessId);

    // Login as customer
    const customerLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '9876543210', // Same phone, but as customer
        password: 'password123'
      })
    });

    let customerToken;
    if (customerLoginRes.ok) {
      const customerData = await customerLoginRes.json();
      customerToken = customerData.token;
    } else {
      // Register a customer first
      console.log('👤 Registering customer...');
      const registerRes = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Test Customer',
          phone: '9999999999',
          password: 'password123',
          role: 'customer'
        })
      });

      if (!registerRes.ok) {
        console.log('❌ Customer registration failed');
        return;
      }

      const registerData = await registerRes.json();
      customerToken = registerData.token;
      console.log('✅ Customer registered and logged in');
    }

    // Create booking
    const bookingRes = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        businessId,
        service: 'Basic Service',
        date: '2024-12-31',
        time: '10:00',
        notes: 'Test booking'
      })
    });

    console.log('📡 Booking response status:', bookingRes.status);

    if (!bookingRes.ok) {
      const errorData = await bookingRes.json();
      console.log('❌ Booking creation failed:', errorData);
      return;
    }

    const bookingData = await bookingRes.json();
    console.log('✅ Booking created successfully:', JSON.stringify(bookingData, null, 2));

  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
}

testBusinessProfile();
