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
                displayDashboardDevice(messageFromServer.message.data.dev_dash, messageFromServer.message.data.app_name);
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
function displayDashboardDevice(values, appName) {
    // tbody.innerHTML = '';

    displatHeaderAndMiddleTitle(values, appName);

    // Dashboard tab

    // Configuration tab
    let dasd = document.getElementById("Description");
    dasd.textContent = values.dev_config.device.description;

    // Queue tab

    // Events tab

    // LoRaWAN frame tab

}
//---------------------------------------------------------------------//
function displatHeaderAndMiddleTitle(items, appName) {
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
