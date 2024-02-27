//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    // example. dashboard request to service
    // if present tab is dasgboard tab use sendDashboardDeviceRequest()
    sendDashboardDeviceRequest("1y", "MONTH");


});
//-------------------------REQUEST FUNCTIONS---------------------------// 
const sendDashboardDeviceRequest = (timeAgo, aggregation) => {
    // timeAgp: "1y","1m","1d"
    // aggregation: "DAY", "HOUR", "MONTH"
    const req = { request: 'getDashDev', message: { 
        status: undefined, 
        data: { timeAgo: timeAgo, 
            aggregation: aggregation
        }
    }};
    sender_and_reciver_in_device(req);
};
const sendDeviceInfomationsRequest = () => {
    const req = { request: 'getDevInfo', message: { 
        status: undefined, 
        data: undefined 
    }};
    sender_and_reciver_in_device(req);
};
const sendQueuesDeviceRequest = () => {
    const req = { request: 'getDevQueues', message: { 
        status: undefined, 
        data: undefined 
    }};
    sender_and_reciver_in_device(req);
};
const sendEventsDeviceRequest = () => {
    const req = { request: 'getDevEvents', message: { 
        status: undefined, 
        data: undefined 
    }};
    sender_and_reciver_in_device(req);
};
const sendFramesDeviceRequest = () => {
    const req = { request: 'getDevFrames', message: { 
        status: undefined, 
        data: undefined 
    }};
    sender_and_reciver_in_device(req);
};
const sendDeviceConfigConfirmRequest = (data) => {
    // recuit to update device
    // data = {
    //     app_id: String,
    //     dev_name: String,
    //     dev_id: String,
    //     dev_joinEui: String,
    //     dev_desc: String,
    //     dev_devProfId: String,
    //     dev_IsDis: Boolean,
    //     dev_SkFntC: Boolean,
    //     dev_key: String
    // }

    const req = { request: 'postDevConfigConfirm', message: { 
        status: undefined, 
        data: data 
    }};
    sender_and_reciver_in_device(req);
};
//---------------------------------------------------------------------//
//---------------------------WEB SOCKET ZONE---------------------------//
//---------------------------------------------------------------------//
function sender_and_reciver_in_device(req) {
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
          if ( messageFromServer.request === 'enterDevId' || messageFromServer.request === 'getDashDev' ) {
            display_headerAndMiddleTitle_device_configurations(messageFromServer.message.data.dev_config, messageFromServer.message.data.app_name);
            displayDashboardDevice(messageFromServer.message.data.dev_linkMetrics,
                messageFromServer.message.data.dev_config);
          } 
          else if ( messageFromServer.request === 'getDevInfo' ) {
            displayConfigurationsDevice(messageFromServer.message.data.dev_config,
                messageFromServer.message.data.dev_profilesList,
                messageFromServer.message.data.dev_key, 
                messageFromServer.message.data.dev_activation);
          } 
          else if ( messageFromServer.request === 'getDevQueues' ) {
            displayQueuesDevice(messageFromServer.message.data.dev_queueItems);
          } 
          else if ( messageFromServer.request === 'getDevEvents' ) {
            displayDeviceEvents(messageFromServer.message.data.dev_events);
          }
          else if ( messageFromServer.request === 'getDevFrames' ) {
            displayDeviceFrames(messageFromServer.message.data.dev_frames);
          }
          else if ( messageFromServer.request === 'postDevConfigConfirm' ) {
            sendDeviceInfomationsRequest();
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
function display_headerAndMiddleTitle_device_configurations(items, appName) {
    // Header and Middle title
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newH1Element.textContent = items.device.name;
    newH4Element.innerHTML = `</h4><a href="applications.html" >Applications</a>
     > <a href="devices.html" id="appLink">${appName}</a> > <a>${items.device.name}</a></h4>`;
    
    let headerTitleDiv = document.querySelector('.header--title');
    let locatedDiv = document.querySelector('.located');
    locatedDiv.innerHTML = '';
    headerTitleDiv.innerHTML = '';
    
    headerTitleDiv.appendChild(newH1Element);
    locatedDiv.appendChild(newH4Element);
}
function displayDashboardDevice(dev_linkMetrics, dev_config) {
    // Check if dev_linkMetrics is defined
    if (dev_linkMetrics) {
        const received_Data = dev_linkMetrics.rxPackets;
        const RSSI_Data = dev_linkMetrics.gwRssi;
        const SNR_Data = dev_linkMetrics.gwSnr;
        const receivedPerfrequency_Data = dev_linkMetrics.rxPacketsPerFreq;
        const receivedPerDR_Data = dev_linkMetrics.rxPacketsPerDr;
        const Errors_Data = dev_linkMetrics.errors;

        // Now you can proceed with your chart display logic
        // This ensures that the code inside this block won't run if dev_linkMetrics is undefined

        // Call the displayChartData function with the appropriate data
        displayChartData(received_Data, 'receivedChart', 'Received Data', 'rx_count');
        displayChartData(RSSI_Data, 'rssiChart', 'RSSI', 'rssi_strength');
        displayChartData(SNR_Data, 'snrChart', 'SNR', 'snr_strength');
        displayChartData(receivedPerfrequency_Data, 'receivedPerFreqChart', 'Received per Frequency', 'rx_count_per_freq');
        displayChartData(receivedPerDR_Data, 'receivedPerDRChart', 'Received per Data Rate', 'rx_count_per_dr');
        displayChartData(Errors_Data, 'errorsChart', 'Errors', 'error_count');
    } else {
        console.error("dev_linkMetrics is undefined. Cannot display dashboard data.");
        // Optionally, you can handle this case by displaying an error message or taking other actions.
    }
}
function displayConfigurationsDevice(dev_config, dev_profiles, dev_key, dev_activation) {
    // Configurations tab
    let deviceName = document.getElementById("device_Name");
    deviceName.value = items.dev_config.device.name;

}
function displayQueuesDevice(dev_queueItems) {
    // Queues tab

}
function displayDeviceEvents(dev_events) {
    // Events tab

}
function displayDeviceFrames(dev_frames) {
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
