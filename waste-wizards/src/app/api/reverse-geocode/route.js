// app/api/reverse-geocode/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  
  // Check if we have the required parameters
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }
  
  // Get the API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }
  
  try {
    // Make request to Google's Geocoding API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Google API returned status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we got results
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      // Google returns multiple results with different levels of precision
      // The first result is usually the most specific (exact address)
      return NextResponse.json({ address: data.results[0].formatted_address });
    } else {
      return NextResponse.json({ 
        address: `Location at ${lat}, ${lng}`,
        error: data.status || 'No results found'
      });
    }
  } catch (error) {
    console.error('Error during geocoding:', error);
    return NextResponse.json({ 
      error: 'Failed to get address',
      address: `Location at ${lat}, ${lng}`
    }, { status: 500 });
  }
}