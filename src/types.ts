export type NavTab = 
  | 'dashboard'
  | 'forecast'
  | 'optimizer'
  | 'vessels'
  | 'ports'
  | 'risks'
  | 'strategy'
  | 'weather'
  | 'pipelines'
  | 'reports'
  | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  organization?: string;
  loginProvider: 'google' | 'email';
}

export interface FreightDataPoint {
  day: string;
  dayNum: number;
  actualRate?: number;
  predictedRate?: number;
  lowerBound?: number;
  upperBound?: number;
  bdiIndex?: number;
  isOptimal?: boolean;
  spotRate?: number;
}

export interface MonthlyTrendPoint {
  month: string;
  historicalAvg: number;
  currentYear: number;
  predicted: number;
}

export interface PortData {
  id: string;
  name: string;
  state: string;
  draft: number; // meters
  loa: number; // meters
  beamLimit: number; // meters
  capacity: number; // MTPA
  congestionStatus: 'normal' | 'moderate' | 'critical';
  waitTimeHours: number;
  vesselsAtBerth: number;
  vesselsAtAnchorage: number;
  coordinates: { x: number; y: number; lat: number; lng: number };
  majorCargo: string[];
}

export interface VesselClass {
  id: string;
  name: string;
  dwtCapacity: string;
  dwtNum: number;
  beam: number; // m
  draft: number; // m
  loa: number; // m
  suitableCargo: string;
  compatibilityScore: number;
  fuelConsumptionTonsDay: number;
  estimatedDailyHire: number;
  speedKnots: number;
  recommended: boolean;
  imagePlaceholder: string;
  advantages: string[];
  limitations: string[];
}

export interface RiskAlert {
  id: string;
  title: string;
  category: 'weather' | 'port' | 'market' | 'geopolitical';
  severity: 'high' | 'medium' | 'low';
  severityScore: number; // 0 - 100
  timestamp: string;
  location: string;
  impactDescription: string;
  actionRequired: string;
  colorClass: 'rose' | 'amber' | 'blue' | 'emerald';
}

export interface ContractStrategy {
  id: string;
  name: string;
  ratePerTon: number;
  totalCostEstimate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  flexibilityScore: number;
  aiRecommendationScore: number;
  isRecommended: boolean;
  radarScores: {
    costEfficiency: number;
    priceStability: number;
    capacityGuarantee: number;
    operationalFlexibility: number;
    counterpartyRisk: number;
  };
  pros: string[];
  cons: string[];
  idealFor: string;
}

export interface WeatherCondition {
  waveHeight: number; // meters
  windSpeed: number; // km/h
  seaTemperature: number; // °C
  visibility: number; // km
  swellDirection: string;
  barometricPressure: number; // hPa
  cycloneCategory: string;
  safeDepartureWindow: string;
  estimatedWeatherDelayHours: number;
}

// ==========================================
// 4-PIPELINE ANALYTICS ENGINE DATA TYPES
// (Matching coal_shipping_pipeline.py)
// ==========================================

export interface ShortTermForecastPoint {
  week_ahead: number;
  date: string;
  predicted_rate: number;
  lower_bound?: number;
  upper_bound?: number;
}

export interface BookingRecommendationResult {
  lane: string;
  origin: string;
  destination: string;
  vessel_type: string;
  current_rate_usd_per_ton: number;
  short_term_forecast: ShortTermForecastPoint[];
  short_term_decision: string;
  action: 'WAIT' | 'BOOK NOW';
  best_week_ahead: number;
  lowest_rate_usd_per_ton: number;
  potential_savings_usd_per_ton: number;
  long_term_seasonal_avg_by_month: Record<number, number>;
  long_term_guide: string;
  cheapest_month: number;
  priciest_month: number;
}

export interface CharterForecastPoint {
  week_ahead: number;
  date: string;
  predicted_rate_usd_per_day: number;
}

export interface CharterForecastResult {
  vessel_type: string;
  current_rate_usd_per_day: number;
  forecast: CharterForecastPoint[];
  bunker_price_used: number;
}

export interface FeasibleVesselRank {
  vessel_type: string;
  capacity_per_vessel_tons: number;
  trips_needed: number;
  utilization_pct: number;
  predicted_freight_rate_usd_per_ton: number | null;
  total_freight_cost_usd: number | null;
  predicted_charter_rate_usd_per_day: number | null;
  total_voyage_days_per_trip: number;
  cross_check_charter_based_cost_usd: number | null;
  origin_congestion_index_avg: number;
  dest_congestion_index_avg: number;
  mining_disruption_freq_pct: number;
  feasible: boolean;
  infeasible_reason?: string;
  cost_alpha_vs_baseline?: number;
}

export interface VesselRecommendationResult {
  origin: string;
  destination: string;
  cargo_quantity_tons: number;
  distance_nm: number;
  feasible_vessel_types_ranked_by_cost: FeasibleVesselRank[];
  infeasible_vessels: FeasibleVesselRank[];
  recommendation: string;
}

export interface MiningWeatherRiskDetails {
  week: string;
  rainfall_mm_avg: number;
  wind_kmph_avg: number;
  cyclone_alert_days: number;
  mining_disruption_days: number;
  probability_idle_event: number;
  risk_tier: 'LOW' | 'MEDIUM' | 'HIGH';
  expected_idle_days_if_occurs: number;
  expected_extra_cost_usd: number;
}

export interface DestinationCongestionRiskDetails {
  congestion_index_0to1: number;
  vessels_waiting: number;
  expected_congestion_idle_days: number;
  expected_congestion_extra_cost_usd: number;
  risk_tier: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface IdleRiskAlertResult {
  origin_port: string;
  destination_port: string;
  vessel_type: string;
  mining_weather_risk: MiningWeatherRiskDetails;
  destination_congestion_risk: DestinationCongestionRiskDetails | null;
  current_charter_rate_usd_per_day: number;
  total_expected_extra_cost_usd: number;
  composite_risk_score: number; // 0 - 100
  overall_risk_tier: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CapesizeDriverImportance {
  feature: string;
  importance: number;
  description: string;
}
