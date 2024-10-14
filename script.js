var latitude = -8.7993579;
var longitude = 115.1681177;

var forecast_days = 1;

var api_url = `https://flood-api.open-meteo.com/v1/flood?latitude=${latitude}&longitude=${longitude}&daily=river_discharge&forecast_days=${forecast_days}`;

fetch(api_url)
  .then(response => response.json())
  .then(floodData => {
    const dailyTime = floodData.daily.time;
    const dailyDischarge = floodData.daily.river_discharge;
    const latitude = floodData.latitude;
    const longitude = floodData.longitude;

    document.getElementById('riverDischarge').innerHTML = `<b>Latest Discharge:</b> ${dailyDischarge[0]} m³/s`;
    document.getElementById('coordinate').innerHTML = `<b>Latitude:</b> ${latitude}, <b>Longitude:</b> ${longitude}`;

    setBackgroundColor(dailyDischarge[0]);
    populateForecastTable(dailyTime, dailyDischarge);
  })
  .catch(error => {
    console.error('Error fetching flood data:', error);
  });

function updateData() {
  var newLatitude = document.getElementById('latitudeInput').value;
  var newLongitude = document.getElementById('longitudeInput').value;
  var newForecastDays = document.getElementById('forecastDaysInput').value;

  latitude = parseFloat(newLatitude);
  longitude = parseFloat(newLongitude);
  forecast_days = parseInt(newForecastDays);

  api_url = `https://flood-api.open-meteo.com/v1/flood?latitude=${latitude}&longitude=${longitude}&daily=river_discharge&forecast_days=${forecast_days}`;

  fetch(api_url)
    .then(response => response.json())
    .then(floodData => {
      const dailyTime = floodData.daily.time;
      const dailyDischarge = floodData.daily.river_discharge;
      const latitude = floodData.latitude;
      const longitude = floodData.longitude;

      document.getElementById('riverDischarge').innerHTML = `<b>Latest Discharge:</b> ${dailyDischarge[0]} m³/s`;
      document.getElementById('coordinate').innerHTML = `<b>Latitude:</b> ${latitude}, <b>Longitude:</b> ${longitude}`;
      setBackgroundColor(dailyDischarge[0]);
      populateForecastTable(dailyTime, dailyDischarge);
    })
    .catch(error => {
      console.error('Error fetching flood data:', error);
    });
  
  fetchLocationData();
}

function fetchLocationData() {
  var osm = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  fetch(osm)
    .then(response => response.json())
    .then(locationData => {
      const displayName = locationData.display_name || 'Location not found';
      document.getElementById('location').innerHTML = displayName;
    })
    .catch(error => {
      console.error('Error fetching location data:', error);
    });
}

function setBackgroundColor(dischargeValue) {
  let backgroundColor = dischargeValue > 200 ? '#FF6347' : '#90EE90'; // Red if high discharge, green otherwise
  document.getElementById('backgroundDiv').style.backgroundColor = backgroundColor;
}

function populateForecastTable(dailyTime, dailyDischarge) {
  const tableBody = document.getElementById('forecastTableBody');
  tableBody.innerHTML = ''; // Clear table
  dailyTime.forEach((time, index) => {
    const row = tableBody.insertRow();
    const timeCell = row.insertCell(0);
    const dischargeCell = row.insertCell(1);

    timeCell.textContent = time;
    dischargeCell.textContent = `${dailyDischarge[index]} m³/s`;
  });
}

// Initial fetch for location data
fetchLocationData();
