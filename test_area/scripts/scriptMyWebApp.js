//---------------------------------------------------------------------// 
//----------------------SCRIPT FOR WEB APPLICATION---------------------//
import * as mySocketService from './mySocketServices.js';
//---------------------------------------------------------------------// 
//----------------------------ACTION EVENTS----------------------------//
//---CREATE DEVICE EVENT---//
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
//---CREATE DEVICE KEY (OTAA KEY) EVENT---//
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
const data = {
  user_tenantID: "52f14cd4-c6f1-4fbd-8f87-4025e1d49242",
};
//---LIST APPLICATIONS EVENT---//
document.addEventListener("DOMContentLoaded", function () {
  let menuApplications = document.getElementById("menu-applications");

  menuApplications.addEventListener('click', function (event) {
    // Prevent the default action (in this case, navigating to applications.html)
    event.preventDefault();

    mySocketService.send_listApplicationsRequest_to_server(data.user_tenantID, (err, resp_listApplicationsReq) => {
      if (err) {
          alert('error to req application list!');
      } else {
          displayListApplications(resp_listApplicationsReq);
      }
    });
  });
});
//---------------------------------------------------------------------//
//---LIST DEVICES EVENT---//
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("list-device-button");

  button.addEventListener("click", function () {
    mySocketService.send_listDevicesRequest_to_server();
    myWebService.displayListApplications();
  });
});
//---------------------------------------------------------------------//

//---------------------------------------------------------------------//  
//--------------------------MAIN FUNCTIONS-----------------------------//
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
        appNameLink.setAttribute('app-id', item.app_id);
        appNameLink.addEventListener('click', function(event) {
          event.preventDefault(); // Prevent default link behavior
          let appID = this.getAttribute('app-id');

          mySocketService.send_listDevicesRequest_to_server(appID, (err, resp_listDevicesReq) => {
            if (err) {
              console.log('10');
                alert('error to req device list!');
            } else {
              console.log('11');
                displayListDevices(resp_listDevicesReq)
            }
          });

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
function displayListDevices(items) {
let tbody = document.getElementById('app-table-devices');
console.log('12');
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
function formatLastSeen(items) {
if (!items) {
  return 'never';
}

var lastSeenDate = new Date(items);
var formattedDate = lastSeenDate.toLocaleTimeString('en-US', { hour12: false }) + ' ' +
                    lastSeenDate.toLocaleDateString('en-US');
return formattedDate;
}
//---------------------------------------------------------------------//

//-----------------------REFRESH CHECKING------------------------------//
// ตรวจสอบว่าอยู่ในหน้าไหน เพื่อดึงข้อมูลมาแสดงให้ใหม่ เมื่อมีการรีเฟรชหน้าจอ
if (window.location.pathname === '/applicationsPage.html' || window.location.pathname === '/') {
  mySocketService.send_listApplicationsRequest_to_server(data.user_tenantID, (err, resp_listApplicationsReq) => {
    if (err) {
        alert('error to req application list!');
    } else {
        displayListApplications(resp_listApplicationsReq);
    }
  });
} else if (window.location.pathname === '/devicesPage.html') {
  mySocketService.send_listDevicesRequest_to_server();
}
//---------------------------------------------------------------------//