
# ~/projects/brash-maps/api/tactical_logic.py

TACTICAL_TIERS = [
    {
        "name": "ELITE",
        "color": "#96c93d", # Green
        "description": "High owner-occupancy, top-tier schools (Pioneer/Grand Ave), low crime. Safe equity, long-term holds, premium renovations.",
        "primary_areas": ["South of Grand Ave", "West of 16th St"],
        "secondary_areas": ["Marlin Ct corridor"],
        "metrics_keywords": ["high owner-occupancy", "top-tier schools", "low crime"],
        "pps_target_min": 145,
        "pps_target_max": 165,
        "vibe_score_range": (80, 100)
    },
    {
        "name": "CORE GROWTH",
        "color": "#feca57", # Yellow
        "description": "High rental demand, stable mid-market value, moderate vacancy. The 'Sweet Spot' for value-add rentals. Stable cash flow.",
        "primary_areas": ["Hwy 62 corridor", "West Hill", "Sparks"],
        "secondary_areas": [],
        "metrics_keywords": ["high rental demand", "stable mid-market value", "moderate vacancy"],
        "pps_target_min": 110,
        "pps_target_max": 140,
        "vibe_score_range": (60, 80)
    },
    {
        "name": "STABILITY",
        "color": "#54a0ff", # Blue
        "description": "High stability halo, student/faculty rental anchor. Low vacancy, high stability. Operates on its own market logic.",
        "primary_areas": ["3-block radius around USAO University"],
        "secondary_areas": [],
        "metrics_keywords": ["high stability", "student/faculty rental anchor", "low vacancy"],
        "pps_target_min": None, # Specific PPS not given, will infer from context
        "pps_target_max": None,
        "vibe_score_range": (40, 60)
    },
    {
        "name": "SPECULATIVE",
        "color": "#ff9900", # Orange
        "description": "High variance block-by-block, rehab-dependent value. Aggressive rehabs only. You're fixing the neighborhood block-by-block.",
        "primary_areas": ["North of Grand Ave", "West of Hwy 81"],
        "secondary_areas": ["1219 W Colorado"],
        "metrics_keywords": ["high variance", "rehab-dependent value"],
        "pps_target_min": 90,
        "pps_target_max": 115,
        "vibe_score_range": (20, 40)
    },
    {
        "name": "HIGH YIELD / RISK",
        "color": "#ff6b6b", # Red
        "description": "High management intensity, highest crime stats, industrial blight. 'Buy low, flip fast' or specialized management.",
        "primary_areas": ["3rd St Corridor", "Industrial North", "East Side Tracks"],
        "secondary_areas": ["near Dog Food Plant"],
        "metrics_keywords": ["high management intensity", "highest crime stats", "industrial blight"],
        "pps_target_min": 12, # PPS Floor
        "pps_target_max": 65,
        "vibe_score_range": (0, 20)
    }
]

# Economic Drivers (for overall vibe adjustment or future features)
ECONOMIC_DRIVERS = [
    {"name": "$3.5B Airport Industrial Park", "impact": "Massive job growth anchor"},
    {"name": "$581M TIF Districts", "impact": "Downtown (A) and Hwy 62 (B) infrastructure upgrades"},
    {"name": "Gateway to Chickasha", "impact": "actively shifting 'Orange' zones to 'Yellow'"}
]
