//---------------------------------------------------------------------// 
//----------------------SCRIPT FOR CHIRPSTACK API----------------------//
//--------------------------REQUEST TO SERVER--------------------------//
//---------------------------------------------------------------------// 
let resp_listApplicationsReq;
//---------------------------------------------------------------------// 
//----------------------------ACTION EVENTS----------------------------//

//---CREATE DEVICE REQUEST---//
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("add-device-button");

    const devName = document.getElementById("device-name");
    const devEUI = document.getElementById("device-eui");

    button.addEventListener("click", function () {
      const dN = devName.value;
      const dE = devEUI.value;

      const isValidName = /^[a-zA-Z0-9\-_]+$/.test(dN);
      const isValidEUI = /^[0-9a-fA-F]{16}$/.test(dE);

      if (isValidName && isValidEUI) {
        send_createDeviceRequest_to_server(dN, dE);
        devName.value = "";
        devEUI.value = "";
      } else if (isValidName && !isValidEUI) {
        alert("Device EUI should be a 64-bit HEX string with exactly 16 characters.");
        devEUI.value = "";
      } else if (!isValidName && isValidEUI) {
        alert("Device Name should be English letters (lowercase/uppercase), numbers, '-', and '_'.");
        devName.value = "";
      } else {
        alert("Device Name should be English letters (lowercase/uppercase), numbers, '-', and '_.'\n" +
        "Device EUI should be a 64-bit HEX string with exactly 16 characters.");
        devName.value = "";
        devEUI.value = "";
      }
    });
});
//---------------------------------------------------------------------// 
//---CREATE DEVICE KEY REQUEST (OTAA KEY)---//
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("set-app-key-button");

    const devKey = document.getElementById("app-key");

    button.addEventListener("click", function () {
      const aK = devKey.value;

      const isValidAppKey = /^[0-9a-fA-F]{32}$/.test(aK);

      if (isValidAppKey) {
        send_CreateDeviceKeyRequest_to_server(aK);
      } else {
        alert("Please enter the AppKey correctly. The AppKey should be a 128-bit HEX string with exactly 32 characters.");
      }
    });
});
//---------------------------------------------------------------------//
//---LIST DEVICES REQUEST---//
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("list-device-button");

  button.addEventListener("click", function () {
    send_listDevicesRequest_to_server();
  });
});
//---------------------------------------------------------------------//
//---LIST APPLICATIONS REQUEST---//
document.addEventListener("DOMContentLoaded", function () {
  let menuApplications = document.getElementById("menu-applications");

  menuApplications.addEventListener('click', function (event) {
    // Prevent the default action (in this case, navigating to applications.html)
    event.preventDefault();

    // Add your custom logic here
    send_listApplicationsRequest_to_server();
  });
});
//---------------------------------------------------------------------//



//---------------------------------------------------------------------// 
//-----------------------------WEB SOCKET------------------------------//

const host = 'localhost';
const port = '8080';
//---------------------------------------------------------------------//
function send_createDeviceRequest_to_server(devName, devEUI) {
    const socket = new WebSocket('ws://' + host + ':'+ port + '/createDeviceRequest');
  
    socket.addEventListener('open', (event) => {
      const data = {
        devName: devName,
        devEUI: devEUI,
      };
      socket.send(JSON.stringify(data));
    });
  
    socket.addEventListener('message', (event) => {
      const response = JSON.parse(event.data);
      console.log('Received message for server:', response);

      if (response.status === 'success') {
        alert("Success!!");
        window.location.href = 'createAppKey.html';
      } else {
        alert('An error occurred: ' + response.message);
      }
    });
  
    socket.addEventListener('close', (event) => {
      console.log('Close connection to server.');
    });
  
    socket.addEventListener('error', (event) => {
      console.error('Error connecting to the server.', event.error);
    });
}
//---------------------------------------------------------------------//
function send_createDeviceKeyRequest_to_server(devKey) {
    const socket = new WebSocket('ws://' + host + ':'+ port + '/createDeviceKeyRequest');
    
    socket.addEventListener('open', (event) => {
      const data = {
        devKey: devKey,
      };
      socket.send(JSON.stringify(data));
    });
  
    socket.addEventListener('message', (event) => {
      const response = JSON.parse(event.data);
      console.log('Received message for server:', response);
  
      if (response.status === 'success') {
        window.location.href = 'dashboard.html';
      } else {
        alert('An error occurred: ' + response.message);
      }
    });
  
    socket.addEventListener('close', (event) => {
      console.log('Close connection to server.');
    });
  
    socket.addEventListener('error', (event) => {
      console.error('Error connecting to the server.', event.error);
    });
  }
