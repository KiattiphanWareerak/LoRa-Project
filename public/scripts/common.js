//---------------------------------------------------------------------//
//----------------------------EVENTS ZONE------------------------------//
let req;
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    //---------------------------//
    //---------DASHBOARD---------//
    //---------------------------//
    //-----Menu active events----//
    const activeMenuItem = document.querySelector('.side_menu li.active');
    if (activeMenuItem) {
      const menuId = activeMenuItem.id;

      switch (menuId) {
        case 'menu-mainDashboard':
          req = { request: 'dispMainDash', message: { 
            status: undefined, 
            data:  undefined 
          }};

          sender_and_reciver_common(req);
          break;
        case 'menu-deviceProfiles':
          req = { request: 'dispDevProfiles', message: { 
            status: undefined, 
            data:  undefined 
          }};
            
          sender_and_reciver_common(req);
          break;
        case 'menu-applications':
          req = { request: 'dispApp', message: { 
            status: undefined, 
            data:  undefined 
          }};
          
          sender_and_reciver_common(req);
          break;
        case 'menu-tutorial':
          // nothing
          break;
      }
    }
    //-----Menu click events----//
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
            req = { request: 'logout', message: { 
              status: undefined, 
              data:  undefined 
            }};
            
            sender_and_reciver_common(req);
            break;
        }
      });
    });
});
//---------------------------------------------------------------------//
//---------------------------WEB SOCKET ZONE---------------------------//
//---------------------------------------------------------------------//
function sender_and_reciver_common(req) {
  const socket = new WebSocket('ws://localhost:3001');
  //-----SENDER-----//
  socket.addEventListener('open', () => {
    console.log('WebSocket connection established with WebServer');

    socket.send(JSON.stringify(req));
  });
  //-----RECEIVER-----//
  socket.addEventListener('message', (event) => {
      const messageFromServer = JSON.parse(event.data);
      console.log('Message from server:', messageFromServer);

      if ( messageFromServer.message.status === 'success' ) {
        if ( messageFromServer.request === 'dispMainDash' ) {
          display_mainContent_dashboard(messageFromServer.message.data.gateways_list);
        } 
        else if ( messageFromServer.request === 'dispDevProfiles' ) {
          display_HeaderAndMiddleTitle_deviceProfiles();
          display_mainContent_deviceProfiles(messageFromServer.message.data);
        } 
        else if ( messageFromServer.request === 'dispApp' ) {
          display_HeaderAndMiddleTitle_applications();
          display_mainContent_applications(messageFromServer.message.data);
        } 
        else if ( messageFromServer.request === 'logout' ) {
          window.location.href = "index.html";
        }
      } else {
        alert("Error: Request-" + messageFromServer.request + "-Status-"  + messageFromServer.message.status + 
        "\n-Data-" + messageFromServer.message.data);
      }
  });
}
//---------------------------------------------------------------------//
//---------------------------DISPLAYS ZONE-----------------------------//
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
// Function to initialize the map
function initMap(gateway_data) {
  // Check if gateway_data is defined and contains at least one gateway
  if (gateway_data && gateway_data.resultList && gateway_data.resultList.length > 0) {
      // Initialize the map
      var map = L.map('map').setView([0, 0], 13); // Default center if no gateways found

      // Loop through each gateway and add markers to the map
      gateway_data.resultList.forEach(function(gateway) {
          const latitude = gateway.location.latitude;
          const longitude = gateway.location.longitude;

          // Add a marker for each gateway
          var marker = L.marker([latitude, longitude]).addTo(map);
          marker.bindPopup(`<b>${gateway.name}</b><br>${gateway.description}`).openPopup(); // Set the popup content
      });

      // If there are gateways, set the map view to the first gateway
      const firstGateway = gateway_data.resultList[0];
      if (firstGateway) {
          map.setView([firstGateway.location.latitude, firstGateway.location.longitude], 13);
      }
      
      // Add a tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
  } else {
      console.error("No gateway data available");
  }
}

function display_mainContent_dashboard(gateway_data) {
  console.log('hi from dispDash', gateway_data)
  const data_of_gateway = gateway_data;
  // Call the initMap function when the page has loaded
  window.onload = function() {
      initMap(data_of_gateway);
  };
}


function display_mainContent_deviceProfiles(gets) {
    const tableBody = document.getElementById("data-table");

    for (const device of gets.dev_profiles.resultList) {
        const row = document.createElement("tr");
      
        // เพิ่มชื่ออุปกรณ์
        const nameCell = document.createElement("td");
        const nameLink = document.createElement("a");
        // nameLink.href = "devices.html";
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
  gets.app_list.resultList.forEach(function(item, index) {
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
      appNameLink.addEventListener('click', function(event) {
          event.preventDefault();
          const socket = new WebSocket('ws://localhost:3001');

          socket.addEventListener('open', () => {
              let appID = this.getAttribute('app-id');
              let appName = item.name;

              const req = { request: 'enterAppId', message: { 
                  status: undefined, 
                  data: { app_id: appID, app_name: appName 
              }}};
              socket.send(JSON.stringify(req));

              window.location.href = 'devices.html';
          });
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
