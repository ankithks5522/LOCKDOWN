# Google Maps API Setup Instructions

## Step 1: Get Your API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Library"
4. Search for "Maps JavaScript API" and enable it
5. Go to "APIs & Services" > "Credentials"
6. Click "Create Credentials" > "API Key"
7. Copy your API key

## Step 2: Add API Key to map.html

Open `map.html` and replace `YOUR_API_KEY` with your actual API key:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLaoY&callback=initMap" async defer></script>
```

## Step 3: (Optional) Restrict Your API Key

For security, restrict your API key:
1. Go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your website domain (e.g., `localhost:*`, `yourdomain.com/*`)
5. Under "API restrictions", select "Restrict key"
6. Choose "Maps JavaScript API"
7. Save

## Features Included

- ✅ Kerala region only (bounded map)
- ✅ Flood zone markers (Kochi, Alappuzha, Kozhikode)
- ✅ Wind alert markers (Thiruvananthapuram, Palakkad, Kannur)
- ✅ River level markers (Periyar, Bharathapuzha, Chaliyar)
- ✅ Layer toggle functionality
- ✅ User location tracking
- ✅ Click animations and info windows
- ✅ Hover effects on markers

## Map Bounds

The map is restricted to Kerala region:
- North: 13.0°N
- South: 8.0°N
- East: 77.5°E
- West: 74.0°E

## Note

Google Maps API requires billing to be enabled, but Google provides $200 free credit per month which covers most usage.
