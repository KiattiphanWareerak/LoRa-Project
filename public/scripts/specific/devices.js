//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const addDeviceButton = document.getElementById('addDeviceButton');
    addDeviceButton.addEventListener("click", (event) => {
        event.preventDefault();

        let devIdInput = document.getElementById('devIdInput');
        devIdInput.value = generate64BitRandom();
        console.log(generate64BitRandom());
    })

    //---------------------------SENDER ZONE---------------------------//
    const socket = new WebSocket('ws://localhost:3001');

    // Display devices list
    const sendDevicesListRequest = () => {
        const message = { request: 'dispDev', message: { 
            status: undefined, 
            data: undefined
        }};
        socket.send(JSON.stringify(message));
    };

    socket.addEventListener('open', () => {
        // refresh 
        const currentPath = window.location.pathname;

        if (currentPath.includes('devices.html')) {
            sendDevicesListRequest();
        }

        // Application configuration button (GET)
        const appConfigButton = document.getElementById("appConfigButton");

        const getAppConfig = () => {
            const req = { request: 'getApp', message: { 
                status: undefined, 
                data: undefined 
            }};

            socket.send(JSON.stringify(req));
        };

        appConfigButton.addEventListener('click', (event) => {
            event.preventDefault();
            getAppConfig();
        })

        // Application configuration confirm button (POST)
        const appConfigConfirmButton = document.getElementById("appConfigConfirm");

        const appConfigConfirm = () => {
            let appNameInput = document.getElementById('appNameInput');
            let descriptionInput = document.getElementById('descriptionInput');
            
            let appNameValue = appNameInput.value.trim();
            let descriptionValue = descriptionInput.value.trim();

            let appNameRegex = /^[a-zA-Z0-9_\-@]+$/;

            if (!appNameRegex.test(appNameValue) || appNameValue === '') {
                alert('Please enter the application name again.\n' + 
                '(English lowercase-uppercase, numbers 0-9, "_, "-", and "@")');
            } else {
                let message = {app_name: appNameValue, app_desc: descriptionValue};
    
                const req = { request: 'appConfig', message: { 
                    status: undefined, 
                    data: message 
                }};
                socket.send(JSON.stringify(req));

                appNameInput.value = '';
                descriptionInput.value = '';
                document.getElementById('dev_ConfigApp').style.display = "none";
            }
        };

        appConfigConfirmButton.addEventListener('click', (event) => {
            event.preventDefault();
            appConfigConfirm();
        })


        // Add device confirm button
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

        // Delete device confirm button
        const delDevButton = document.getElementById('delDevConfirm');

        const delDevConfirm = () => {
            let checkedCount = 0;
            let devIDs = [];
            for (let i = 0; i < document.querySelectorAll("input[type='checkbox']").length; i++) {
                if (document.querySelectorAll("input[type='checkbox']")[i].checked) {
                    const checkedCheckbox = document.querySelectorAll("input[type='checkbox']")[i];

                    const devIDCell = checkedCheckbox.closest("tr").querySelector("td:nth-child(4)");

                    if (devIDCell) {
                      const devID = devIDCell.textContent;
                      devIDs.push(devID);
                    } 

                    checkedCount++;
                }
            }

            if (checkedCount === 0) {
                alert("Please select a device to delete.");
                return;
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

    //-------------------------RECEIVER ZONE-------------------------//
    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if (messageFromServer.request === 'enterAppId' || messageFromServer.request === 'dispDev' ) {
            if (messageFromServer.message.status === 'success') {
                displatHeaderAndMiddleTitle(messageFromServer.message.data.app_name);
                displayDevicesList(messageFromServer.message.data.devs_list);
            } else {
                alert('Devices list failed.');
            }
        } else if ( messageFromServer.request === 'appConfig' ) {
            if (messageFromServer.message.status === 'success') {
                alert('Application has been updated.');
                
                sendDevicesListRequest();
            } else {
                alert('Update application has been failed.');
            }
        } else if (messageFromServer.request === 'addDev') {
            if (messageFromServer.message.status === 'success') {
                alert('Add device has been completed.');

                sendDevicesListRequest();
            } else {
                alert('Add device has been failed.');
            }
        } else if ( messageFromServer.request === 'delDev' ) {
            if (messageFromServer.message.status === 'success') {
                alert('Delete application has been completed.');

                sendDevicesListRequest();
            } else {
                alert('Delete application has been failed.');
            }
        } else if ( messageFromServer.request === 'getApp' ) {
            if (messageFromServer.message.status === 'success') {
                displatApplicationConfiguration(messageFromServer.message.data.app_config);
            } else {
                alert('Get application has been failed.');
            }
        }
        else {
            console.log('Error 505.');
        }
    });    
});
//---------------------------------------------------------------------// 
//---------------------------DISPLAYS ZONE-----------------------------// 
//---------------------------------------------------------------------// 
function displatApplicationConfiguration(items) {
    // Application Configuration Modal
    let appNameInput = document.getElementById('appNameInput');
    let descriptionInput = document.getElementById('descriptionInput');
            
    appNameInput.value = items.application.name;
    descriptionInput.value = items.application.description;
}
function displayDevicesList(items) {
    // Devices List
    let tbody = document.getElementById('data-table');

    tbody.innerHTML = '';

    let count = 0;
    items.resultList.forEach(function(item, index) {
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
        // Add click event listener to DevNameLink
        devNameLink.setAttribute('dev-id', item.devEui);
        devNameLink.addEventListener('click', function(event) {
            event.preventDefault();
            const socket = new WebSocket('ws://localhost:3001');

            socket.addEventListener('open', () => {
                let devId = this.getAttribute('dev-id');
                let devName = item.name;

                const req = { request: 'enterDevId', 
                    message: { status: undefined,
                        data: { dev_id: devId, dev_name: devName,
                            timeAgo: "1m", 
                            aggregation: "DAY" }
                    }};
                socket.send(JSON.stringify(req));

                window.location.href = 'devicesConfiguration.html';
            });
        });
        devNameLink.textContent = item.name;
        devNameCell.appendChild(devNameLink);
        row.appendChild(devNameCell);
        
        // Deivce ID column
        var devIdCell = document.createElement('td');
        devIdCell.textContent = item.devEui;
        row.appendChild(devIdCell);
        
        // Last Seen column
        var lastSeenCell = document.createElement('td');
        lastSeenCell.textContent = formatLastSeen(item.lastSeenAt);
        row.appendChild(lastSeenCell);
        
        // Append the row to the tbody
        tbody.appendChild(row);
    });
}
function displatHeaderAndMiddleTitle(items) {
    // Header and Middle title
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newH1Element.textContent = items;
    newH4Element.innerHTML = `<a href="applications.html" >Applications</a>
     > <a>${items}</a></h4>`;
    let headerTitleDiv = document.querySelector('.header--title');
    let locatedDiv = document.querySelector('.located');
    headerTitleDiv.innerHTML = '';
    locatedDiv.innerHTML = '';
    headerTitleDiv.appendChild(newH1Element);
    locatedDiv.appendChild(newH4Element);
}
//---------------------------------------------------------------------// 
//----------------------------COMMONS ZONE-----------------------------// 
//---------------------------------------------------------------------// 
function formatLastSeen(lastSeen) {
    if (!lastSeen) {
    return 'never';
    }
    
    var lastSeenDate = new Date(lastSeen.seconds * 1000); 
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
9
document.addEventListener('DOMContentLoaded', function () {
    // Check if there's a stored active tab index
    const activeTabIndex = sessionStorage.getItem('activeTabIndex');
    // If there's a stored active tab index, set the corresponding tab as active
    if (activeTabIndex !== null) {
        const activeTabButton = document.querySelectorAll('.tab_button')[activeTabIndex];
        activeTabButton.classList.add('active');
        const tabName = activeTabButton.getAttribute('onclick').match(/'(.*?)'/)[1];
        document.getElementById(tabName).classList.add('active');
        // Adjust the active line position
        const activeLine = document.querySelector(".active_line");
        activeLine.style.left = activeTabButton.offsetLeft + "px";
        activeLine.style.width = activeTabButton.offsetWidth + "px";
    } else {
        // If no stored active tab index, default to the "Dashboard" tab
        document.querySelector('.tab_button.active').click();
    }
});

function opentab(evt, tabName) {
    // Declare all variables
    var i, tab_content, tab_button, active_line;

    // Get all elements with class="tab_content" and hide them
    tab_content = document.getElementsByClassName("tab_content");
    for (i = 0; i < tab_content.length; i++) {
        tab_content[i].style.display = "none";
    }

    // Get all elements with class="tab_button" and remove the class "active"
    tab_button = document.getElementsByClassName("tab_button");
    for (i = 0; i < tab_button.length; i++) {
        tab_button[i].className = tab_button[i].className.replace(" active", "");
    }

    // Move the line to the position of the active tab button
    active_line = document.querySelector(".active_line");
    active_line.style.left = evt.currentTarget.offsetLeft + "px";
    active_line.style.width = evt.currentTarget.offsetWidth + "px";

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // Store the active tab index in sessionStorage
    const activeTabIndex = Array.from(tab_button).indexOf(evt.currentTarget);
    sessionStorage.setItem('activeTabIndex', activeTabIndex);
}
