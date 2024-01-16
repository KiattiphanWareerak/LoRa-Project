//---------------------------------------------------------------------// 
//------------------------------EVENTS---------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3001');

    socket.addEventListener('open', () => {
        const currentPath = window.location.pathname;

        const sendDashboardDeviceRequest = () => {
            const message = { status: 'displayRefreshDashDevice', data: 'Dashborad Device Request.' };
            socket.send(JSON.stringify(message));
        };

        if (currentPath.includes('devicesConfiguration.html')) {
            sendDashboardDeviceRequest();
        }
    });

    socket.addEventListener('message', (event) => {
        try {
            const messageFromServer = JSON.parse(event.data);
            console.log('Message from server:', messageFromServer);

            if (messageFromServer.status === 'dashDeviceSuccess') {
                console.log('Request compleled.');
                displayDashboardDevice(messageFromServer.message, messageFromServer.app_name, 
                    messageFromServer.dev_name);
            } else {
                console.log('Request failed, pls try again.');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });    
});
//---------------------------------------------------------------------// 
//-----------------------------FUNCTIONS-------------------------------// 
//---------------------------------------------------------------------// 
function displayDashboardDevice(items, app_name, dev_name) {
    // tbody.innerHTML = '';

    // Header and Middle title
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newH1Element.textContent = dev_name;
    newH4Element.innerHTML = `</h4><a href="applications.html" >Applications</a>
     > <a href="devices.html" id="appLink">${app_name}</a> > <a>${dev_name}</a></h4>`;
    
    let headerTitleDiv = document.querySelector('.header--title');
    let locatedDiv = document.querySelector('.located');
    locatedDiv.innerHTML = '';
    
    headerTitleDiv.appendChild(newH1Element);
    locatedDiv.appendChild(newH4Element);
}
//---------------------------------------------------------------------//
