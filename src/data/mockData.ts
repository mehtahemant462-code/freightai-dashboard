import { FreightDataPoint, MonthlyTrendPoint, PortData, VesselClass, RiskAlert, ContractStrategy, WeatherCondition } from '../types';

export const KPI_SUMMARY = {
  currentRate: 18.20,
  currentRateUnit: '$/Ton',
  rateChange24h: -2.4,
  bestCharterDay: 'Day 15',
  bestCharterDate: 'Oct 18, 2026',
  targetRate: 15.28,
  recommendedVessel: 'Panamax',
  vesselDwt: '82,000 DWT',
  estimatedSavingsPct: 16.0,
  estimatedSavingsDollar: 221000,
  forecastAccuracy: 94.8,
  aiConfidence: 91.4,
  activeRoute: 'Australia (Port Hedland) → India (Paradip)',
  distanceNauticalMiles: 4150,
  averageVoyageDays: 14.5,
};

// 30-Day freight trend data (Days -10 to 0 are actuals, 1 to 30 are forecasted with CI)
export const FREIGHT_TREND_30: FreightDataPoint[] = [
  { day: 'D -10', dayNum: -10, actualRate: 19.40, spotRate: 19.40 },
  { day: 'D -8', dayNum: -8, actualRate: 19.10, spotRate: 19.10 },
  { day: 'D -6', dayNum: -6, actualRate: 18.85, spotRate: 18.85 },
  { day: 'D -4', dayNum: -4, actualRate: 18.60, spotRate: 18.60 },
  { day: 'D -2', dayNum: -2, actualRate: 18.35, spotRate: 18.35 },
  { day: 'Today', dayNum: 0, actualRate: 18.20, predictedRate: 18.20, lowerBound: 18.20, upperBound: 18.20, spotRate: 18.20 },
  { day: 'D +2', dayNum: 2, predictedRate: 18.05, lowerBound: 17.50, upperBound: 18.60, spotRate: 18.20 },
  { day: 'D +4', dayNum: 4, predictedRate: 17.70, lowerBound: 17.00, upperBound: 18.40, spotRate: 18.20 },
  { day: 'D +6', dayNum: 6, predictedRate: 17.25, lowerBound: 16.45, upperBound: 18.05, spotRate: 18.20 },
  { day: 'D +8', dayNum: 8, predictedRate: 16.80, lowerBound: 15.90, upperBound: 17.70, spotRate: 18.20 },
  { day: 'D +10', dayNum: 10, predictedRate: 16.30, lowerBound: 15.35, upperBound: 17.25, spotRate: 18.20 },
  { day: 'D +12', dayNum: 12, predictedRate: 15.75, lowerBound: 14.70, upperBound: 16.80, spotRate: 18.20 },
  { day: 'D +14', dayNum: 14, predictedRate: 15.35, lowerBound: 14.20, upperBound: 16.50, spotRate: 18.20 },
  { day: 'D +15', dayNum: 15, predictedRate: 15.28, lowerBound: 14.10, upperBound: 16.45, isOptimal: true, spotRate: 18.20 },
  { day: 'D +16', dayNum: 16, predictedRate: 15.42, lowerBound: 14.20, upperBound: 16.65, spotRate: 18.20 },
  { day: 'D +18', dayNum: 18, predictedRate: 15.90, lowerBound: 14.60, upperBound: 17.20, spotRate: 18.20 },
  { day: 'D +20', dayNum: 20, predictedRate: 16.45, lowerBound: 15.00, upperBound: 17.90, spotRate: 18.20 },
  { day: 'D +22', dayNum: 22, predictedRate: 16.95, lowerBound: 15.40, upperBound: 18.50, spotRate: 18.20 },
  { day: 'D +24', dayNum: 24, predictedRate: 17.40, lowerBound: 15.70, upperBound: 19.10, spotRate: 18.20 },
  { day: 'D +26', dayNum: 26, predictedRate: 17.90, lowerBound: 16.00, upperBound: 19.80, spotRate: 18.20 },
  { day: 'D +28', dayNum: 28, predictedRate: 18.35, lowerBound: 16.30, upperBound: 20.40, spotRate: 18.20 },
  { day: 'D +30', dayNum: 30, predictedRate: 18.80, lowerBound: 16.60, upperBound: 21.00, spotRate: 18.20 },
];

