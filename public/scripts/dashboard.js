//---------------------------------------------------------------------// 
//---------------------------DISPLAYS ZONE-----------------------------// 
//---------------------------------------------------------------------//
// Function to initialize the map
function initMap() {
  // Initialize the map
  var map = L.map('map').setView([16.472375869750977, 102.82603454589844], 13); // Set the initial view to the location's latitude and longitude

  // Add a tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Add a marker to the map
  var marker = L.marker([16.472375869750977, 102.82603454589844]).addTo(map);
  marker.bindPopup("<b>i-station</b><br>Kerlink i-station gateway").openPopup(); // Set the popup content
}

// Call the initMap function when the page has loaded
window.onload = initMap;
//---------------------------------------------------------------------// 
