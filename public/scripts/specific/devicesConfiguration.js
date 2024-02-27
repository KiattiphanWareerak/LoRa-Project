//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const activeTabIndex = sessionStorage.getItem('activeTabIndex');

    const setActiveTab = (tabButton) => {
        tabButton.classList.add('active');
        const tabName = tabButton.getAttribute('onclick').match(/'(.*?)'/)[1];
        document.getElementById(tabName).classList.add('active');
        const activeLine = document.querySelector(".active_line");
        activeLine.style.left = tabButton.offsetLeft + "px";
        activeLine.style.width = tabButton.offsetWidth + "px";
    };

    if (activeTabIndex !== null) {
        const activeTabButton = document.querySelectorAll('.tab_button')[activeTabIndex];
        setActiveTab(activeTabButton);
    } else {
        document.querySelector('.tab_button.active').click();
    }

    // Set up event listeners for tab clicks
    const tabButtons = document.querySelectorAll('.tab_button');
    tabButtons.forEach(tabButton => {
        tabButton.addEventListener('click', () => {
            setActiveTab(tabButton);
            // Send request specific to the active tab
            if (tabButton.getAttribute('onclick').includes('Dashboard')) {
                sendDashboardDeviceRequest("1y", "MONTH");
            } else if (tabButton.getAttribute('onclick').includes('Configuration')) {
                console.log('hi config')
                sendDeviceInfomationsRequest()
            } else if (tabButton.getAttribute('onclick').includes('Queue')) {
                sendQueuesDeviceRequest();
            } else if (tabButton.getAttribute('onclick').includes('Event')) {
                sendEventsDeviceRequest();
            } else if (tabButton.getAttribute('onclick').includes('LoRaWAN_frame')) {
                sendFramesDeviceRequest();
            }
        });
    });
});
//-------------------------REQUEST FUNCTIONS---------------------------// 
const sendDashboardDeviceRequest = (timeAgo, aggregation) => {
    // timeAgo: "1y","1m","1d"
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
            display_headerAndMiddleTitle_device_configurations(messageFromServer.message.data.dev_config.device.name, messageFromServer.message.data.app_name);
            displayDashboardDevice(messageFromServer.message.data.dev_linkMetrics,
                messageFromServer.message.data.dev_config);
          } 
          else if ( messageFromServer.request === 'getDevInfo' ) {
            display_headerAndMiddleTitle_device_configurations(messageFromServer.message.data.dev_config.device.name, messageFromServer.message.data.app_name);
            displayConfigurationsDevice(messageFromServer.message.data.dev_config,
                messageFromServer.message.data.dev_profilesList,
                messageFromServer.message.data.dev_key, 
                messageFromServer.message.data.dev_activation);
          } 
          else if ( messageFromServer.request === 'getDevQueues' ) {
            display_headerAndMiddleTitle_device_configurations(messageFromServer.message.data.dev_name, messageFromServer.message.data.app_name);
            displayQueuesDevice(messageFromServer.message.data.dev_queueItems);
          } 
          else if ( messageFromServer.request === 'getDevEvents' ) {
            display_headerAndMiddleTitle_device_configurations(messageFromServer.message.data.dev_name, messageFromServer.message.data.app_name);
            displayDeviceEvents(messageFromServer.message.data.dev_events);
          }
          else if ( messageFromServer.request === 'getDevFrames' ) {
            display_headerAndMiddleTitle_device_configurations(messageFromServer.message.data.dev_name, messageFromServer.message.data.app_name);
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
function display_headerAndMiddleTitle_device_configurations(devName, appName) {
    // Header and Middle title
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newH1Element.textContent = devName;
    newH4Element.innerHTML = `</h4><a href="applications.html" >Applications</a>
     > <a href="devices.html" id="appLink">${appName}</a> > <a>${devName}</a></h4>`;
    
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

function displayConfigurationsDevice(dev_config, dev_profiles, dev_key, dev_activation) {
    // Configurations tab


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