export const FREIGHT_TREND_60: FreightDataPoint[] = [
  ...FREIGHT_TREND_30.slice(0, 14),
  { day: 'D +15', dayNum: 15, predictedRate: 15.28, lowerBound: 14.10, upperBound: 16.45, isOptimal: true, spotRate: 18.20 },
  { day: 'D +20', dayNum: 20, predictedRate: 16.45, lowerBound: 15.00, upperBound: 17.90, spotRate: 18.20 },
  { day: 'D +30', dayNum: 30, predictedRate: 18.80, lowerBound: 16.60, upperBound: 21.00, spotRate: 18.20 },
  { day: 'D +40', dayNum: 40, predictedRate: 19.60, lowerBound: 17.10, upperBound: 22.10, spotRate: 18.20 },
  { day: 'D +50', dayNum: 50, predictedRate: 18.90, lowerBound: 16.20, upperBound: 21.60, spotRate: 18.20 },
  { day: 'D +60', dayNum: 60, predictedRate: 17.80, lowerBound: 15.00, upperBound: 20.60, spotRate: 18.20 },
];

export const FREIGHT_TREND_90: FreightDataPoint[] = [
  ...FREIGHT_TREND_60,
  { day: 'D +70', dayNum: 70, predictedRate: 16.90, lowerBound: 14.00, upperBound: 19.80, spotRate: 18.20 },
  { day: 'D +80', dayNum: 80, predictedRate: 16.40, lowerBound: 13.50, upperBound: 19.30, spotRate: 18.20 },
  { day: 'D +90', dayNum: 90, predictedRate: 17.10, lowerBound: 13.90, upperBound: 20.30, spotRate: 18.20 },
];

export const MONTHLY_TREND_DATA: MonthlyTrendPoint[] = [
  { month: 'May', historicalAvg: 19.8, currentYear: 19.2, predicted: 19.2 },
  { month: 'Jun', historicalAvg: 20.5, currentYear: 20.1, predicted: 20.1 },
  { month: 'Jul', historicalAvg: 21.2, currentYear: 20.8, predicted: 20.8 },
  { month: 'Aug', historicalAvg: 19.4, currentYear: 18.9, predicted: 18.9 },
  { month: 'Sep', historicalAvg: 18.6, currentYear: 18.2, predicted: 18.2 },
  { month: 'Oct', historicalAvg: 17.9, currentYear: 0, predicted: 15.8 },
  { month: 'Nov', historicalAvg: 18.3, currentYear: 0, predicted: 16.9 },
  { month: 'Dec', historicalAvg: 19.1, currentYear: 0, predicted: 18.2 },
];

export const VESSELS: VesselClass[] = [
  {
    id: 'panamax',
    name: 'Panamax',
    dwtCapacity: '82,000 DWT',
    dwtNum: 82000,
    beam: 32.26,
    draft: 14.50,
    loa: 229.0,
    suitableCargo: 'Coking Coal, Thermal Coal, Grain, Fertilizer',
    compatibilityScore: 96,
    fuelConsumptionTonsDay: 28.5,
    estimatedDailyHire: 14200,
    speedKnots: 13.5,
    recommended: true,
    imagePlaceholder: '🚢',
    advantages: [
      'Unrestricted draft clearance at Paradip & Vizag Inner Basin',
      'Optimal lot size (70,000 - 75,000 MT) for blast furnace procurement',
      'Lowest charter hire rate per ton over this route distance',
      'Bunker consumption 18% lower than Capesize per mile'
    ],
    limitations: [
      'Cannot carry extreme ultra-heavy single-lift ore cargo exceeding 85,000 MT'
    ]
  },
  {
    id: 'supramax',
    name: 'Supramax',
    dwtCapacity: '58,000 DWT',
    dwtNum: 58000,
    beam: 32.20,
    draft: 13.30,
    loa: 190.0,
    suitableCargo: 'Minor Bulk, Bauxite, Clinker, Pet Coke',
    compatibilityScore: 82,
    fuelConsumptionTonsDay: 24.0,
    estimatedDailyHire: 12800,
    speedKnots: 13.0,
    recommended: false,
    imagePlaceholder: '⛵',
    advantages: [
      'Self-geared with 4x30T cranes and grabs for shallow berths',
      'High port flexibility, can discharge at Haldia and Gopalpur with ease',
      'Lower demurrage risk in heavily congested outer anchorages'
    ],
    limitations: [
      'Higher freight rate per ton ($21.10/T) due to smaller parcel economies of scale',
      'Requires 2 voyages to fulfill a 120,000 MT quarterly coal allocation'
    ]
  },
  {
    id: 'capesize',
    name: 'Capesize',
    dwtCapacity: '180,000 DWT',
    dwtNum: 180000,
    beam: 45.00,
    draft: 18.20,
    loa: 292.0,
    suitableCargo: 'Heavy Iron Ore, Raw Thermal Coal Bulk',
    compatibilityScore: 64,
    fuelConsumptionTonsDay: 46.0,
    estimatedDailyHire: 23500,
    speedKnots: 14.0,
    recommended: false,
    imagePlaceholder: '🛳️',
    advantages: [
      'Maximum volume transport efficiency for massive bulk requirements',
      'Low theoretical $/MT on deep-water unrestricted transits'
    ],
    limitations: [
      'Severe draft restriction (>17m required): Cannot enter Paradip inner docks',
      'Requires offshore lightering at Sandheads / Dhamra, adding $3.50/T transshipment',
      'Demurrage risk of $28,000/day during cyclone tidal delays'
    ]
  }
];

