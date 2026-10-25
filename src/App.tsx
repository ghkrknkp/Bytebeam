import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { StatCards } from './components/dashboard/StatCards';
import { FleetMap } from './components/map/FleetMap';
import { FleetCharts } from './components/dashboard/FleetCharts';
import { VehicleTable } from './components/vehicles/VehicleTable';
import { VehicleDetailModal } from './components/vehicles/VehicleDetailModal';
import { TripsTable } from './components/trips/TripsTable';
import { fleetService } from './services/fleetService';
import type { Vehicle, Trip, TripPoint, FleetStats, FleetAlert } from './types/fleet';
import { Truck, MapPin } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<FleetStats | null>(null);
  const [alerts, setAlerts] = useState<FleetAlert[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripPoints, setTripPoints] = useState<TripPoint[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  // Load fleet data
  const loadFleetData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [vehiclesRes, tripsRes] = await Promise.all([
        fleetService.getVehicles(),
        fleetService.getTrips(),
      ]);

      const vList = vehiclesRes.data;
      const tList = tripsRes.data;

      setVehicles(vList);
      setTrips(tList);

      const calculatedStats = fleetService.calculateStats(vList, tList);
      setStats(calculatedStats);

      const generatedAlerts = fleetService.getAlerts(vList);
      setAlerts(generatedAlerts);

      // Default select first vehicle if none selected
      if (!selectedVehicle && vList.length > 0) {
        setSelectedVehicle(vList[0]);
      }
    } catch (err) {
      console.error('Failed to load fleet data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedVehicle]);

  useEffect(() => {
    if (user) {
      loadFleetData();
    }
  }, [user, loadFleetData]);

  // When a trip route is selected, load its GPS points
  const handleSelectTripRoute = async (trip: Trip) => {
    setSelectedTrip(trip);
    // Find associated vehicle
    const vehicle = vehicles.find(v => v.id === trip.vehicle_id);
    if (vehicle) setSelectedVehicle(vehicle);

    const pointsRes = await fleetService.getTripPoints(trip.id);
    setTripPoints(pointsRes.data);
    setCurrentTab('map');
  };

  const handleClearTripRoute = () => {
    setSelectedTrip(null);
    setTripPoints([]);
  };

  const handleOpenVehicleDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleTrackOnMap = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentTab('map');
  };

  const handleVehicleUpdated = (updatedVehicle: Vehicle) => {
    setVehicles(prev => prev.map(v => (v.id === updatedVehicle.id ? updatedVehicle : v)));
    setSelectedVehicle(updatedVehicle);
    if (stats) {
      const updatedList = vehicles.map(v => (v.id === updatedVehicle.id ? updatedVehicle : v));
      setStats(fleetService.calculateStats(updatedList, trips));
    }
  };

  // Auth Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20 mb-4 animate-bounce">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <div className="text-base font-extrabold tracking-tight text-slate-900">Bytebeam Fleet Platform</div>
        <div className="text-xs text-slate-500 mt-1">Initializing telematics session...</div>
      </div>
    );
  }

  // Not logged in -> Show Login Page
  if (!user) {
    return <LoginPage />;
  }

  return (
    <DashboardLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onRefresh={loadFleetData}
      isRefreshing={isRefreshing}
      alertCount={alerts.length}
    >
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Fleet KPI Banner */}
        {stats && (
          <StatCards
            stats={stats}
            onFilterClick={filterType => {
              if (filterType === 'trips') setCurrentTab('trips');
              else if (filterType === 'active' || filterType === 'attention' || filterType === 'total') {
                setCurrentTab('vehicles');
              }
            }}
          />
        )}

        {/* Tab 1: Overview */}
        {currentTab === 'overview' && (
          <div className="space-y-8">
            {/* Split view: Live Map Preview + Quick Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Live Fleet Positions
                  </h3>
                  <button
                    onClick={() => setCurrentTab('map')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    Expand Full Map →
                  </button>
                </div>
                <FleetMap
                  vehicles={vehicles}
                  selectedVehicle={selectedVehicle}
                  onSelectVehicle={v => {
                    setSelectedVehicle(v);
                    setIsVehicleModalOpen(true);
                  }}
                  selectedTrip={selectedTrip}
                  tripPoints={tripPoints}
                  onClearTrip={handleClearTripRoute}
                  height="460px"
                />
              </div>

              {/* Side: Quick Vehicle Registry */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-slate-900">Active Dispatch Units</h3>
                  <span className="text-xs text-slate-500 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md">{vehicles.length} Total</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] pr-1">
                  {vehicles.map(v => (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedVehicle(v);
                        setIsVehicleModalOpen(true);
                      }}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300 flex items-center justify-between cursor-pointer transition group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-mono text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                          {v.registration_number}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{v.model} • {v.driver_name}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            v.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : v.status === 'idle'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : v.status === 'maintenance'
                              ? 'bg-orange-50 text-orange-700 border border-orange-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {v.status}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{v.fuel_level}% fuel</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentTab('vehicles')}
                  className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer text-center"
                >
                  View All {vehicles.length} Vehicles
                </button>
              </div>
            </div>

            {/* Operational Analytics & Charts */}
            <FleetCharts
              vehicles={vehicles}
              trips={trips}
              alerts={alerts}
              onSelectVehicleById={id => {
                const target = vehicles.find(v => v.id === id);
                if (target) {
                  setSelectedVehicle(target);
                  setIsVehicleModalOpen(true);
                }
              }}
            />
          </div>
        )}

        {/* Tab 2: Vehicle Registry */}
        {currentTab === 'vehicles' && (
          <VehicleTable
            vehicles={vehicles}
            onSelectVehicle={handleOpenVehicleDetails}
            onTrackOnMap={handleTrackOnMap}
          />
        )}

        {/* Tab 3: Interactive GPS Map */}
        {currentTab === 'map' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Full Interactive Fleet Telematics Map
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time GPS coordinate mapping, live telemetry markers, and stored route polyline tracing.
                </p>
              </div>

              {selectedTrip && (
                <button
                  onClick={handleClearTripRoute}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition cursor-pointer self-start"
                >
                  Reset Active Route
                </button>
              )}
            </div>

            <FleetMap
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={v => setSelectedVehicle(v)}
              selectedTrip={selectedTrip}
              tripPoints={tripPoints}
              onClearTrip={handleClearTripRoute}
              height="650px"
            />
          </div>
        )}

        {/* Tab 4: Trips & Routes */}
        {currentTab === 'trips' && (
          <TripsTable
            trips={trips}
            vehicles={vehicles}
            onSelectTripRoute={handleSelectTripRoute}
          />
        )}

        {/* Tab 5: Analytics & Alerts */}
        {currentTab === 'analytics' && (
          <FleetCharts
            vehicles={vehicles}
            trips={trips}
            alerts={alerts}
            onSelectVehicleById={id => {
              const target = vehicles.find(v => v.id === id);
              if (target) {
                setSelectedVehicle(target);
                setIsVehicleModalOpen(true);
              }
            }}
          />
        )}
      </div>

      {/* Vehicle Telematics Detail Modal */}
      <VehicleDetailModal
        vehicle={isVehicleModalOpen ? selectedVehicle : null}
        onClose={() => setIsVehicleModalOpen(false)}
        onLocateOnMap={handleTrackOnMap}
        onVehicleUpdated={handleVehicleUpdated}
        onSelectTripRoute={handleSelectTripRoute}
      />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
