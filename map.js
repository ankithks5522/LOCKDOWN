// Google Maps Integration for Kerala Region
let map;
let floodMarkers = [];
let windMarkers = [];
let riverMarkers = [];
let userLocationMarker = null;
let watchId = null;

// Kerala bounds
const keralaBounds = {
    north: 13.0,
    south: 8.0,
    east: 77.5,
    west: 74.0
};

// Sample locations in Kerala for disaster markers
const floodLocations = [
    { lat: 10.1632, lng: 76.6413, name: 'Kochi Flood Zone' },
    { lat: 9.9312, lng: 76.2673, name: 'Alappuzha Flood Zone' },
    { lat: 11.2588, lng: 75.7804, name: 'Kozhikode Flood Zone' }
];

const windLocations = [
    { lat: 8.5241, lng: 76.9366, name: 'Thiruvananthapuram Wind Alert' },
    { lat: 10.8505, lng: 76.2711, name: 'Palakkad Wind Alert' },
    { lat: 11.8745, lng: 75.3704, name: 'Kannur Wind Alert' }
];

const riverLocations = [
    { lat: 9.4981, lng: 76.3388, name: 'Periyar River Level' },
    { lat: 10.5276, lng: 76.2144, name: 'Bharathapuzha River Level' },
    { lat: 11.2588, lng: 75.7804, name: 'Chaliyar River Level' }
];

// Initialize Google Map
function initMap() {
    // Check if Google Maps is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        showMapError('Google Maps API failed to load. Please check your API key.');
        return;
    }
    
    // Kerala center coordinates
    const keralaCenter = { lat: 10.5, lng: 76.2 };
    
    try {
        // Create map
        map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: keralaCenter,
        zoom: 8,
        minZoom: 7,
        maxZoom: 15,
        restriction: {
            latLngBounds: keralaBounds,
            strictBounds: true
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });
    
    // Fit map to Kerala bounds
    map.fitBounds(new google.maps.LatLngBounds(
        new google.maps.LatLng(keralaBounds.south, keralaBounds.west),
        new google.maps.LatLng(keralaBounds.north, keralaBounds.east)
    ));
    
    // Initialize markers
    initializeMarkers();
    
        // Initialize controls
        initializeControls();
        
        console.log('Google Maps initialized for Kerala region');
    } catch (error) {
        console.error('Error initializing map:', error);
        showMapError('Failed to initialize map. Please check your API key and ensure Maps JavaScript API is enabled.');
    }
}

// Show map error message
function showMapError(message) {
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                padding: 2rem;
                text-align: center;
                color: #e74c3c;
                font-family: 'Segoe UI', sans-serif;
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
                <h3 style="margin: 0 0 1rem 0; color: #e74c3c;">Map Loading Error</h3>
                <p style="margin: 0 0 1rem 0; color: #666; max-width: 500px;">${message}</p>
                <p style="margin: 0; color: #999; font-size: 0.9rem;">
                    Please check <code>GOOGLE_MAPS_SETUP.md</code> for setup instructions.
                </p>
            </div>
        `;
    }
}

// Handle API load errors
window.gm_authFailure = function() {
    showMapError('Google Maps API authentication failed. Please check your API key.');
};

// Initialize disaster markers
function initializeMarkers() {
    // Create flood markers
    floodLocations.forEach((location, index) => {
        const marker = createDisasterMarker(location, 'flood', 'F', '#3498db');
        floodMarkers.push(marker);
    });
    
    // Create wind markers
    windLocations.forEach((location, index) => {
        const marker = createDisasterMarker(location, 'wind', 'W', '#f39c12');
        windMarkers.push(marker);
    });
    
    // Create river markers
    riverLocations.forEach((location, index) => {
        const marker = createDisasterMarker(location, 'river', 'R', '#27ae60');
        riverMarkers.push(marker);
    });
}

// Create a disaster marker with custom styling
function createDisasterMarker(location, type, label, color) {
    const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        },
        label: {
            text: label,
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 'bold'
        },
        animation: google.maps.Animation.DROP,
        zIndex: google.maps.Marker.MAX_ZINDEX + 1
    });
    
    // Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; font-family: 'Segoe UI', sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: ${color}; font-size: 16px;">${location.name}</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">Type: ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
                <p style="margin: 4px 0 0 0; color: #666; font-size: 12px;">Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}</p>
            </div>
        `
    });
    
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
        // Bounce animation
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
            marker.setAnimation(null);
        }, 2000);
    });
    
    // Add hover effect
    marker.addListener('mouseover', function() {
        marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
        });
    });
    
    marker.addListener('mouseout', function() {
        marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        });
    });
    
    return marker;
}

// Initialize map controls
function initializeControls() {
    const floodLayer = document.getElementById('floodLayer');
    const windLayer = document.getElementById('windLayer');
    const riverLayer = document.getElementById('riverLayer');
    const getLocationBtn = document.getElementById('getLocationBtn');
    const layerToggles = document.querySelectorAll('.layer-toggle');
    
    // Add click animation to layer toggles
    layerToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Flood layer toggle
    if (floodLayer) {
        floodLayer.addEventListener('change', function() {
            toggleMarkerLayer(floodMarkers, this.checked);
        });
    }
    
    // Wind layer toggle
    if (windLayer) {
        windLayer.addEventListener('change', function() {
            toggleMarkerLayer(windMarkers, this.checked);
        });
    }
    
    // River layer toggle
    if (riverLayer) {
        riverLayer.addEventListener('change', function() {
            toggleMarkerLayer(riverMarkers, this.checked);
        });
    }
    
    // Location button
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getUserLocation);
    }
}