export const EAST_COAST_PORTS: PortData[] = [
  {
    id: 'paradip',
    name: 'Paradip Port',
    state: 'Odisha',
    draft: 14.50,
    loa: 260.0,
    beamLimit: 32.5,
    capacity: 289,
    congestionStatus: 'normal',
    waitTimeHours: 18,
    vesselsAtBerth: 12,
    vesselsAtAnchorage: 4,
    coordinates: { x: 380, y: 190, lat: 20.26, lng: 86.67 },
    majorCargo: ['Coking Coal', 'Thermal Coal', 'Iron Ore', 'Crude Oil']
  },
  {
    id: 'vizag',
    name: 'Visakhapatnam (Vizag)',
    state: 'Andhra Pradesh',
    draft: 16.50,
    loa: 280.0,
    beamLimit: 45.0,
    capacity: 145,
    congestionStatus: 'critical',
    waitTimeHours: 48,
    vesselsAtBerth: 18,
    vesselsAtAnchorage: 11,
    coordinates: { x: 310, y: 310, lat: 17.68, lng: 83.21 },
    majorCargo: ['Coking Coal', 'Iron Ore Pellets', 'Alumina', 'POL']
  },
  {
    id: 'haldia',
    name: 'Haldia Dock Complex',
    state: 'West Bengal',
    draft: 8.50,
    loa: 230.0,
    beamLimit: 32.0,
    capacity: 65,
    congestionStatus: 'moderate',
    waitTimeHours: 32,
    vesselsAtBerth: 9,
    vesselsAtAnchorage: 6,
    coordinates: { x: 420, y: 110, lat: 22.02, lng: 88.06 },
    majorCargo: ['Thermal Coal', 'Petroleum Coke', 'Chemicals', 'Fertilizer']
  },
  {
    id: 'gangavaram',
    name: 'Gangavaram Port',
    state: 'Andhra Pradesh',
    draft: 20.00,
    loa: 300.0,
    beamLimit: 50.0,
    capacity: 64,
    congestionStatus: 'normal',
    waitTimeHours: 12,
    vesselsAtBerth: 5,
    vesselsAtAnchorage: 2,
    coordinates: { x: 300, y: 335, lat: 17.62, lng: 83.23 },
    majorCargo: ['Coking Coal', 'Iron Ore', 'Limestone', 'Bauxite']
  },
  {
    id: 'dhamra',
    name: 'Dhamra Port',
    state: 'Odisha',
    draft: 18.00,
    loa: 290.0,
    beamLimit: 48.0,
    capacity: 50,
    congestionStatus: 'normal',
    waitTimeHours: 14,
    vesselsAtBerth: 4,
    vesselsAtAnchorage: 1,
    coordinates: { x: 405, y: 145, lat: 20.80, lng: 86.95 },
    majorCargo: ['Thermal Coal', 'Coking Coal', 'Limestone']
  },
  {
    id: 'gopalpur',
    name: 'Gopalpur Port',
    state: 'Odisha',
    draft: 12.50,
    loa: 225.0,
    beamLimit: 32.0,
    capacity: 20,
    congestionStatus: 'moderate',
    waitTimeHours: 26,
    vesselsAtBerth: 3,
    vesselsAtAnchorage: 3,
    coordinates: { x: 345, y: 250, lat: 19.30, lng: 84.97 },
    majorCargo: ['Ilmenite Sand', 'Coal', 'Steel Slabs', 'Fertilizer']
  }
];

