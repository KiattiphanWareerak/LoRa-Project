//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------//
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', async () => {
    // set default tab (Dashboard of device)
    sessionStorage.setItem('activeTabIndex', 0);
    sessionStorage.setItem('activeTab', 'Dashboard');

    // reset dev_name, dev_id before
    // localStorage.setItem('dev_id', null);
    // localStorage.setItem('dev_name', null);

    // Display devices
    const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-deviceList`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_token: localStorage.getItem('user_token'),
            app_id: localStorage.getItem('app_id')
        })
    });

    const result = await response.json();
    console.log('Result:\n', result);

    displayHeaderAndMiddleTitle();
    displayDevicesList(result);

    // Add device button (GET DEVICE PROFILES)
    const addDeviceButton = document.getElementById('addDeviceButton');
    addDeviceButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/menu-deviceProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                user_un: localStorage.getItem('user_un'),
                user_id: localStorage.getItem('user_id'),
                tenant_id: localStorage.getItem('tenant_id'),
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        displayDeviceProfilesDropDown(result);
    })

    // Application configuration button (GET)
    const appConfigButton = document.getElementById("appConfigButton");

    const getAppConfig = async () => {
        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-application`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                app_id: localStorage.getItem('app_id')
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        displayApplicationConfiguration(result);
    };

    appConfigButton.addEventListener('click', (event) => {
        event.preventDefault();
        getAppConfig();
    })

    // Application configuration confirm button (POST)
    const appConfigConfirmButton = document.getElementById("appConfigConfirm");

    const appConfigConfirm = async () => {
        let appNameInput = document.getElementById('appNameInput');
        let descriptionInput = document.getElementById('descriptionInput');

        let appNameValue = appNameInput.value.trim();
        let descriptionValue = descriptionInput.value.trim();

        let appNameRegex = /^[a-zA-Z0-9_\-@]+$/;

        if (!appNameRegex.test(appNameValue) || appNameValue === '') {
            alert('Please enter the application name again.\n' +
                '(English lowercase-uppercase, numbers 0-9, "_, "-", and "@")');
        } else {
            const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/update-application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_token: localStorage.getItem('user_token'),
                    tenant_id: localStorage.getItem('tenant_id'),
                    app_id: localStorage.getItem('app_id'),
                    app_name: appNameValue,
                    app_desc: descriptionValue
                })
            });

            const result = await response.json();
            console.log('Result:\n', result);

            if (result === 'failed') {
                alert('Update application failed.');
                return;
            }
            alert('Application has been updated.');
            localStorage.setItem('app_name', appNameValue);

            document.getElementById('dev_ConfigApp').style.display = "none";
            window.location.href = '../htmls/devices.html';
        }
    };

    appConfigConfirmButton.addEventListener('click', (event) => {
        event.preventDefault();
        appConfigConfirm();
    })


    // Add device button
    const addDevNextButton = document.getElementById("addDevNext");
    const generateDevKeyButton = document.getElementById("Generate_key");
    const addDevConfirmButton = document.getElementById("addDevConfirm");
    let messageToAddDev;

    const nextAddDev = () => {
        let devNameInput = document.getElementById('devNameInput');
        let devIdInput = document.getElementById('devIdInput');
        const selectElement = document.getElementById("deviceProfile_List");
        const selectedDeviceProfileId = selectElement.value;

        let devNameValue = devNameInput.value.trim();
        let devNameRegex = /^[a-zA-Z0-9_\-@]+$/;

        if (devNameValue.value === '') {
            alert('Please enter the device name.');
            return;
        } else if (!devNameRegex.test(devNameValue)) {
            alert('Please enter the device name in English lowercase-uppercase, numbers 0-9, "_", "-", and "@".');
            return;
        }

        let is64Bit = devIdInput.value.length === 16; // 16 bytes

        if (!is64Bit) {
            alert("Device eui should be 64 bits (16 characters)");
            return;
        }

        messageToAddDev = {
            dev_name: devNameInput.value,
            dev_id: devIdInput.value,
            dev_devProfId: selectedDeviceProfileId
        };

        devIdInput.value = '';
        devNameInput.value = '';
        document.getElementById('dev_AddDevice').style.display = "none";
        document.getElementById('dev_AddAppkey').style.display = "block";
    };

    const generateDevKey = async () => {
        const genAppKetBtt = document.getElementById('devKeyInput');
        genAppKetBtt.value = await generate128BitRandom();
        messageToAddDev.dev_key = genAppKetBtt.value;
    };

    const addDevConfirm = async () => {
        if (messageToAddDev.dev_key) {
            let is128Bit = messageToAddDev.dev_key.length === 32;

            if (!is128Bit) {
                alert("Device key (OTAA) should be 128 bits (32 characters)");
                return;
            }
        } else {
            alert("Invalid input element [Device key (OTAA) should be 128 bits (32 characters)]");
            return;
        }

        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/add-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                app_id: localStorage.getItem('app_id'),
                dev_id: messageToAddDev.dev_id,
                dev_name: messageToAddDev.dev_name,
                dev_devProfId: messageToAddDev.dev_devProfId,
                dev_key: messageToAddDev.dev_key
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            alert('Add device failed.');
            return;
        }
        alert('Add device has been completed.');

        document.getElementById('dev_AddDevice').style.display = "none";
        window.location.href = '../htmls/devices.html';
    }

    addDevNextButton.addEventListener('click', (event) => {
        event.preventDefault();
        nextAddDev();
    })

    generateDevKeyButton.addEventListener('click', (event) => {
        event.preventDefault();
        generateDevKey();
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

    const delDevConfirm = async () => {
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

        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/del-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                app_id: localStorage.getItem('app_id'),
                del_devs: messageToDelDev
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            alert('Delete device failed.');
            return;
        }
        alert('Device has been deleted.');

        document.getElementById('dev_DelDev').style.display = "none";
        window.location.href = '../htmls/devices.html';
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
        devNameLink.addEventListener('click', async function (event) {
            event.preventDefault();

            const devId = this.getAttribute('dev-id');
            const devName = item.name;

            localStorage.setItem('dev_name', devName);
            localStorage.setItem('dev_id', devId);

            window.location.href = '../htmls/devicesConfiguration.html';
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
function displayHeaderAndMiddleTitle() {
    // Header and Middle title
    let newPElement = document.createElement('p');
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newPElement.textContent = 'Application: '
    newH1Element.textContent = localStorage.getItem('app_name');;
    newH4Element.innerHTML = `<a href="applications.html" >Applications</a>
     > <a>${localStorage.getItem('app_name')}</a></h4>`;
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

    selectElement.innerHTML = '';

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
async function generate128BitRandom() {
    const buffer = crypto.getRandomValues(new Uint8Array(16));
    const hexString = Array.from(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hexString;
}
//---------------------------------------------------------------------//
async function generate64BitRandom() {
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