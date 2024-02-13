//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    //---------------------------SENDER ZONE---------------------------//
    const socket = new WebSocket('ws://localhost:3001');

    const sendDeviceProfilesRequest = () => {
        const req = { request: 'dispDevProfiles', message: { 
            status: undefined, 
            data:  undefined 
        }};
        socket.send(JSON.stringify(req));
    };

    socket.addEventListener('open', () => {
        // Display device profiles
        const currentPath = window.location.pathname;
        const menuApplications = document.getElementById("menu-deviceProfiles");

        menuApplications.addEventListener('click', (event) => {
            event.preventDefault();
            sendDeviceProfilesRequest();
        });
        
        if (currentPath.includes('deviceProfiles.html')) {
            sendDeviceProfilesRequest();
        }

        // Add device profile button

        // Delete application button
    });
    //-------------------------RECEIVER ZONE-------------------------//
    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if ( messageFromServer.request === 'dispDevProfiles' ) {
            if ( messageFromServer.message.status === 'success' ) {
                displayDeivceProfilesList(messageFromServer.message.data);
                displayHeaderAndMiddleTitle();
            } else {

            }
        } else if ( messageFromServer.request === 'null' ) {
            if ( messageFromServer.message.status === 'success' ) {

            } else {

            }
        }
        else {
            alert("Error 505.");
        }
    });    
});
//---------------------------------------------------------------------// 
//---------------------------DISPLAYS ZONE-----------------------------// 
//---------------------------------------------------------------------// 
function displayDeivceProfilesList(items) {
    const tableBody = document.getElementById("data-table");

    tableBody.innerHTML = '';

    for (const device of items.dev_profiles.resultList) {
        const row = document.createElement("tr");
      
        // เพิ่ม checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = `app${device.id}`;
        row.appendChild(checkbox);
      
        // เพิ่มชื่ออุปกรณ์
        const nameCell = document.createElement("td");
        const nameLink = document.createElement("a");
        nameLink.href = "devices.html";
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
//---------------------------------------------------------------------//
function displayHeaderAndMiddleTitle() {
    // Header and Middle title
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newH1Element.textContent = 'Device profiles';
    newH4Element.innerHTML = `<a href="deviceProfiles.html" >Deivce profiles</a> `;
    let headerTitleDiv = document.querySelector('.header--title');
    let locatedDiv = document.querySelector('.located');
    headerTitleDiv.innerHTML = '';
    locatedDiv.innerHTML = '';
    headerTitleDiv.appendChild(newH1Element);
    locatedDiv.appendChild(newH4Element);
}
//---------------------------------------------------------------------//
//---------------------------FUNCTIONS ZONE----------------------------// 
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
//---------------------------------------------------------------------// 
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
//---------------------------------------------------------------------// 
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