export const RISK_ALERTS: RiskAlert[] = [
  {
    id: 'alert-1',
    title: 'Vizag Port Berth Bottleneck & Congestion',
    category: 'port',
    severity: 'high',
    severityScore: 84,
    timestamp: '28 mins ago',
    location: 'Visakhapatnam (Outer Anchorage)',
    impactDescription: 'Turnaround delay of 48-56 hours reported at mechanical coal berths 1 & 2 due to conveyor maintenance and high vessel queue.',
    actionRequired: 'Divert Panamax parcel to Paradip Port to eliminate $52,000 estimated demurrage charges.',
    colorClass: 'amber'
  },
  {
    id: 'alert-2',
    title: 'Cyclone Alert: Depression 04B in Bay of Bengal',
    category: 'weather',
    severity: 'high',
    severityScore: 92,
    timestamp: '1 hour ago',
    location: 'Central Bay of Bengal (14.2°N, 88.5°E)',
    impactDescription: 'Tropical storm building into Category 1 cyclone with sustained winds 95 km/h, significant wave heights reaching 4.8 meters.',
    actionRequired: 'Recommend course deviation 45 NM south of Nicobar corridor. Delay vessel departure to Day 4 window.',
    colorClass: 'rose'
  },
  {
    id: 'alert-3',
    title: 'Baltic Dry Index (BDI) Volatility Surge',
    category: 'market',
    severity: 'medium',
    severityScore: 71,
    timestamp: '3 hours ago',
    location: 'Global FFA Derivative Market',
    impactDescription: 'Panamax 4TC index spiked +142 points following sharp short-covering by Chinese utility buyers.',
    actionRequired: 'Lock in Day 15 forward freight contract before derivative speculation leaks into physical spot market.',
    colorClass: 'amber'
  },
  {
    id: 'alert-4',
    title: 'VLSFO Bunker Fuel Price Spike (Singapore)',
    category: 'market',
    severity: 'medium',
    severityScore: 68,
    timestamp: '5 hours ago',
    location: 'Singapore Hub / Malacca Strait',
    impactDescription: 'Very Low Sulphur Fuel Oil escalated to $648/MT (+$28/MT overnight) due to Middle East tanker insurance revisions.',
    actionRequired: 'Ensure vessel speed optimization at eco-speed (11.5 kts vs 13.5 kts) to conserve 6.5 MT bunker/day.',
    colorClass: 'amber'
  },
  {
    id: 'alert-5',
    title: 'Monsoon Heavy Rain Stoppages at Haldia',
    category: 'weather',
    severity: 'low',
    severityScore: 45,
    timestamp: '7 hours ago',
    location: 'Hooghly Estuary / Haldia',
    impactDescription: 'Intermittent precipitation causing grab-discharge shutdowns for dry moisture-sensitive bulk cargoes.',
    actionRequired: 'Prepare hatch-cover sealing protocol and request weather-working days (WWD) clause in charter agreement.',
    colorClass: 'blue'
  }
];

