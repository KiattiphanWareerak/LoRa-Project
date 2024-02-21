//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    //---------------------------SENDER ZONE---------------------------//
    const socket = new WebSocket('ws://localhost:3001');

    socket.addEventListener('open', () => {
        // Display device profiles
        const currentPath = window.location.pathname;
        const menuApplications = document.getElementById("menu-mainDashboard");

        menuApplications.addEventListener('click', (event) => {
            event.preventDefault();
            
            const req = { request: 'dispMainDash', message: { 
                status: undefined, 
                data:  undefined 
            }};
            socket.send(JSON.stringify(req));
        });
        
        if (currentPath.includes('dashboard.html')) {
            const req = { request: 'dispMainDash', message: { 
                status: undefined, 
                data:  undefined 
            }};
            socket.send(JSON.stringify(req));
        }
    });
    //-------------------------RECEIVER ZONE-------------------------//
    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if ( messageFromServer.request === 'dispMainDash' ) {
            if ( messageFromServer.message.status === 'success' ) {
                displayMainDashboard(messageFromServer.message.data);

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
function displayMainDashboard(items) {
   
}
//---------------------------------------------------------------------//
//---------------------------FUNCTIONS ZONE----------------------------// 
//---------------------------------------------------------------------// 

//---------------------------------------------------------------------// 
