//---------------------------------------------------------------------//
//----------------------------EVENTS ZONE------------------------------//
const SERVICE_IP_ADDRESS = "<SERVICE SERVER IP ADDRESS>";
const SERVICE_PORT = "3333";
//---------------------------------------------------------------------//
let sentRequests = {};

document.addEventListener('DOMContentLoaded', () => {
    // Display starter
    display_headerAndMiddleTitle_device_configurations();

    // submit device configurations button
    const saveButton = document.getElementById("save-config_btn");

    saveButton.addEventListener("click", async (event) => {
        event.preventDefault()

        const deviceName = document.getElementById("device_Name").value;
        const deviceDescription = document.getElementById("Description").value;
        const devId = document.getElementById("devIdInput").value;
        const joinId = document.getElementById("joinIdInput").value;
        const appKey = document.getElementById("appkey").value;

        const isDeviceDisabled = document.getElementById("device_disabled-check").checked;
        const isFrameCounterValidationDisabled = document.getElementById("frame-counter-validation_disabled-check").checked;

        const selected_devProfile = document.getElementById("deviceProfile_List");

        const selectedValue = selected_devProfile.value;

        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/update-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                app_id: localStorage.getItem('app_id'),
                dev_name: deviceName,
                dev_id: devId,
                dev_joinEui: joinId,
                dev_desc: deviceDescription,
                dev_devProfId: selectedValue,
                dev_IsDis: isDeviceDisabled,
                dev_SkFntC: isFrameCounterValidationDisabled,
                dev_key: appKey
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            alert("Update device failed");
            return;
        }
        alert("Update device has been completed");
        localStorage.setItem('dev_name', deviceName);

        window.location.href = '../htmls/devicesConfiguration.html';
    });

    // submit enqueue button
    const enqueueButton = document.getElementById("send_enqueue");

    enqueueButton.addEventListener("click", async (event) => {
        event.preventDefault()

        if (document.getElementById("Fport").value === "") {
            alert("Please enter a value for Fport. (Fport: Number)");
            return;
        }
        if (document.getElementById("jsonInput").value === "") {
            alert("Please enter a value for data to enqueue. (Data: String | BASE64)");
            return;
        }

        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/enqueue-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                dev_id: localStorage.getItem('dev_id'),
                eq_cnf: document.getElementById("enqueue-confirm").checked,
                eq_fport: parseInt(document.getElementById("Fport").value),
                eq_isEncry: document.getElementById("enqueue-encrypt").checked,
                eq_data: document.getElementById("jsonInput").value,
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            alert("Enqueue device failed.");
            return;
        }

        alert("Enqueue device successfully.");
        window.location.href = '../htmls/devicesConfiguration.html';
    });

    // reload queue button
    const reloadQueueButton = document.getElementById("queue_reload");

    reloadQueueButton.addEventListener("click", async (event) => {
        event.preventDefault()

        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-queue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                dev_id: localStorage.getItem('dev_id'),
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            return;
        }

        displayQueuesDevice(result);
    });

    // flush queue button
    const flushQueueButton = document.getElementById("queue_flush");

    flushQueueButton.addEventListener("click", async (event) => {
        event.preventDefault()

        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/flush-queue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                dev_id: localStorage.getItem('dev_id'),
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            return;
        }

        displayQueuesDevice(result);
    });

    // tab activated
    const setActiveTab = (tabButton) => {
        tabButton.classList.add('active');
        const tabName = tabButton.getAttribute('onclick').match(/'(.*?)'/)[1];

        if (!sentRequests[tabName]) {
            sendSpecificRequest(tabName); // Call function sending the specific request
            sentRequests[tabName] = true; // Mark request sent
        }

        document.getElementById(tabName).classList.add('active');
        const activeLine = document.querySelector(".active_line");
        activeLine.style.left = tabButton.offsetLeft + "px";
        activeLine.style.width = tabButton.offsetWidth + "px";

        sessionStorage.setItem('activeTab', tabName);
    };

    window.onload = function () {
        const activeTabIndex = sessionStorage.getItem('activeTabIndex');
        if (activeTabIndex !== null) {
            const activeTabButton = document.querySelectorAll('.tab_button')[activeTabIndex];
            setActiveTab(activeTabButton);
        } else {
            const dashboardTabButton = document.querySelector('.tab_button[data-tab="Dashboard"]');
            setActiveTab(dashboardTabButton);
        }
    };

    // if (activeTabIndex !== null) {
    //     const activeTabButton = document.querySelectorAll('.tab_button')[activeTabIndex];
    //     setActiveTab(activeTabButton);
    // } else {
    //     document.querySelector('.tab_button.active').click();
    // }

    // Set up event listeners for tab clicks
    const tabButtons = document.querySelectorAll('.tab_button');
    tabButtons.forEach(tabButton => {
        tabButton.addEventListener('click', async () => {
            setActiveTab(tabButton);
            // Send request specific to the active tab
            if (tabButton.getAttribute('onclick').includes('Dashboard')) {
                const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-linkMetric`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_token: localStorage.getItem('user_token'),
                        dev_id: localStorage.getItem('dev_id'),
                        timeAgo: "1y", // timeAgo: "1y","1m","1d"
                        aggregation: "MONTH" // aggregation: "DAY", "HOUR", "MONTH"
                    })
                });

                const result = await response.json();
                console.log('Result:\n', result);

                if (result === 'failed') {
                    return;
                }

                displayDashboardDevice(result);
            } else if (tabButton.getAttribute('onclick').includes('Configuration')) {
                const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-device`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_token: localStorage.getItem('user_token'),
                        tenant_id: localStorage.getItem('tenant_id'),
                        dev_id: localStorage.getItem('dev_id'),
                    })
                });

                const result = await response.json();
                console.log('Result:\n', result);

                if (result === 'failed') {
                    return;
                }

                displayConfigurationsDevice(result);
            } else if (tabButton.getAttribute('onclick').includes('Queue')) {
                const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-queue`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_token: localStorage.getItem('user_token'),
                        dev_id: localStorage.getItem('dev_id'),
                    })
                });

                const result = await response.json();
                console.log('Result:\n', result);

                if (result === 'failed') {
                    return;
                }

                displayQueuesDevice(result);
            } else if (tabButton.getAttribute('onclick').includes('Event')) {
                const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-event`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_token: localStorage.getItem('user_token'),
                        dev_id: localStorage.getItem('dev_id'),
                    })
                });

                const result = await response.json();
                console.log('Result:\n', result);

                if (result === 'failed') {
                    return;
                }

                displayDeviceEvents(result);
            } else if (tabButton.getAttribute('onclick').includes('LoRaWAN_frame')) {
                const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-frame`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_token: localStorage.getItem('user_token'),
                        dev_id: localStorage.getItem('dev_id'),
                    })
                });

                const result = await response.json();
                console.log('Result:\n', result);

                if (result === 'failed') {
                    return;
                }

                displayDeviceFrames(result);
            }
        });
    });
});
//---------------------------------------------------------------------//
//---------------------------DISPLAYS ZONE-----------------------------// 
//---------------------------------------------------------------------//
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
//---------------------------------------------------------------------//
function display_headerAndMiddleTitle_device_configurations() {
    // Header and Middle title
    let newPElement = document.createElement('p');
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newPElement.textContent = 'Device: ';
    newH1Element.textContent = localStorage.getItem('dev_name');
    newH4Element.innerHTML = `</h4><a href="applications.html" >Applications</a>
     > <a href="devices.html" id="appLink">${localStorage.getItem('app_name')}</a> > <a>${localStorage.getItem('dev_name')}</a></h4>`;

    let headerTitleDiv = document.querySelector('.header--title');
    let locatedDiv = document.querySelector('.located');
    locatedDiv.innerHTML = '';
    headerTitleDiv.innerHTML = '';
    headerTitleDiv.appendChild(newPElement);
    headerTitleDiv.appendChild(newH1Element);
    locatedDiv.appendChild(newH4Element);
}
//---------------------------------------------------------------------//
function displayDashboardDevice(dev_linkMetrics) {
    // Check if dev_linkMetrics is defined
    if (dev_linkMetrics) {
        const received_Data = dev_linkMetrics.rxPackets;
        const RSSI_Data = dev_linkMetrics.gwRssi;
        const SNR_Data = dev_linkMetrics.gwSnr;
        const receivedPerfrequency_Data = dev_linkMetrics.rxPacketsPerFreq;
        const receivedPerDR_Data = dev_linkMetrics.rxPacketsPerDr;
        const Errors_Data = dev_linkMetrics.errors;

        // Call the displayChartData function with the appropriate data
        displayChartData(received_Data, 'receivedChart', 'Received Data', 'rx_count');
        displayChartData(RSSI_Data, 'rssiChart', 'RSSI', 'rssi_strength');
        displayChartData(SNR_Data, 'snrChart', 'SNR', 'snr_strength');
        //  displayChartData(receivedPerfrequency_Data, 'receivedPerFreqChart', 'Received per Frequency', 'rx_count_per_freq');
        //  displayChartData(receivedPerDR_Data, 'receivedPerDRChart', 'Received per Data Rate', 'rx_count_per_dr');
        displayChartData(Errors_Data, 'errorsChart', 'Errors', 'error_count');
    } else {
        console.error("dev_linlMetrics is undefined. Cannot display dashboard data.");
        // Optionally, you can handle this case by displaying an error message or taking other actions.
    }
}
//---------------------------------------------------------------------//
function displayConfigurationsDevice(message) {
    // Configurations tab
    const deviceNameInput = document.getElementById("device_Name");
    const deviceDescriptionTextarea = document.getElementById("Description");
    const devIdInput = document.getElementById("devIdInput");
    const joinIdInput = document.getElementById("joinIdInput");
    const appKeyInput = document.getElementById("appkey");
    const deviceDisabledCheckbox = document.getElementById("device_disabled-check");
    const frameCounterValidationCheckbox = document.getElementById("frame-counter-validation_disabled-check");

    // Get relevant data from dev_config
    const deviceData = message.get_dev.device;

    // Set values for each element
    deviceNameInput.value = deviceData.name;
    deviceDescriptionTextarea.value = deviceData.description;
    devIdInput.value = deviceData.devEui;
    joinIdInput.value = deviceData.joinEui;
    appKeyInput.value = message.get_devKey.deviceKeys.nwkKey;

    // Set states for checkboxes
    deviceDisabledCheckbox.checked = deviceData.isDisabled;
    frameCounterValidationCheckbox.checked = deviceData.skipFcntCheck; // Assuming "skipFcntCheck" corresponds to frame counter validation

    const total_devProfile = message.get_devProfiles.totalCount;
    const user_devProfiles = message.get_devProfiles.resultList;

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

    // Get the select element by its device profile ID
    var selected_devProfile = document.getElementById("deviceProfile_List");
    var deviceProfileId = deviceData.deviceProfileId; // Assuming deviceData.deviceProfileId holds the desired value

    console.log('now profileID:', deviceProfileId);
    // Find the option with the desired value
    var optionToSelect = selected_devProfile.querySelector(`option[value="${deviceProfileId}"]`);

    if (optionToSelect) {
        // If the option exists, set it as selected
        optionToSelect.selected = true;
    }

    // Handle potential errors (from feedback)
    if (!deviceData.name) {
        deviceNameInput.value = ""; // Set empty value if name is missing
    }
    if (!deviceData.description) {
        deviceDescriptionTextarea.value = ""; // Set empty value if description is missing
    }
    if (!message.get_devKey.deviceKeys.nwkKey) {
        appKeyInput.value = ""; // Set empty value if appKey is missing
    }

}
//---------------------------------------------------------------------//
function displayQueuesDevice(dev_queueItems) {
    // Queues tab
    // const queueData = dev_queueItems.resultList;
    // const totalQueue = dev_queueItems.totalCount;
    // console.log('totalQueue:', totalQueue)
    // console.log('queueData[0] confirm:', queueData[0].confirmed)

    const tableBody = document.getElementById("enqueue_data");
    tableBody.innerHTML = '';

    for (const queue of dev_queueItems.resultList) {
        const row = document.createElement("tr");

        // เพิ่ม id ของ Queue
        const idColumn = document.createElement("td");
        idColumn.textContent = queue.id;
        row.appendChild(idColumn);

        // เพิ่มสถานะ Pending, Encrypted และ Confirmed
        for (const key of ["isPending", "isEncrypted", "confirmed"]) {
            const cell = document.createElement("td");
            const icon = document.createElement("i");
            icon.className = queue[key]
                ? "fa-solid fa-check check_icon"
                : "fa-solid fa-xmark xmark_icon";
            cell.appendChild(icon);
            row.appendChild(cell);
        }

        // เพิ่มข้อมูลอื่นๆ
        for (const key of ["fCntDown", "fPort", "data"]) {
            const cell = document.createElement("td");
            switch (key) {
                case "fCntDown":
                    if (queue[key] == 0) {
                        cell.textContent = '';
                    } else {
                        cell.textContent = queue[key];
                    }
                    break;
                case "fPort":
                    cell.textContent = queue[key];
                    break;
                case "data":
                    const base64Data = queue[key];
                    const hexData = b64ToHex(base64Data);
                    cell.textContent = hexData;
                    break;
            }
            row.appendChild(cell);
        }

        // เพิ่มแถวตารางลงใน tbody
        tableBody.appendChild(row);
    }
}
//---------------------------------------------------------------------//
function convertUTCtoThailandTime(utcTimeString) {
    // Create a Date object from the UTC time string
    const utcDate = new Date(utcTimeString);

    // Convert UTC time to Thailand time
    const thailandTime = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000)); // Adding 7 hours for UTC+7

    // Extract Thailand time components
    const day = thailandTime.getUTCDate().toString().padStart(2, '0');
    const month = (thailandTime.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = thailandTime.getUTCFullYear().toString().slice(-2); // Get last 2 digits of the year
    const hours = thailandTime.getUTCHours().toString().padStart(2, '0');
    const minutes = thailandTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = thailandTime.getUTCSeconds().toString().padStart(2, '0');

    // Format the output string
    const thailandTimeString = `${day}:${month}:${year} ${hours}:${minutes}:${seconds}`;

    return thailandTimeString;
}
//---------------------------------------------------------------------//
function displayDeviceEvents(dev_events) {
    const tableBody = document.getElementById("event_data");
    tableBody.innerHTML = '';
    // Ensure dev_events is not empty and has at least one event
    if (dev_events.length === 0) {
        const tableBody = document.getElementById("event_data");
        const newRow = document.createElement("tr");
        const textCell = document.createElement("td");
        textCell.textContent = "No device events to display.";
        newRow.appendChild(textCell);
        tableBody.appendChild(newRow);
        return;
    }

    // Loop through each device event
    dev_events.forEach(data => {
        // Accessing "join" at index 2 of the array
        const actionValue = data.array[2];

        // Accessing the JSON string containing "time"
        const jsonString = data.array[3];

        // Parsing the JSON string to extract "time"
        const parsedJson = JSON.parse(jsonString);
        const timeValue = parsedJson.time;

        // Convert the time value to the desired format
        const thailandTime = convertUTCtoThailandTime(timeValue);

        // Create a new row element
        const newRow = document.createElement("tr");

        // Create a new cell for the time value
        const timeCell = document.createElement("td");
        timeCell.textContent = thailandTime;

        // Create a new cell for the action value (join)
        const actionCell = document.createElement("td");
        // actionCell.textContent = actionValue;

        // Create a button to display full dev_events
        const button = document.createElement("button");
        button.textContent = actionValue;
        button.classList.add("action_btn");
        button.addEventListener("click", function () {
            alert(JSON.stringify(dev_events, null, 2)); // Display dev_events as JSON in an alert
        });

        // Append the button to the action cell
        actionCell.appendChild(button);

        // Append the cells to the new row
        newRow.appendChild(timeCell);
        newRow.appendChild(actionCell);

        // Append the new row to the table body
        const tableBody = document.getElementById("event_data");
        tableBody.appendChild(newRow);
    });
}
//---------------------------------------------------------------------//
function displayDeviceFrames(dev_frames) {
    // LoRaWAN Frames tab
    const tableBody = document.getElementById("frame_data");
    tableBody.innerHTML = '';
    // Ensure dev_frame is not empty and has at least one event
    if (dev_frames.length === 0) {
        const tableBody = document.getElementById("frame_data");
        const newRow = document.createElement("tr");
        const textCell = document.createElement("td");
        textCell.textContent = "No frame to display.";
        newRow.appendChild(textCell);
        tableBody.appendChild(newRow);
        return;
    }

    // Loop through each device event
    dev_frames.forEach((data, index) => {
        // Accessing "join" at index 2 of the array
        const actionValue = data.array[2];

        // Accessing the JSON string containing "time"
        const jsonString = data.array[3];

        // Parsing the JSON string to extract "time"
        const parsedJson = JSON.parse(jsonString);

        // Check if nsTime exists in rx_info array before accessing it
        let nsTime = parsedJson.rx_info && parsedJson.rx_info[0] && parsedJson.rx_info[0].nsTime;

        // Check if nsTime exists and is not null, otherwise use nsTime of the next action
        if (!nsTime && index < dev_frames.length - 1) {
            const nextJsonString = dev_frames[index + 1].array[3];
            const nextParsedJson = JSON.parse(nextJsonString);
            nsTime = nextParsedJson.rx_info && nextParsedJson.rx_info[0] && nextParsedJson.rx_info[0].nsTime;
        }

        // Check if nsTime exists and is not null
        if (nsTime) {
            // Convert the time value to the desired format
            const thailandTime = convertUTCtoThailandTime(nsTime);

            // Create a new row element
            const newRow = document.createElement("tr");

            // Create a new cell for the time value
            const timeCell = document.createElement("td");
            timeCell.textContent = thailandTime;

            // Create a new cell for the action value (join)
            const actionCell = document.createElement("td");
            // actionCell.textContent = actionValue;

            // Create a button to display full dev_events
            const button = document.createElement("button");
            button.textContent = actionValue;
            button.classList.add("action_btn");
            button.addEventListener("click", function () {
                alert(JSON.stringify(dev_frames, null, 2)); // Display dev_events as JSON in an alert
            });

            // Append the button to the action cell
            actionCell.appendChild(button);

            // Append the cells to the new row
            newRow.appendChild(timeCell);
            newRow.appendChild(actionCell);

            // Append the new row to the table body
            const tableBody = document.getElementById("frame_data");
            tableBody.appendChild(newRow);
        } else {
            console.log("nsTime is not available for action:", actionValue);
        }
    });
}
//---------------------------------------------------------------------//
//----------------------------COMMON ZONE------------------------------// 
//---------------------------------------------------------------------// 
function displayChartData(data, chartId, chartLabel, datasetLabel) {
    // แปลง timestamp เป็นวันที่
    const labels = data.timestampsList.map(timestamp => {
        const date = new Date(timestamp.seconds * 1000);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    });

    // แยกค่า rx_count
    const rxCounts = data.datasetsList[0].dataList;

    const ctx = document.getElementById(chartId).getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: datasetLabel,
                data: rxCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Value' // Add label for y-axis
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date' // Add label for x-axis
                    },
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }]
            }
        }
    });
}
//---------------------------------------------------------------------//
async function sendSpecificRequest(tabName) {
    if (tabName === 'Dashboard') {
        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-linkMetric`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                dev_id: localStorage.getItem('dev_id'),
                timeAgo: "1y", // timeAgo: "1y","1m","1d"
                aggregation: "MONTH" // aggregation: "DAY", "HOUR", "MONTH"
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            return;
        }

        displayDashboardDevice(result);
    } else if (tabName === 'Configuration') {
        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                tenant_id: localStorage.getItem('tenant_id'),
                dev_id: localStorage.getItem('dev_id'),
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            return;
        }

        displayConfigurationsDevice(result);
    } else if (tabName === 'Queue') {
        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-queue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                dev_id: localStorage.getItem('dev_id'),
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            return;
        }

        displayQueuesDevice(result);
    } else if (tabName === 'Event') {
        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                dev_id: localStorage.getItem('dev_id'),
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            return;
        }

        displayDeviceEvents(result);
    } else if (tabName === 'LoRaWAN_frame') {
        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/get-frame`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                dev_id: localStorage.getItem('dev_id'),
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            return;
        }

        displayDeviceFrames(result);
    }
}
//---------------------------------------------------------------------//
function b64ToHex(base64String) {
    const raw = atob(base64String);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result.toUpperCase();
}
//---------------------------------------------------------------------//