export const CONTRACT_STRATEGIES: ContractStrategy[] = [
  {
    id: 'spot',
    name: 'Spot Market Charter',
    ratePerTon: 18.20,
    totalCostEstimate: 1365000,
    riskLevel: 'High',
    riskScore: 78,
    flexibilityScore: 92,
    aiRecommendationScore: 64,
    isRecommended: false,
    radarScores: {
      costEfficiency: 60,
      priceStability: 42,
      capacityGuarantee: 70,
      operationalFlexibility: 95,
      counterpartyRisk: 68,
    },
    pros: [
      'Maximum flexibility with zero long-term commitment',
      'Immediate tonnage availability within 48 hours',
      'Ideal for unpredicted spot spot-market arbitrage'
    ],
    cons: [
      'Highest freight rate ($18.20/Ton today)',
      '100% vulnerability to weather shocks and bunker price spikes',
      'No demurrage rate discount during peak congestion'
    ],
    idealFor: 'Urgent unplanned cargo top-ups requiring immediate vessel fixture'
  },
  {
    id: 'short-term',
    name: 'Short-Term Time Charter (3-6 Mo)',
    ratePerTon: 16.80,
    totalCostEstimate: 1260000,
    riskLevel: 'Medium',
    riskScore: 52,
    flexibilityScore: 74,
    aiRecommendationScore: 81,
    isRecommended: false,
    radarScores: {
      costEfficiency: 76,
      priceStability: 78,
      capacityGuarantee: 85,
      operationalFlexibility: 72,
      counterpartyRisk: 80,
    },
    pros: [
      'Moderately hedged against seasonal winter freight rallies',
      'Dedicated vessel availability for consecutive voyages',
      'Predictable cash flow for procurement planning'
    ],
    cons: [
      'Sub-optimal if market collapses beyond Day 30',
      'Carries idle off-hire operational risk during discharge delays'
    ],
    idealFor: 'Mid-sized steel plants with steady monthly procurement schedules'
  },
  {
    id: 'multi-voyage',
    name: 'Multi-Voyage COA (Optimized AI Strategy)',
    ratePerTon: 15.28,
    totalCostEstimate: 1146000,
    riskLevel: 'Low',
    riskScore: 24,
    flexibilityScore: 86,
    aiRecommendationScore: 96,
    isRecommended: true,
    radarScores: {
      costEfficiency: 95,
      priceStability: 92,
      capacityGuarantee: 96,
      operationalFlexibility: 84,
      counterpartyRisk: 90,
    },
    pros: [
      'Lowest unit freight rate ($15.28/Ton) locking in Day 15 market trough',
      'Guaranteed vessel positioning for 6 consecutive parcels without idle costs',
      'Saves $221,000 (16.2%) vs today spot booking',
      'Incorporates weather-routing indemnity and capped bunker adjustment factor'
    ],
    cons: [
      'Requires volume commitment of minimum 350,000 MT over 6 months'
    ],
    idealFor: 'SIH Core Project Goal: Enterprise bulk cargo procurement optimization'
  }
];

export const WEATHER_DATA: WeatherCondition = {
  waveHeight: 2.8,
  windSpeed: 38,
  seaTemperature: 27.2,
  visibility: 8.0,
  swellDirection: 'SSW (205°)',
  barometricPressure: 1004.8,
  cycloneCategory: 'Tropical Depression 04B',
  safeDepartureWindow: 'Day 4 (06:00 UTC) to Day 6 (18:00 UTC)',
  estimatedWeatherDelayHours: 4.2
};

export const HOURLY_WEATHER_SERIES = [
  { hour: '00:00', windSpeed: 28, waveHeight: 2.1, rainProb: 15 },
  { hour: '04:00', windSpeed: 32, waveHeight: 2.4, rainProb: 25 },
  { hour: '08:00', windSpeed: 38, waveHeight: 2.8, rainProb: 40 },
  { hour: '12:00', windSpeed: 44, waveHeight: 3.2, rainProb: 65 },
  { hour: '16:00', windSpeed: 42, waveHeight: 3.0, rainProb: 55 },
  { hour: '20:00', windSpeed: 35, waveHeight: 2.7, rainProb: 30 },
  { hour: '24:00', windSpeed: 30, waveHeight: 2.3, rainProb: 20 },
];

export const SEVEN_DAY_FORECAST = [
  { day: 'Wed', cond: 'Moderate Swell', temp: 27, wind: 38, wave: 2.8, safe: 'Caution' },
  { day: 'Thu', cond: 'High Winds / Gusts', temp: 26, wind: 48, wave: 3.6, safe: 'Storm Risk' },
  { day: 'Fri', cond: 'Squally Showers', temp: 27, wind: 42, wave: 3.2, safe: 'Storm Risk' },
  { day: 'Sat', cond: 'Easing Winds', temp: 28, wind: 29, wave: 2.2, safe: 'Optimal' },
  { day: 'Sun', cond: 'Calm Tropical Sea', temp: 28, wind: 20, wave: 1.6, safe: 'Optimal' },
  { day: 'Mon', cond: 'Gentle Breeze', temp: 29, wind: 18, wave: 1.4, safe: 'Optimal' },
  { day: 'Tue', cond: 'Smooth Waters', temp: 29, wind: 22, wave: 1.5, safe: 'Optimal' },
];
