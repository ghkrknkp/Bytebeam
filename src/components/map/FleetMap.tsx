import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Vehicle, Trip, TripPoint } from '../../types/fleet';
import { Fuel, Battery, Navigation, Play, Flag, Route } from 'lucide-react';

interface FleetMapProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle) => void;
  selectedTrip?: Trip | null;
  tripPoints?: TripPoint[];
  onClearTrip?: () => void;
  height?: string;
}

// Custom Leaflet DivIcon generator for modern telematics vehicle markers
const createVehicleIcon = (vehicle: Vehicle, isSelected: boolean) => {
  const isEV = vehicle.battery_level !== null || vehicle.model.toLowerCase().includes('ev') || vehicle.model.toLowerCase().includes('electric');
  const status = vehicle.status;

  let bgGradient = 'from-emerald-500 to-teal-600';
  let glowColor = 'shadow-[0_0_12px_rgba(16,185,129,0.5)]';
  let ringColor = 'ring-emerald-400/60';

  if (status === 'idle') {
    bgGradient = 'from-amber-500 to-yellow-600';
    glowColor = 'shadow-[0_0_12px_rgba(245,158,11,0.4)]';
    ringColor = 'ring-amber-400/60';
  } else if (status === 'maintenance') {
    bgGradient = 'from-orange-600 to-rose-600';
    glowColor = 'shadow-[0_0_12px_rgba(234,88,12,0.4)]';
    ringColor = 'ring-orange-400/60';
  } else if (status === 'offline') {
    bgGradient = 'from-slate-600 to-slate-700';
    glowColor = 'shadow-none';
    ringColor = 'ring-slate-500/40';
  }

  const selectedRing = isSelected
    ? 'ring-4 ring-indigo-400 scale-125 z-50 shadow-[0_0_24px_rgba(99,102,241,0.8)]'
    : 'ring-2';

  const html = `
    <div class="relative flex items-center justify-center transition-all duration-300">
      ${status === 'active' ? '<div class="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping pointer-events-none"></div>' : ''}
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr ${bgGradient} ${glowColor} ${ringColor} ${selectedRing} flex items-center justify-center text-white border border-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 17h4V5H2v12h3m11 0h2m-9 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0m9 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M14 8h5l3 5v4h-8z"/>
        </svg>
      </div>
      ${
        isEV
          ? '<div class="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-400 text-slate-950 font-black rounded-full flex items-center justify-center text-[10px] shadow-sm border border-slate-900 leading-none">⚡</div>'
          : ''
      }
      ${isSelected ? '<div class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-400 rounded-full animate-ping"></div>' : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-telematics-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

// Route Start Icon (Green)
const createStartIcon = () =>
  L.divIcon({
    html: `
      <div class="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      </div>
    `,
    className: 'start-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

// Route End Icon (Checkered/Indigo)
const createEndIcon = () =>
  L.divIcon({
    html: `
      <div class="w-7 h-7 rounded-full bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
          <line x1="4" y1="22" x2="4" y2="15"/>
        </svg>
      </div>
    `,
    className: 'end-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

// Controller component to zoom/pan programmatically
const MapController: React.FC<{
  selectedVehicle: Vehicle | null;
  tripPoints?: TripPoint[];
}> = ({ selectedVehicle, tripPoints }) => {
  const map = useMap();

  useEffect(() => {
    if (tripPoints && tripPoints.length > 1) {
      const bounds = L.latLngBounds(tripPoints.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (selectedVehicle) {
      map.flyTo([selectedVehicle.latitude, selectedVehicle.longitude], 14, {
        duration: 1.2,
      });
    }
  }, [selectedVehicle, tripPoints, map]);

  return null;
};

export const FleetMap: React.FC<FleetMapProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  selectedTrip,
  tripPoints = [],
  onClearTrip,
  height = '580px',
}) => {
  // Center coordinates (Bengaluru Hub)
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  // Prepare route coordinates for Polyline
  const routePositions = useMemo(() => {
    if (!tripPoints || tripPoints.length === 0) return [];
    return tripPoints
      .sort((a, b) => a.sequence_number - b.sequence_number)
      .map(p => [p.latitude, p.longitude] as [number, number]);
  }, [tripPoints]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50" style={{ height }}>
      {/* Map Floating Control Header */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-3.5 py-2 shadow-sm flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Navigation className="w-3.5 h-3.5 text-indigo-600" />
            <span>Vehicles: {vehicles.length}</span>
          </div>

          <div className="h-3.5 w-px bg-slate-200" />

          {/* Legend dots */}
          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Idle
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-600" /> Maint
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" /> Offline
            </span>
          </div>
        </div>

        {/* Selected Trip Banner */}
        {selectedTrip && (
          <div className="bg-indigo-50/95 backdrop-blur-md border border-indigo-200 rounded-xl px-3.5 py-1.5 shadow-sm flex items-center gap-3 text-xs text-indigo-950 font-medium">
            <div className="flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-indigo-600" />
              <span>Route: {selectedTrip.start_location} → {selectedTrip.end_location} ({selectedTrip.distance_km} km)</span>
            </div>
            {onClearTrip && (
              <button
                onClick={onClearTrip}
                className="text-[11px] bg-indigo-600 hover:bg-indigo-700 px-2.5 py-0.5 rounded-lg text-white font-medium cursor-pointer shadow-sm transition"
              >
                Clear Route
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selected Vehicle Floating Card (Bottom-Right) */}
      {selectedVehicle && (
        <div className="absolute bottom-4 right-4 z-[400] max-w-sm w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl text-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-xs font-mono text-indigo-600 font-bold tracking-wide">
                {selectedVehicle.registration_number}
              </div>
              <div className="font-bold text-slate-900 text-sm">{selectedVehicle.model}</div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                selectedVehicle.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : selectedVehicle.status === 'idle'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : selectedVehicle.status === 'maintenance'
                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {selectedVehicle.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs py-2 my-2 border-y border-slate-100">
            <div>
              <span className="text-slate-400 text-[11px] block">Driver</span>
              <span className="font-medium text-slate-800">{selectedVehicle.driver_name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Ignition</span>
              <span className={`font-medium ${selectedVehicle.ignition_on ? 'text-emerald-600' : 'text-slate-500'}`}>
                {selectedVehicle.ignition_on ? 'ON (Engine Running)' : 'OFF'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono text-slate-800 font-semibold">{selectedVehicle.fuel_level}% Fuel</span>
            </div>
            {selectedVehicle.battery_level !== null && (
              <div className="flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono text-slate-800 font-semibold">{selectedVehicle.battery_level}% Battery</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Last Ping: {new Date(selectedVehicle.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="font-mono text-[10px] text-slate-400">
              {selectedVehicle.latitude.toFixed(4)}, {selectedVehicle.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedVehicle={selectedVehicle} tripPoints={tripPoints} />

        {/* Vehicle Markers */}
        {vehicles.map(vehicle => {
          const isSelected = selectedVehicle?.id === vehicle.id;
          return (
            <Marker
              key={vehicle.id}
              position={[vehicle.latitude, vehicle.longitude]}
              icon={createVehicleIcon(vehicle, isSelected)}
              eventHandlers={{
                click: () => onSelectVehicle(vehicle),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="font-bold text-slate-900 text-sm">{vehicle.registration_number}</div>
                  <div className="text-xs text-slate-500 mb-2">{vehicle.model}</div>
                  <div className="space-y-1 text-xs text-slate-700 border-t border-slate-100 pt-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Driver:</span>
                      <span className="font-medium text-slate-800">{vehicle.driver_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="capitalize font-semibold text-emerald-600">{vehicle.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fuel:</span>
                      <span className="font-mono font-semibold text-slate-800">{vehicle.fuel_level}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectVehicle(vehicle)}
                    className="w-full mt-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 px-2 rounded-lg cursor-pointer transition shadow-sm"
                  >
                    Select Vehicle Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* GPS Trip Route Polyline */}
        {routePositions.length > 1 && (
          <>
            {/* Outer glow stroke for route */}
            <Polyline
              positions={routePositions}
              color="#4338ca"
              weight={7}
              opacity={0.3}
            />
            {/* Inner high-contrast route path */}
            <Polyline
              positions={routePositions}
              color="#4f46e5"
              weight={4}
              opacity={0.9}
              dashArray="6, 8"
            />

            {/* Start Waypoint Marker */}
            <Marker position={routePositions[0]} icon={createStartIcon()}>
              <Popup>
                <div className="p-1 text-xs text-slate-800">
                  <div className="font-bold text-emerald-600 flex items-center gap-1">
                    <Play className="w-3 h-3" /> Trip Origin
                  </div>
                  <div className="font-medium">{selectedTrip?.start_location || 'Origin Point'}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Departed: {selectedTrip ? new Date(selectedTrip.started_at).toLocaleTimeString() : ''}
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* End Waypoint Marker */}
            <Marker position={routePositions[routePositions.length - 1]} icon={createEndIcon()}>
              <Popup>
                <div className="p-1 text-xs text-slate-800">
                  <div className="font-bold text-indigo-600 flex items-center gap-1">
                    <Flag className="w-3 h-3" /> Trip Destination
                  </div>
                  <div className="font-medium">{selectedTrip?.end_location || 'Destination'}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Arrived: {selectedTrip ? new Date(selectedTrip.ended_at).toLocaleTimeString() : ''}
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
};
