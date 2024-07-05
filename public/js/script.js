const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Emitting location:", { latitude, longitude }); // Debug log
      socket.emit("sendLocation", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
  map
);

const markers = {};

socket.on("receiveLocation", (coords) => {
  const { id, latitude, longitude } = coords;
  console.log("Received location:", coords); // Debug log

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
  map.setView([latitude, longitude], 17);
});

socket.on("userDisconnect", (id) => {
  console.log("User disconnected:", id); // Debug log
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
