//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    //---------------------------SENDER ZONE---------------------------//
    const socket = new WebSocket('ws://localhost:3001');

    const sendDeviceProfilesRequest = () => {
        const req = { request: 'dispDevProfiles', message: { 
            status: undefined, 
            data:  undefined 
        }};
        socket.send(JSON.stringify(req));
    };

    socket.addEventListener('open', () => {
        // Display device profiles
        const currentPath = window.location.pathname;
        const menuApplications = document.getElementById("menu-deviceProfiles");

        menuApplications.addEventListener('click', (event) => {
            event.preventDefault();
            sendDeviceProfilesRequest();
        });
        
        if (currentPath.includes('deviceProfiles.html')) {
            sendDeviceProfilesRequest();
        }

        // Add device profile button

        // Delete application button
    });
    //-------------------------RECEIVER ZONE-------------------------//
    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if ( messageFromServer.request === 'dispDevProfiles' ) {
            if ( messageFromServer.message.status === 'success' ) {

            } else {

            }
        } else if ( messageFromServer.request === 'null' ) {
            if ( messageFromServer.message.status === 'success' ) {

            } else {

            }
        }
        else {
            alert("Error 505.");
        }
    });    
});
//---------------------------------------------------------------------// 
//---------------------------DISPLAYS ZONE-----------------------------// 
//---------------------------------------------------------------------// 
function displayApplicationsList(items) {

}
//---------------------------------------------------------------------//
function displatHeaderAndMiddleTitle() {
    // Header and Middle title

}
//---------------------------------------------------------------------// 
