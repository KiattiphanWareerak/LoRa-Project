//---------------------------------------------------------------------//
//---------------------------WEB SOCKET ZONE---------------------------//
//---------------------------------------------------------------------//
const commonSocket = new WebSocket('ws://localhost:3001');

commonSocket.addEventListener('message', (event) => {
  const messageFromServer = JSON.parse(event.data);
  console.log('Message from server:', messageFromServer);

  if (messageFromServer.message.status === 'success') {
    if (messageFromServer.request === 'dispMainDash') {
      display_mainContent_dashboard(messageFromServer.message.data);
    }
    else if (messageFromServer.request === 'dispDevProfiles') {
      display_HeaderAndMiddleTitle_deviceProfiles();
      display_mainContent_deviceProfiles(messageFromServer.message.data);
    }
    else if (messageFromServer.request === 'dispApp') {
      display_HeaderAndMiddleTitle_applications();
      display_mainContent_applications(messageFromServer.message.data);
    }
    else if (messageFromServer.request === 'logout') {
      window.location.href = "index.html";
    }
  } else {
    alert("Error: Request-" + messageFromServer.request + "-Status-" + messageFromServer.message.status +
      "-Data-" + messageFromServer.message.data);
  }
});

commonSocket.addEventListener('error', (event) => {
  console.log('WebSocket error:', event);
});

commonSocket.addEventListener('close', (event) => {
  console.log('WebSocket closed:', event);
});

