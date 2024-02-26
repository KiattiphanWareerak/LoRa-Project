//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
 document.addEventListener('DOMContentLoaded', () => {
    //---------------------------SENDER ZONE---------------------------//
    const socket = new WebSocket('ws://localhost:3001');

    socket.addEventListener('open', () => {
        const currentPath = window.location.pathname;

        const sendDashboardDeviceRequest = () => {
            const req = { request: 'dispDashDev', message: { 
                status: undefined, 
                data: undefined 
            }};
            socket.send(JSON.stringify(req));
        };

        if (currentPath.includes('devicesConfiguration.html')) {
            sendDashboardDeviceRequest();
        }
    });
    //-------------------------RECEIVER ZONE-------------------------//
    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if (messageFromServer.request === 'enterDevId' || messageFromServer.request === 'dispDashDev') {
            if (messageFromServer.message.status === 'success') {
                display_headerAndMiddleTitle_device_configurations(messageFromServer.message.data.dev_dash, messageFromServer.message.data.app_name);
                displayConfigurationsDevice(messageFromServer.message.data.dev_dash);
                displayDashboardDevice(messageFromServer.message.data.dev_dash, messageFromServer.message.data.dev_linkMetrics);
                displayQueuesDevice(messageFromServer.message.data.dev_dash);
                displayDeviceEvents(messageFromServer.message.data.dev_dash);
                displayDeviceFrames(messageFromServer.message.data.dev_dash);
            } else {
                alert('Get Device has been failed.');
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
function display_headerAndMiddleTitle_device_configurations(items, appName) {
    // Header and Middle title
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newH1Element.textContent = items.dev_config.device.name;
    newH4Element.innerHTML = `</h4><a href="applications.html" >Applications</a>
     > <a href="devices.html" id="appLink">${appName}</a> > <a>${items.dev_config.device.name}</a></h4>`;
    
    let headerTitleDiv = document.querySelector('.header--title');
    let locatedDiv = document.querySelector('.located');
    locatedDiv.innerHTML = '';
    
    headerTitleDiv.appendChild(newH1Element);
    locatedDiv.appendChild(newH4Element);
}
function displayDashboardDevice(items) {
    // Check if dev_linlMetrics is defined
    if (items.dev_linlMetrics) {
        const received_Data = items.dev_linlMetrics.rxPackets;
        const RSSI_Data = items.dev_linlMetrics.gwRssi;
        const SNR_Data = items.dev_linlMetrics.gwSnr;
        const receivedPerfrequency_Data = items.dev_linlMetrics.rxPacketsPerFreq;
        const receivedPerDR_Data = items.dev_linlMetrics.rxPacketsPerDr;
        const Errors_Data = items.dev_linlMetrics.errors;

        // Now you can proceed with your chart display logic
        // This ensures that the code inside this block won't run if dev_linlMetrics is undefined

        // Call the displayChartData function with the appropriate data
        displayChartData(received_Data, 'receivedChart', 'Received Data', 'rx_count');
        displayChartData(RSSI_Data, 'rssiChart', 'RSSI', 'rssi_strength');
        displayChartData(SNR_Data, 'snrChart', 'SNR', 'snr_strength');
        displayChartData(receivedPerfrequency_Data, 'receivedPerFreqChart', 'Received per Frequency', 'rx_count_per_freq');
        displayChartData(receivedPerDR_Data, 'receivedPerDRChart', 'Received per Data Rate', 'rx_count_per_dr');
        displayChartData(Errors_Data, 'errorsChart', 'Errors', 'error_count');
    } else {
        console.error("dev_linlMetrics is undefined. Cannot display dashboard data.");
        // Optionally, you can handle this case by displaying an error message or taking other actions.
    }
}
function displayConfigurationsDevice(items) {
    // Configurations tab
    let deviceName = document.getElementById("device_Name");
    deviceName.value = items.dev_config.device.name;

}
function displayQueuesDevice(items) {
    // Queues tab

}
function displayDeviceEvents(items) {
    // Events tab

}
function displayDeviceFrames(items) {
    // LoRaWAN Frames tab

}
//---------------------------------------------------------------------//
//----------------------------COMMON ZONE------------------------------// 
//---------------------------------------------------------------------// 
function displayChartData(data, chartId, chartLabel, datasetLabel) {
    // Extract timestamps and data from the received data
    const timestamps = data.timestampsList.map(timestamp => timestamp.seconds);
    const dataList = data.datasetsList[0].dataList;

    // Calculate the maximum value in the data list
    const maxDataValue = Math.max(...dataList);

    // Create a context for the canvas
    const ctx = document.getElementById(chartId).getContext('2d');

    // Create a line chart using Chart.js
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: datasetLabel,
                data: dataList,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    max: maxDataValue * 1.1, // Set the maximum value to 10% higher than the maximum data value
                    beginAtZero: true // Start the scale at zero
                },
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}
//---------------------------------------------------------------------// 
