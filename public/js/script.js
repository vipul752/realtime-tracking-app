const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("sendLocation", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
  map
);

const makers = {};

socket.on("receiveLocation", (coords) => {
  const { id, latitude, longitude } = coords;
  map.setView([latitude, longitude], 17);

  if (makers[id]) {
    makers[id].setLatLng([latitude, longitude]);
  } else {
    makers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("userDisconnect", (id) => {
  map.removeLayer(makers[id]);
  delete makers[id];
});
