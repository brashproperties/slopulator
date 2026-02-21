
import json
import requests
import numpy as np
from shapely.geometry import Point, Polygon
from shapely.prepared import prep
from tqdm import tqdm

# --- Configuration ---
CHICKASHA_BOUNDING_BOX = {
    "min_lon": -98.02,
    "max_lon": -97.85,
    "min_lat": 34.98,
    "max_lat": 35.10
}
GRID_RESOLUTION = 0.001  # Smaller number = finer grid
PROPERTYREACH_API_KEY = "live_u9JyD3Hmp58wmEQEnyZ5GosDjDcXHH5SuUN"

# --- Helper Functions ---

from .tactical_logic import TACTICAL_TIERS, ECONOMIC_DRIVERS

# Function to fetch property data from PropertyReach
# (Will require reverse geocoding or spatial search refinement)
def fetch_property_data(latitude, longitude):
    # This is a placeholder. PropertyReach needs an address.
    # For initial testing, simulate data. More variation now.
    return {"estimatedValue": np.random.uniform(10000, 600000), "crimeScore": np.random.uniform(1, 10)}

def get_vibe_score(latitude, longitude):
    """
    Calculates a 'vibe score' for a given lat/lon based on tactical logic,
    PropertyReach data, and crime statistics.
    """
    vibe_score = np.random.uniform(30, 70) # Start with a random baseline for more variation

    # Simulate fetching property data (using the more varied data from fetch_property_data)
    property_data = fetch_property_data(latitude, longitude)
    
    # Simulate crime data integration (placeholder for now, will refine with OSBI data)
    crime_score = property_data.get("crimeScore", 5) 
    estimated_value = property_data.get("estimatedValue", 250000)

    # Apply TACTICAL_TIERS rules (simplified heuristic for now, will evolve with spatial lookups)
    # These rules now have a stronger influence on the vibe_score
    if crime_score > 7: # High crime pushes towards High Yield / Risk
        vibe_score -= np.random.uniform(15, 30)
    elif crime_score < 3: # Low crime pushes towards Elite/Core Growth
        vibe_score += np.random.uniform(15, 30)

    if estimated_value > 300000: # High value pushes towards Elite
        vibe_score += np.random.uniform(10, 25)
    elif estimated_value < 100000: # Low value pushes towards High Yield / Risk
        vibe_score -= np.random.uniform(10, 25)

    # Clamp score between 0 and 100
    vibe_score = max(0, min(100, vibe_score))

    return vibe_score

def interpolate_vibe_scores(grid_points, vibe_scores):
    """
    Interpolates vibe scores across the grid to create a smoother gradient using a simple averaging method.
    """
    # Simple averaging: each point's score is averaged with its immediate neighbors
    # This is a basic form of smoothing. More advanced methods can be implemented later.
    interpolated = np.copy(vibe_scores)
    
    # Reshape grid_points and vibe_scores for easier spatial indexing
    # This assumes a regular grid
    num_lon = len(np.arange(CHICKASHA_BOUNDING_BOX["min_lon"], CHICKASHA_BOUNDING_BOX["max_lon"], GRID_RESOLUTION))
    num_lat = len(np.arange(CHICKASHA_BOUNDING_BOX["min_lat"], CHICKASHA_BOUNDING_BOX["max_lat"], GRID_RESOLUTION))
    
    # Handle cases where grid might be empty or too small
    if num_lon * num_lat == 0:
        return vibe_scores
    
    reshaped_scores = np.array(vibe_scores).reshape(num_lat, num_lon)
    
    for i in range(num_lat):
        for j in range(num_lon):
            neighbors = []
            if i > 0: neighbors.append(reshaped_scores[i-1, j]) # Up
            if i < num_lat - 1: neighbors.append(reshaped_scores[i+1, j]) # Down
            if j > 0: neighbors.append(reshaped_scores[i, j-1]) # Left
            if j < num_lon - 1: neighbors.append(reshaped_scores[i, j+1]) # Right
            
            # Include self in average
            neighbors.append(reshaped_scores[i, j])
            
            interpolated[i * num_lon + j] = np.mean(neighbors)
            
    return interpolated

def assign_color_from_vibe(vibe_score):
    """
    Assigns a color based on the vibe score, mapping it to tactical tiers.
    """
    for tier in TACTICAL_TIERS:
        min_score, max_score = tier["vibe_score_range"]
        if min_score <= vibe_score <= max_score:
            return tier["color"]
    return "#808080" # Default grey if no tier matches

# --- Main Generation Logic ---

def generate_chickasha_map_data():
    features = []
    
    # Create a boundary polygon for Chickasha to ensure points are within city limits (optional but good)
    # For now, just use the bounding box. Later, can load actual city boundary GeoJSON.
    
    lon_coords = np.arange(CHICKASHA_BOUNDING_BOX["min_lon"], CHICKASHA_BOUNDING_BOX["max_lon"], GRID_RESOLUTION)
    lat_coords = np.arange(CHICKASHA_BOUNDING_BOX["min_lat"], CHICKASHA_BOUNDING_BOX["max_lat"], GRID_RESOLUTION)
    
    grid_points = []
    
    # Generate grid points (centers of small cells)
    for lat in tqdm(lat_coords, desc="Generating Grid"):
        for lon in lon_coords:
            grid_points.append((lat, lon))
            
    # Calculate raw vibe scores for each grid point
    raw_vibe_scores = [get_vibe_score(lat, lon) for lat, lon in tqdm(grid_points, desc="Calculating Vibe Scores")]
    
    # Interpolate scores for a smoother look
    interpolated_scores = interpolate_vibe_scores(grid_points, raw_vibe_scores)
    
    # Create GeoJSON features for each grid cell
    for i, (lat, lon) in enumerate(tqdm(grid_points, desc="Creating GeoJSON Features")):
        vibe_score = interpolated_scores[i]
        color = assign_color_from_vibe(vibe_score)
        
        # Create a small square polygon for each grid point for now
        # Later, we can adjust this to be more organic if needed
        half_res = GRID_RESOLUTION / 2
        polygon = Polygon([
            (lon - half_res, lat - half_res),
            (lon + half_res, lat - half_res),
            (lon + half_res, lat + half_res),
            (lon - half_res, lat + half_res),
            (lon - half_res, lat - half_res)
        ])
        
        features.append({
            "type": "Feature",
            "properties": {
                "color": color,
                "vibe_score": vibe_score # Include score for debugging/details
            },
            "geometry": json.loads(json.dumps(polygon.__geo_interface__)) # Convert Shapely Polygon to GeoJSON dict
        })
        
    feature_collection = {
        "type": "FeatureCollection",
        "features": features
    }
    
    return feature_collection

# --- Execution ---
if __name__ == "__main__":
    print("Starting map data generation...")
    generated_data = generate_chickasha_map_data()
    
    with open("data.json", "w") as f:
        json.dump(generated_data, f, indent=2)
        
    print("Map data generation complete. data.json updated.")