// Toggle marker layer visibility
function toggleMarkerLayer(markers, isVisible) {
    markers.forEach((marker, index) => {
        if (isVisible) {
            marker.setMap(map);
            // Animate marker appearance
            setTimeout(() => {
                marker.setAnimation(google.maps.Animation.DROP);
                setTimeout(() => {
                    marker.setAnimation(null);
                }, 1000);
            }, index * 100);
        } else {
            marker.setMap(null);
        }
    });
}

// Get user's current location
function getUserLocation() {
    const getLocationBtn = document.getElementById('getLocationBtn');
    const locationStatus = document.getElementById('locationStatus');
    
    if (!navigator.geolocation) {
        showLocationStatus('Geolocation is not supported by your browser', 'error');
        if (getLocationBtn) {
            getLocationBtn.disabled = true;
        }
        return;
    }
    
    if (getLocationBtn) {
        getLocationBtn.disabled = true;
        getLocationBtn.innerHTML = '<span class="location-icon">⏳</span><span>Locating...</span>';
    }
    
    showLocationStatus('Getting your location...', 'info');
    
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            // Check if location is within Kerala bounds
            if (lat < keralaBounds.south || lat > keralaBounds.north || 
                lng < keralaBounds.west || lng > keralaBounds.east) {
                showLocationStatus('Your location is outside Kerala region', 'error');
                if (getLocationBtn) {
                    getLocationBtn.disabled = false;
                    getLocationBtn.innerHTML = '<span class="location-icon">📍</span><span>My Location</span>';
                }
                return;
            }
            
            createUserLocationMarker(lat, lng);
            showLocationStatus(`Location found! Accuracy: ${Math.round(accuracy)}m`, 'success');
            
            if (getLocationBtn) {
                getLocationBtn.disabled = false;
                getLocationBtn.innerHTML = '<span class="location-icon">📍</span><span>Update Location</span>';
            }
            
            // Start watching location
            if (!watchId) {
                watchUserLocation();
            }
        },
        function(error) {
            let errorMessage = 'Unable to get your location';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please enable location permissions.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out.';
                    break;
            }
            
            showLocationStatus(errorMessage, 'error');
            
            if (getLocationBtn) {
                getLocationBtn.disabled = false;
                getLocationBtn.innerHTML = '<span class="location-icon">📍</span><span>My Location</span>';
            }
        },
        options
    );
}

// Create user location marker
function createUserLocationMarker(lat, lng) {
    // Remove existing marker
    if (userLocationMarker) {
        userLocationMarker.setMap(null);
    }
    
    // Create new marker
    userLocationMarker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: 'Your Location',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#e74c3c',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
        },
        animation: google.maps.Animation.DROP,
        zIndex: google.maps.Marker.MAX_ZINDEX + 10
    });
    
    // Add pulsing circle
    const circle = new google.maps.Circle({
        map: map,
        radius: 1000, // 1km radius
        fillColor: '#e74c3c',
        fillOpacity: 0.1,
        strokeColor: '#e74c3c',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        center: { lat: lat, lng: lng }
    });
    
    // Info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; font-family: 'Segoe UI', sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #e74c3c; font-size: 16px;">📍 Your Location</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">Lat: ${lat.toFixed(4)}</p>
                <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Lng: ${lng.toFixed(4)}</p>
            </div>
        `
    });
    
    userLocationMarker.addListener('click', function() {
        infoWindow.open(map, userLocationMarker);
    });
    
    // Center map on user location
    map.setCenter({ lat: lat, lng: lng });
    map.setZoom(12);
    
    // Store circle reference
    userLocationMarker.circle = circle;
}

// Watch user location
function watchUserLocation() {
    if (!navigator.geolocation) return;
    
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
    };
    
    watchId = navigator.geolocation.watchPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Check if within Kerala bounds
            if (lat >= keralaBounds.south && lat <= keralaBounds.north && 
                lng >= keralaBounds.west && lng <= keralaBounds.east) {
                
                if (userLocationMarker) {
                    userLocationMarker.setPosition({ lat: lat, lng: lng });
                    if (userLocationMarker.circle) {
                        userLocationMarker.circle.setCenter({ lat: lat, lng: lng });
                    }
                } else {
                    createUserLocationMarker(lat, lng);
                }
            }
        },
        function(error) {
            console.error('Watch position error:', error);
        },
        options
    );
}

// Show location status message
function showLocationStatus(message, type = 'info') {
    const locationStatus = document.getElementById('locationStatus');
    if (!locationStatus) return;
    
    locationStatus.textContent = message;
    locationStatus.className = `location-status ${type}`;
    locationStatus.style.display = 'block';
    locationStatus.style.animation = 'slideDown 0.5s ease-out';
    
    setTimeout(() => {
        locationStatus.style.animation = 'slideUp 0.5s ease-out';
        setTimeout(() => {
            locationStatus.style.display = 'none';
        }, 500);
    }, 5000);
}

// Handle dark mode changes
document.addEventListener('DOMContentLoaded', function() {
    // Listen for dark mode changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (map) {
                    // Apply dark mode styles to map if needed
                    const isDark = document.body.classList.contains('dark-mode');
                    // You can customize map styles here
                }
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
});

// Make initMap globally accessible
window.initMap = initMap;
