import os
import googlemaps
from typing import Optional,Dict,Tuple
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

class GeocodingService:
    def __init__(self):
        if not GOOGLE_MAPS_API_KEY:
            logger.error("Google Maps API key is not set in environment variables.")
            self.client = None
        else:
            try:
                self.client = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
                logger.info("Google Maps client initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Google Maps client: {e}")
                self.client = None
    
    def geocode_address(self, address: str, city: str, state: str, zip_code: str, country: str = "US") -> Optional[Tuple[float, float]]:
        if not self.client:
            logger.error("Google Maps client is not initialized.")
            return None

        try:
            full_address = f"{address}, {city}, {state} {zip_code}, {country}"
            geocode_result = self.client.geocode(full_address)
            if geocode_result and len(geocode_result) > 0:
                location = geocode_result[0]['geometry']['location']
                latitude = location['lat']
                longitude = location['lng']
                logger.info(f"Geocoded address '{full_address}' to coordinates: ({latitude}, {longitude})")
                return (latitude, longitude)
            else:
                logger.warning(f"No geocoding result for address: {full_address}")
                return None
        except Exception as e:
            logger.error(f"Error during geocoding for address '{full_address}': {e}")
            return None
    
    def get_full_address_details(self, address: str, city: str, state: str, zip_code: str, country: str = "US") -> Optional[Dict]:
        if not self.client:
            logger.error("Google Maps client is not initialized.")
            return None

        try:
            full_address = f"{address}, {city}, {state} {zip_code}, {country}"
            geocode_result = self.client.geocode(full_address)
            if geocode_result and len(geocode_result) > 0:
                result = geocode_result[0]
                location = result['geometry']['location']

                details = {
                    'latitude': location['lat'],
                    'longitude': location['lng'],
                    'formatted_address': result('formatted_address'),
                    'address_components': result.get('address_components', []),
                    'place_id': result.get('place_id')
                }
                logger.info(f"Retrieved full address details for '{full_address}'")
                return result
            else:
                logger.warning(f"No geocoding result for address: {full_address}")
                return None
        except Exception as e:
            logger.error(f"Error retrieving address details for '{full_address}': {e}")
            return None
    
    def reverse_geocode(self, latitude: float, longitude: float) -> Optional[str]:
        if not self.client:
            logger.error("Google Maps client is not initialized.")
            return None

        try:
            reverse_geocode_result = self.client.reverse_geocode((latitude, longitude))
            if reverse_geocode_result and len(reverse_geocode_result) > 0:
                formatted_address = reverse_geocode_result[0]['formatted_address']
                logger.info(f"Reverse geocoded coordinates ({latitude}, {longitude}) to address: {formatted_address}")
                return formatted_address
            else:
                logger.warning(f"No reverse geocoding result for coordinates: ({latitude}, {longitude})")
                return None
        except Exception as e:
            logger.error(f"Error during reverse geocoding for coordinates ({latitude}, {longitude}): {e}")
            return None
        
    def validate_address(self, address: str, city: str, state: str, zip_code: str, country: str = "US") -> bool:
        if not self.client:
            logger.error("Google Maps client is not initialized.")
            return False
        
        coords = self.geocode_address(address, city, state, zip_code, country)
        return coords is not None
    
geocoding_service = GeocodingService()

def get_coordinates(address: str, city: str, state: str, zip_code: str, country: str = "US") -> Optional[Tuple[float, float]]:
    return geocoding_service.geocode_address(address, city, state, zip_code, country)