function sendRequset(data) {
  commonSocket.addEventListener('open', () => {
    console.log('WebSocket connection established with WebServer from common.');

    if (commonSocket.readyState === WebSocket.OPEN) {
      commonSocket.send(JSON.stringify(data));
    } else {
      console.log('WebSocket not ready, message not sent!');
    }
  });
}
//---------------------------------------------------------------------//
//----------------------------EVENT ZONE-------------------------------//
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', async () => {
  //-----Menu active event-----//
  const activeMenuItem = document.querySelector('.side_menu li.active');
  if (activeMenuItem) {
    let menuId = activeMenuItem.id;
    let req;

    switch (menuId) {
      case 'menu-mainDashboard':
        req = {
          request: 'dispMainDash', message: {
            status: undefined,
            data: undefined
          }
        };
        sendRequset(req);
        break;
      case 'menu-deviceProfiles':
        req = {
          request: 'dispDevProfiles', message: {
            status: undefined,
            data: undefined
          }
        };
        sendRequset(req);
        break;
      case 'menu-applications':
        req = {
          request: 'dispApp', message: {
            status: undefined,
            data: undefined
          }
        };
        sendRequset(req);
        break;
      case 'menu-tutorial':
        // nothing
        break;
    }
  }
  //-----Menu click event----//
  document.querySelectorAll('.side_menu li').forEach(menuItem => {
    menuItem.addEventListener('click', () => {
      const menuId = menuItem.id;

      switch (menuId) {
        case 'menu-mainDashboard':
          window.location.href = "dashboard.html";
          break;
        case 'menu-deviceProfiles':
          window.location.href = "deviceProfiles.html";
          break;
        case 'menu-applications':
          window.location.href = "applications.html";
          break;
        case 'menu-tutorial':
          window.location.href = "tutorialPage.html";
          break;
        case 'menu-logout':
          const req = {
            request: 'logout', message: {
              status: undefined,
              data: undefined
            }
          };
          commonSocket.send(JSON.stringify(req));
          break;
      }
    });
  });
});
//---------------------------------------------------------------------//
//---------------------------DISPLAY ZONE------------------------------//
//---------------------------------------------------------------------//
function display_HeaderAndMiddleTitle_applications() {
  let newH1Element = document.createElement('h1');
  let newH4Element = document.createElement('h4');
  newH1Element.textContent = 'Applications';
  newH4Element.innerHTML = `<a>Applications</a> `;
  let headerTitleDiv = document.querySelector('.header--title');
  let locatedDiv = document.querySelector('.located');
  headerTitleDiv.innerHTML = '';
  locatedDiv.innerHTML = '';
  headerTitleDiv.appendChild(newH1Element);
  locatedDiv.appendChild(newH4Element);
}
function display_HeaderAndMiddleTitle_deviceProfiles() {
  let newH1Element = document.createElement('h1');
  let newH4Element = document.createElement('h4');
  newH1Element.textContent = 'Device profiles';
  newH4Element.innerHTML = `<a>Deivce profiles</a> `;
  let headerTitleDiv = document.querySelector('.header--title');
  let locatedDiv = document.querySelector('.located');
  headerTitleDiv.innerHTML = '';
  locatedDiv.innerHTML = '';
  headerTitleDiv.appendChild(newH1Element);
  locatedDiv.appendChild(newH4Element);
}
function gateway_state_analyse(state) {
  var analysed = ''
  var color = ''
  if (state === 0) {
    analysed = 'Never seen'
    color = 'gray'
  } else if (state === 1) {
    analysed = 'Online'
    color = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
  } else if (state === 2) {
    analysed = 'Offline'
    color = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
  } else {
    analysed = 'Error, unknow state'
    color = 'black'
  }
  return { analysed: analysed, color: color };
}
function set_pieChart_data(greenData, redData, grayData) {
  // green = active, red = inactive, gray = never seen
  if (greenData == 0 & redData == 0 & grayData == 0) {
    var data = {
      labels: ['No Data to Display'],
      datasets: [{
        data: [1],
        backgroundColor: ['#BDBABB']
      }]
    };
  } else {
    // set data
    var data = {
      labels: ['Online', 'Offline', 'Never Seen'],
      datasets: [{
        data: [greenData, redData, grayData],
        backgroundColor: ['#4B8CFF', '#EE5F55', '#E0DFDF']
      }]
    };
  }
  return data
}
function display_mainContent_dashboard(gets) {

  // KKU latitude and longitude = [16.466, 102.817] zoom_level = 14
  var map = L.map('map').setView([16.466, 102.817], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  let device_active_count, device_inactive_count, device_neverseen_count;
  if (gets.devs_summary) {
    device_active_count = gets.devs_summary.activeCount;
    device_inactive_count = gets.devs_summary.inactiveCount;
    device_neverseen_count = gets.devs_summary.neverSeenCount;
  } else {
    device_active_count = 0;
    device_inactive_count = 0;
    device_neverseen_count = 0;
  }

  const gateways_data = gets.gateways_list.resultList;
  const total_gateways = gets.gateways_list.totalCount;
  const online_gateway = gets.gateways_summary.onlineCount;
  const Offline_gateway = gets.gateways_summary.offlineCount;
  const neverseen_gateway = gets.gateways_summary.neverSeenCount;


  // var test_data = set_pieChart_data(4, 1, 1);
  var deviceActive_data = set_pieChart_data(device_active_count, device_inactive_count, device_neverseen_count);
  var gatewayActive_data = set_pieChart_data(online_gateway, Offline_gateway, neverseen_gateway);

  // Options for the pie chart
  var options = {
    responsive: false,
    maintainAspectRatio: false
  };

  // Get the canvas element
  var device_ctx = document.getElementById('device-pieChart').getContext('2d');
  var gateway_ctx = document.getElementById('gateway-pieChart').getContext('2d');

  // Create the pie chart
  var device_pieChart = new Chart(device_ctx, {
    type: 'pie',
    data: deviceActive_data,
    options: options
  });

  // Create the pie chart
  var gateway_pieChart = new Chart(gateway_ctx, {
    type: 'pie',
    data: gatewayActive_data,
    options: options
  });

  for (var marking = 0; marking < total_gateways; marking++) {
    var gateway_name = gateways_data[marking].name;
    var gateway_description = gateways_data[marking].description;
    var gateway_latitude = gateways_data[marking].location.latitude;
    var gateway_longitude = gateways_data[marking].location.longitude;
    var unanalyse_gateway_state = gateways_data[marking].state;
    var analysed_gateway_state = gateway_state_analyse(unanalyse_gateway_state);
    var marker_color = analysed_gateway_state.color;
    var gateway_state = analysed_gateway_state.analysed;

    if (gateway_state == 'Never seen') {
      continue
    } else {
      var colorIcon = new L.Icon({
        iconUrl: marker_color,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      var marker = L.marker([gateway_latitude, gateway_longitude], { icon: colorIcon }).addTo(map);
      marker.bindPopup(`<b>Name: </b>${gateway_name}<br><b>Description: </b>${gateway_description}<br><b>State: </b>${gateway_state}`);
    }
  }
}
function display_mainContent_deviceProfiles(gets) {
  const tableBody = document.getElementById("data-table");

  for (const device of gets.dev_profiles.resultList) {
    const row = document.createElement("tr");

    // เพิ่มชื่อ device profile
    const nameCell = document.createElement("td");
    const nameLink = document.createElement("a");
    nameLink.textContent = device.name;
    nameCell.appendChild(nameLink);
    row.appendChild(nameCell);

    // เพิ่มข้อมูลอื่นๆ
    for (const key of ["region", "macVersion", "regParamsRevision"]) {
      const cell = document.createElement("td");
      switch (key) {
        case "region":
          cell.textContent = getRegionName(device[key]);
          break;
        case "macVersion":
          cell.textContent = getMacVersionName(device[key]);
          break;
        case "regParamsRevision":
          cell.textContent = getRevisionName(device[key]);
          break;
      }
      row.appendChild(cell);
    }

    // เพิ่มสถานะ OTAA, Class B, Class C
    for (const key of ["supportsOtaa", "supportsClassB", "supportsClassC"]) {
      const cell = document.createElement("td");
      const icon = document.createElement("i");
      icon.className = device[key]
        ? "fa-solid fa-check check_icon"
        : "fa-solid fa-xmark xmark_icon";
      cell.appendChild(icon);
      row.appendChild(cell);
    }

    // เพิ่มแถวตารางลงใน tbody
    tableBody.appendChild(row);
  }
}
function display_mainContent_applications(gets) {
  let tbody = document.getElementById('data-table');

  let count = 0;
  gets.app_list.resultList.forEach(function (item, index) {
    var row = document.createElement('tr');

    // Checkbox column
    var checkboxCell = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'app' + (index + 1);
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    // Number column
    var numberCell = document.createElement('td');
    count += 1;
    numberCell.textContent = count;
    row.appendChild(numberCell);

    // Application name column with a link
    var appNameCell = document.createElement('td');
    var appNameLink = document.createElement('a');
    appNameLink.href = 'javascript:void(0)';
    // Add click event listener to appNameLink
    appNameLink.setAttribute('app-id', item.id);
    appNameLink.addEventListener('click', function (event) {
      event.preventDefault();

      const appID = this.getAttribute('app-id');
      const appName = item.name;

      const req = {
        request: 'enterAppId', message: {
          status: undefined,
          data: {
            app_id: appID, app_name: appName
          }
        }
      };
      commonSocket.send(JSON.stringify(req));

      window.location.href = 'devices.html';
    });
    appNameLink.textContent = item.name;
    appNameCell.appendChild(appNameLink);
    row.appendChild(appNameCell);

    // Application ID column
    var appIdCell = document.createElement('td');
    appIdCell.textContent = item.id;
    row.appendChild(appIdCell);

    // Description column
    var registeredDeviceCell = document.createElement('td');
    registeredDeviceCell.textContent = item.description;
    row.appendChild(registeredDeviceCell);

    // Append the row to the tbody
    tbody.appendChild(row);
  });
}
//---------------------------------------------------------------------//
//----------------------------COMMON ZONE------------------------------//
//---------------------------------------------------------------------//
function getRegionName(region) {
  switch (region) {
    case 0:
      return "EU868";
    case 2:
      return "US915";
    case 3:
      return "CN779";
    case 4:
      return "EU433";
    case 5:
      return "AU915";
    case 6:
      return "CN470";
    case 7:
      return "AS923";
    case 12:
      return "AS923-2";
    case 13:
      return "AS923-3";
    case 14:
      return "AS923-4";
    case 8:
      return "KR920";
    case 9:
      return "IN865";
    case 10:
      return "RU864";
    case 11:
      return "ISM2400";
    default:
      return "Unknown";
  }
}
function getMacVersionName(macVersion) {
  switch (macVersion) {
    case 0:
      return "LORAWAN 1.0.0";
    case 1:
      return "LORAWAN 1.0.1";
    case 2:
      return "LORAWAN 1.0.2";
    case 3:
      return "LORAWAN 1.0.3";
    case 4:
      return "LORAWAN 1.0.4";
    case 5:
      return "LORAWAN 1.1.0";
    default:
      return "Unknown";
  }
}
function getRevisionName(revision) {
  switch (revision) {
    case 0:
      return "A";
    case 1:
      return "B";
    case 2:
      return "RP002_1_0_0";
    case 3:
      return "RP002_1_0_1";
    case 4:
      return "RP002_1_0_2";
    case 5:
      return "RP002_1_0_3";
    default:
      return "Unknown";
  }
}
//---------------------------------------------------------------------//
