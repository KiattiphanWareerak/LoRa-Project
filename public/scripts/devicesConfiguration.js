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
                displayConfigurationsDevice(messageFromServer.message.data.dev_dash);
                displayDashboardDevice(messageFromServer.message.data.dev_dash);
                displayHeaderAndMiddleTitle(messageFromServer.message.data.dev_dash, messageFromServer.message.data.app_name);
                displayQueuesDevice(messageFromServer.message.data.dev_dash);
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
function displayConfigurationsDevice(items) {
    // Configurations tab
    let deviceName = document.getElementById("device_Name");
    deviceName.value = items.dev_config.device.name;

}
//---------------------------------------------------------------------//
function displayDashboardDevice(items) {
    // Dashboard tab

}
//---------------------------------------------------------------------//
function displayHeaderAndMiddleTitle(items, appName) {
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
//---------------------------------------------------------------------//
function displayQueuesDevice(items) {
    // Queues tab

}
//---------------------------------------------------------------------//
