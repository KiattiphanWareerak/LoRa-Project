//---------------------------------------------------------------------// 
//------------------------------EVENTS---------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {

    const addDeviceButton = document.getElementById('addDeviceButton');
    addDeviceButton.addEventListener("click", (event) => {
        event.preventDefault();

        let devIdInput = document.getElementById('devIdInput');
        devIdInput.value = generate64BitRandom();
        console.log(generate64BitRandom());
    })

    // Display devices
    const sendDevicesListRequest = () => {
        const message = { request: 'dispDev', message: { 
            status: undefined, 
            data: undefined
        }};
        socket.send(JSON.stringify(message));
    };

    const socket = new WebSocket('ws://localhost:3001');

    socket.addEventListener('open', () => {
        // Display devices event
        const currentPath = window.location.pathname;

        if (currentPath.includes('devices.html')) {
            sendDevicesListRequest();
        }

        // Application configs button
        const appConfigButton = document.getElementById("appConfigConfirm");

        const appConfigConfirm = () => {
            let appNameInput = document.getElementById('appNameInput');
            let descriptionInput = document.getElementById('descriptionInput');
            
            let appNameValue = appNameInput.value;
            let descriptionValue = descriptionInput.value;
            let message = {app_name: appNameValue, app_desp: descriptionValue};
    
            const req = { request: 'appConfig', message: { 
                status: undefined, 
                data: message 
            }};
            socket.send(JSON.stringify(req));

            appNameInput.value = '';
            descriptionInput.value = '';
            document.getElementById('dev_ConfigApp').style.display = "none";
        };

        appConfigButton.addEventListener('click', (event) => {
            event.preventDefault();
            appConfigConfirm();
        })


        // Add device button
        const addDevNextButton = document.getElementById("addDevNext");
        const addDevConfirmButton = document.getElementById("addDevConfirm");
        let messageToAddDev;

        const nextAddDev = () => {
            let devNameInput = document.getElementById('devNameInput');
            let devIdInput = document.getElementById('devIdInput');
        
            messageToAddDev = { dev_name: devNameInput.value, dev_id: devIdInput.value };
        
            devIdInput.value = '';
            devNameInput.value = '';
            document.getElementById('dev_AddDevice').style.display = "none";
            document.getElementById('dev_AddAppkey').style.display = "block";
            let devKeyInput = document.getElementById('devKeyInput');
            devKeyInput.value = generate128BitRandom();
        };

        const addDevConfirm = () => {
            let devKeyInput = document.getElementById('devKeyInput');
            messageToAddDev.dev_key = devKeyInput.value;        
            
            const req = { request: 'addDev', message: {
                status: undefined, 
                data: messageToAddDev 
            }};
            socket.send(JSON.stringify(req));

            devKeyInput.value = '';
            document.getElementById('dev_AddDevice').style.display = "none";
        }

        addDevNextButton.addEventListener('click', (event) => {
            event.preventDefault();
            nextAddDev();
        })

        addDevConfirmButton.addEventListener('click', (event) => {
            event.preventDefault();
            addDevConfirm();
        })

        // Delete device button
        const delDevButton = document.getElementById('delDevConfirm');

        const delDevConfirm = () => {
            let devIDs = [];
            for (let i = 0; i < document.querySelectorAll("input[type='checkbox']").length; i++) {
                if (document.querySelectorAll("input[type='checkbox']")[i].checked) {
                    const checkedCheckbox = document.querySelectorAll("input[type='checkbox']")[i];

                    const devIDCell = checkedCheckbox.closest("tr").querySelector("td:nth-child(4)");
              
                    if (devIDCell) {
                      const devID = devIDCell.textContent;
                      devIDs.push(devID);
                    } else {
                      console.error("appID cell not found");
                    }
                }
            }
            let messageToDelDev = devIDs.map((devID) => ({ dev_id: devID }));

            const req = { request: 'delDev', message: {
                status: undefined, 
                data: messageToDelDev 
            }};
            socket.send(JSON.stringify(req));

            document.getElementById('dev_DelDev').style.display = "none";
        }

        delDevButton.addEventListener('click', (event) => {
            event.preventDefault();
            delDevConfirm();
        })
    });

    socket.addEventListener('message', (event) => {
        try {
            const messageFromServer = JSON.parse(event.data);
            console.log('Message from server:', messageFromServer);

            if (messageFromServer.request === 'enterAppId' || messageFromServer.request === 'dispDev' ) {
                if (messageFromServer.message.status === 'success') {
                    displayDevicesList(messageFromServer.message.data.devs_list, 
                        messageFromServer.message.data.app_id,
                        messageFromServer.message.data.app_name);
                } else {
                    alert('Request: ' + messageFromServer.request + ', Status: ' + messageFromServer.message.status);
                }
            } else if (messageFromServer.request === 'addDev') {
                if (messageFromServer.message.status === 'success') {
                    alert('Add device has been completed.');
                    sendDevicesListRequest();
                } else {
                    alert('Request: ' + messageFromServer.request + ', Status: ' + messageFromServer.message.status);
                }
            } else if ( messageFromServer.request === 'delDev' ) {
                if (messageFromServer.message.status === 'success') {
                    alert('Delete application has been completed.');
                    sendDevicesListRequest();
                } else {
                    alert('Request: ' + messageFromServer.request + ', Status: ' + messageFromServer.message.status);
                }
            } else if ( messageFromServer.request === 'appConfig' ) {
                if (messageFromServer.message.status === 'success') {
                    alert('Config application has been completed.');
                    sendDevicesListRequest();
                } else {
                    alert('Request: ' + messageFromServer.request + ', Status: ' + messageFromServer.message.status);
                }
            } 
            else {
                console.log('Error: ', messageFromServer);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });    
});
//---------------------------------------------------------------------// 
//-----------------------------FUNCTIONS-------------------------------// 
//---------------------------------------------------------------------// 
function displayDevicesList(items, appID, appName) {
    let tbody = document.getElementById('data-table');

    tbody.innerHTML = '';

    // Header and Middle title
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newH1Element.textContent = appName;
    newH4Element.innerHTML = `<a href="applications.html" >Applications</a>
     > <a>${appName}</a></h4>`;
    let headerTitleDiv = document.querySelector('.header--title');
    let locatedDiv = document.querySelector('.located');
    headerTitleDiv.innerHTML = '';
    locatedDiv.innerHTML = '';
    headerTitleDiv.appendChild(newH1Element);
    locatedDiv.appendChild(newH4Element);

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
        devNameLink.href = 'javascript:void(0)';
        devNameLink.setAttribute('dev-id', item.dev_id);
        devNameLink.addEventListener('click', function(event) {
            event.preventDefault();
            const socket = new WebSocket('ws://localhost:3001');

            socket.addEventListener('open', () => {
                let devId = this.getAttribute('dev-id');
                let devName = item.dev_name;
                
                const req = { request: 'enterDevId', 
                    message: { status: undefined,
                        data: { dev_id: devId, dev_name: devName }
                    }};
                socket.send(JSON.stringify(req));

                window.location.href = 'devicesConfiguration.html';
            });
        });
        devNameLink.textContent = item.dev_name;
        devNameCell.appendChild(devNameLink);
        row.appendChild(devNameCell);
        
        // Deivce ID column
        var devIdCell = document.createElement('td');
        devIdCell.textContent = item.dev_id;
        row.appendChild(devIdCell);
        
        // Last Seen column
        var lastSeenCell = document.createElement('td');
        lastSeenCell.textContent = formatLastSeen(item.dev_lastSeen);
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
const generate128BitRandom = () => {
    const buffer = crypto.getRandomValues(new Uint8Array(16));
    const hexString = Array.from(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hexString;
  
}
const generate64BitRandom = () => {
    const buffer = crypto.getRandomValues(new Uint8Array(8));
    const hexString = Array.from(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hexString;
  
}
//---------------------------------------------------------------------//
