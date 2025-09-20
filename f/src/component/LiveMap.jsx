import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore";

const socket = io(import.meta.env.VITE_BACKEND_URL, { transports: ["websocket"] }); 

// // Helper: recenter the map when the local user's location changes
const RecenterMap = ({ latLng }) => {
  const map = useMap();
  useEffect(() => { 
    if (latLng) map.setView(latLng, 15);
  }, [latLng, map]);
  return null;
};

const LiveMap = ({ tripId }) => {
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const { user } = useAuthStore();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    setUserId(user._id || user.id);
    setUsername(user.name);
  }, [user]);

useEffect(() => {
  if (!userId || !username || !tripId) return;

  console.log("[Frontend] Joining trip", { tripId, userId, username });
  socket.emit("joinTrip", { tripId, userId, username });

  // Listen for all locations
  const handleAllLocations = (locs) => {
    console.log("[Frontend] Received allLocations:", locs);
    setLocations(Array.isArray(locs) ? locs : []);
  };
  socket.on("allLocations", handleAllLocations);

  // Watch the user's geolocation
  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      console.log("[Frontend] Sending updateLocation:", { tripId, userId, username, latitude, longitude });
      setUserLocation([latitude, longitude]);
      socket.emit("updateLocation", { tripId, userId, username, latitude, longitude });
    },
    (err) => console.error("[Frontend] Geolocation error:", err),
    { enableHighAccuracy: true }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
    socket.off("allLocations", handleAllLocations);
  };
}, [tripId, userId, username]);


  return (
    <div className="w-[80%] h-[500px] mx-auto rounded-2xl overflow-hidden border border-gray-300">
      {userLocation ? (
        <MapContainer
          center={userLocation}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap latLng={userLocation} />
          {locations.map((loc) => (
            <Marker key={loc.userId} position={[loc.latitude, loc.longitude]}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                <div>
                  <strong>{loc.name || loc.username}</strong>
                  <br />
                  Last Updated:{" "}
                  {loc.updatedAt
                    ? new Date(loc.updatedAt).toLocaleTimeString()
                    : "Just now"}
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p className="text-center mt-20 text-gray-500 font-medium">
          Loading map...
        </p>
      )}
    </div>
  );
};

export default LiveMap;