//---------------------------------------------------------------------//
function send_listDevicesRequest_to_server() {
  const socket = new WebSocket('ws://' + host + ':'+ port + '/listDeviceRequest');
  
  socket.addEventListener('open', (event) => {
    const data = {
      appID: "c735b5b4-8130-454b-abf5-26021f5327f0",
    };
    socket.send(JSON.stringify(data));
  });

  socket.addEventListener('message', (event) => {
    const response = JSON.parse(event.data);
    console.log('Received message for server:', response);

    if (response.status === 'success') {
      let resp_listDevicesReq = response.resp_listDevicesReq;

      displayListDevices(resp_listDevicesReq);
    } else {
      alert('An error occurred: ' + response.message);
    }
  });

  socket.addEventListener('close', (event) => {
    console.log('Close connection to server.');
  });

  socket.addEventListener('error', (event) => {
    console.error('Error connecting to the server.', event.error);
  });
}
//---------------------------------------------------------------------//
function send_listApplicationsRequest_to_server() {
  const socket = new WebSocket('ws://' + host + ':'+ port + '/listApplicationsRequest');
  
  socket.addEventListener('open', (event) => {
    const data = {
      user_tenantID: "c735b5b4-8130-454b-abf5-26021f5327f0",
    };
    socket.send(JSON.stringify(data));
  });

  socket.addEventListener('message', (event) => {
    const response = JSON.parse(event.data);
    console.log('Received message for server:', response);

    if (response.status === 'success') {
      resp_listApplicationsReq = response.resp_listApplicationsReq;

      displayListApplications(resp_listApplicationsReq);
    } else {
      alert('An error occurred: ' + response.message);
    }
  });

  socket.addEventListener('close', (event) => {
    console.log('Close connection to server.');
  });

  socket.addEventListener('error', (event) => {
    console.error('Error connecting to the server.', event.error);
  });
}
//---------------------------------------------------------------------//

//---------------------------------------------------------------------// 
//----------------------------FUNCTIONS--------------------------------//

function displayListDevices(items) {
  let tbody = document.getElementById('app-table-devices');
  
  tbody.innerHTML = '';

  let count = 0;
  items.forEach(function(item, index) {
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

    // Device name column with a link
    var devNameCell = document.createElement('td');
    var devNameLink = document.createElement('a');
    devNameLink.href = 'deviceConfigPage.html'; // Linkto device config page
    devNameLink.textContent = item.dev_name;
    devNameCell.appendChild(devNameLink);
    row.appendChild(devNameCell);
  
    // Deivce ID column
    var devIdCell = document.createElement('td');
    devIdCell.textContent = item.dev_id;
    row.appendChild(devIdCell);

    // Last Seen column
    var lastSeenCell = document.createElement('td');
    lastSeenCell.textContent = formatLastSeen(item.last_seen);
    row.appendChild(lastSeenCell);

    // Append the row to the tbody
    tbody.appendChild(row);
  });
}
//---------------------------------------------------------------------//
function displayListApplications(items) {
  let tbody = document.getElementById('app-table-apps');

    tbody.innerHTML = '';

    let count = 0;
    // Loop through the items and append rows to the tbody
    items.forEach(function(item, index) {
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
        appNameLink.href = 'devicesPage.html';
        // Add click event listener to appNameLink
        appNameLink.addEventListener('click', function(event) {
          event.preventDefault(); // Prevent default link behavior
          var appID = item.app_id;
          console.log("test: " + appID);
          send_listDevicesRequest_to_server();
          window.location.href = 'devicesPage.html';
        });
        appNameLink.textContent = item.app_name;
        appNameCell.appendChild(appNameLink);
        row.appendChild(appNameCell);

        // Application ID column
        var appIdCell = document.createElement('td');
        appIdCell.textContent = item.app_id;
        row.appendChild(appIdCell);

        // Number of registered devices column
        var registeredDeviceCell = document.createElement('td');
        registeredDeviceCell.textContent = item.app_num;
        row.appendChild(registeredDeviceCell);

        // Append the row to the tbody
        tbody.appendChild(row);
    });
}
//---------------------------------------------------------------------//
function formatLastSeen(items) {
  if (!items) {
    return 'never';
  }

  var lastSeenDate = new Date(items);
  var formattedDate = lastSeenDate.toLocaleTimeString('en-US', { hour12: false }) + ' ' +
                      lastSeenDate.toLocaleDateString('en-US');
  return formattedDate;
}//---------------------------------------------------------------------//

//---------------------------------------------------------------------//
//-----------------------REFRESH CHECKING------------------------------//
// ตรวจสอบว่าอยู่ในหน้าไหน เพื่อดึงข้อมูลมาแสดงให้ใหม่ เมื่อมีการรีเฟรชหน้าจอ
if (window.location.pathname === '/applicationsPage.html' || window.location.pathname === '/') {
  send_listApplicationsRequest_to_server();
} else if (window.location.pathname === '/devicesPage.html') {
  send_listDevicesRequest_to_server();
}
//---------------------------------------------------------------------//