//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const deviceSocket = new WebSocket('ws://localhost:3001');
    //---------------------------SENDER ZONE---------------------------//
    deviceSocket.addEventListener('open', () => {
        console.log('WebSocket connection established with WebServer from devices');

        // refresh 
        const currentPath = window.location.pathname;

        if (currentPath.includes('devices.html')) {
            const req = {
                request: 'dispDev', message: {
                    status: undefined,
                    data: undefined
                }
            };
            sendRequset(req);
        }

        // Add device button (GET DEVICE PROFILES)
        const addDeviceButton = document.getElementById('addDeviceButton');
        addDeviceButton.addEventListener("click", (event) => {
            event.preventDefault();
    
            const req = {
                request: 'getDevProfList', message: {
                    status: undefined,
                    data: undefined
                }
            };
            deviceSocket.send(JSON.stringify(req));
        })

        // Application configuration button (GET)
        const appConfigButton = document.getElementById("appConfigButton");

        const getAppConfig = () => {
            const req = {
                request: 'getApp', message: {
                    status: undefined,
                    data: undefined
                }
            };
            deviceSocket.send(JSON.stringify(req));
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
                let message = { app_name: appNameValue, app_desc: descriptionValue };

                const req = {
                    request: 'appConfig', message: {
                        status: undefined,
                        data: message
                    }
                };
                deviceSocket.send(JSON.stringify(req));

                appNameInput.value = '';
                descriptionInput.value = '';
                document.getElementById('dev_ConfigApp').style.display = "none";
            }
        };

        appConfigConfirmButton.addEventListener('click', (event) => {
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
            const selectElement = document.getElementById("deviceProfile_List");
            const selectedDeviceProfileId = selectElement.value;

            let devNameValue = devNameInput.value.trim();
            let devNameRegex = /^[a-zA-Z0-9_\-@]+$/;

            if ( devNameValue.value === '') {
                alert('Please enter the device name.');
                return;
            } else if (!devNameRegex.test(devNameValue)) {
                alert('Please enter the device name in English lowercase-uppercase, numbers 0-9, "_", "-", and "@".');
                return;
            }
            messageToAddDev = { dev_name: devNameInput.value, 
                dev_id: devIdInput.value, 
                dev_devProfId: selectedDeviceProfileId };

            devIdInput.value = '';
            devNameInput.value = '';
            document.getElementById('dev_AddDevice').style.display = "none";
            document.getElementById('dev_AddAppkey').style.display = "block";
        };

        const addDevConfirm = () => {
            let devKeyInput = document.getElementById('devKeyInput');
            messageToAddDev.dev_key = devKeyInput.value;

            const req = {
                request: 'addDev', message: {
                    status: undefined,
                    data: messageToAddDev
                }
            };
            deviceSocket.send(JSON.stringify(req));

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
        const delDevListButton = document.getElementById('deleteDevButton');
        const delDevButton = document.getElementById('delDevConfirm');

        const delDevList = () => {
            let selectedDevName = [];
            for (let i = 0; i < document.querySelectorAll("input[type='checkbox']").length; i++) {
                if (document.querySelectorAll("input[type='checkbox']")[i].checked) {
                    const checkedCheckbox = document.querySelectorAll("input[type='checkbox']")[i];

                    const devNameCell = checkedCheckbox.closest("tr").querySelector("td:nth-child(3)");

                    if (devNameCell) {
                        const devName = devNameCell.textContent;
                        selectedDevName.push(devName);
                    } else {
                        console.error("devName cell not found");
                    }
                }
            }

            const deleteSelectedTBody = document.getElementById('delete-selected');
            deleteSelectedTBody.innerHTML = "";
            selectedDevName.forEach(function (devName) {
                const row = document.createElement('tr');
                const appNameCell = document.createElement('td');
                appNameCell.textContent = devName;
                row.appendChild(appNameCell);
                deleteSelectedTBody.appendChild(row);
            });
        }

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
                    } else {
                        console.error("devID cell not found");
                    }

                    checkedCount++;
                }
            }

            if (checkedCount === 0) {
                alert("Please select a device to delete.");
                return;
            }

            let messageToDelDev = devIDs.map((devID) => ({ dev_id: devID }));

            const req = {
                request: 'delDev', message: {
                    status: undefined,
                    data: messageToDelDev
                }
            };
            deviceSocket.send(JSON.stringify(req));

            document.getElementById('dev_DelDev').style.display = "none";
        }

        delDevListButton.addEventListener('click', (event) => {
            event.preventDefault();
            delDevList();
        })

        delDevButton.addEventListener('click', (event) => {
            event.preventDefault();
            delDevConfirm();
        })
    });
    //-------------------------RECEIVER ZONE-------------------------//
    deviceSocket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if (messageFromServer.request === 'enterAppId' || messageFromServer.request === 'dispDev') {
            if (messageFromServer.message.status === 'success') {
                displayHeaderAndMiddleTitle(messageFromServer.message.data.app_name);
                displayDevicesList(messageFromServer.message.data.devs_list);
            } else {
                alert('Devices list failed.');
            }
        } else if (messageFromServer.request === 'appConfig') {
            if (messageFromServer.message.status === 'success') {
                alert('Application has been updated.');

                const req = {
                    request: 'dispDev', message: {
                        status: undefined,
                        data: undefined
                    }
                };
                sendRequset(req);
            } else {
                alert('Update application has been failed.');
            }
        } else if (messageFromServer.request === 'addDev') {
            if (messageFromServer.message.status === 'success') {
                alert('Add device has been completed.');

                const req = {
                    request: 'dispDev', message: {
                        status: undefined,
                        data: undefined
                    }
                };
                sendRequset(req);
            } else {
                alert('Add device has been failed.');
            }
        } else if (messageFromServer.request === 'delDev') {
            if (messageFromServer.message.status === 'success') {
                alert('Delete application has been completed.');

                const req = {
                    request: 'dispDev', message: {
                        status: undefined,
                        data: undefined
                    }
                };
                sendRequset(req);
            } else {
                alert('Delete application has been failed.');
            }
        } else if (messageFromServer.request === 'getApp') {
            if (messageFromServer.message.status === 'success') {
                displayApplicationConfiguration(messageFromServer.message.data.app_config);
            } else {
                alert('Get application has been failed.');
            }
        } else if (messageFromServer.request === 'getDevProfList') {
            if (messageFromServer.message.status === 'success') {
                displayDeviceProfilesDropDown(messageFromServer.message.data);
            } else {
                console.log('Device profile list has been failed.');
            }
        }
        else {
            console.log('Error 505.');
        }
    });

    deviceSocket.addEventListener('error', (event) => {
        console.log('WebSocket error:', event);
    });

    deviceSocket.addEventListener('close', (event) => {
        console.log('WebSocket closed:', event);
    });

    function sendRequset(data) {
        if (deviceSocket.readyState === WebSocket.OPEN) {
            deviceSocket.send(JSON.stringify(data));
        } else {
            console.log('WebSocket not ready, message not sent!');
        }
    }
});
//---------------------------------------------------------------------// 
//---------------------------DISPLAYS ZONE-----------------------------// 
//---------------------------------------------------------------------// 
function displayApplicationConfiguration(items) {
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
    items.resultList.forEach(function (item, index) {
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
        devNameLink.addEventListener('click', function (event) {
            event.preventDefault();

            let devId = this.getAttribute('dev-id');
            let devName = item.name;

            const deviceSocket = new WebSocket('ws://localhost:3001');

            deviceSocket.addEventListener('open', () => {
                const req = {
                    request: 'enterDevId',
                    message: {
                        status: undefined,
                        data: {
                            dev_id: devId, dev_name: devName,
                            timeAgo: "1m",
                            aggregation: "DAY"
                        }
                    }
                };
                deviceSocket.send(JSON.stringify(req));
    
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
function displayHeaderAndMiddleTitle(items) {
    // Header and Middle title
    let newPElement = document.createElement('p');
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newPElement.textContent = 'Application: '
    newH1Element.textContent = items;
    newH4Element.innerHTML = `<a href="applications.html" >Applications</a>
     > <a>${items}</a></h4>`;
    let headerTitleDiv = document.querySelector('.header--title');
    let locatedDiv = document.querySelector('.located');
    headerTitleDiv.innerHTML = '';
    locatedDiv.innerHTML = '';
    headerTitleDiv.appendChild(newPElement);
    headerTitleDiv.appendChild(newH1Element);
    locatedDiv.appendChild(newH4Element);
}
function displayDeviceProfilesDropDown(items) {
    const total_devProfile = items.totalCount;
    const user_devProfiles = items.resultList;

    // Get the select element by its id
    const selectElement = document.getElementById("deviceProfile_List");

    for (var added_option = 0; added_option < total_devProfile; added_option++) {
        var devProfile_name = user_devProfiles[added_option].name;
        var devProfile_id = user_devProfiles[added_option].id;


        // Create a new option element
        var deviceProfile = document.createElement("option");

        // Set the value and text of the new option
        deviceProfile.value = devProfile_id;
        deviceProfile.text = devProfile_name;

        // Append the new option to the select element
        selectElement.appendChild(deviceProfile);
    }
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

document.addEventListener("DOMContentLoaded", function () {
    var integrationCheckboxes = document.querySelectorAll('.integration-checkboxes input[type="checkbox"]');

    integrationCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                integrationCheckboxes.forEach(function (otherCheckbox) {
                    if (otherCheckbox !== checkbox) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });
});