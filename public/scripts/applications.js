//---------------------------------------------------------------------// 
//------------------------------EVENTS---------------------------------// 
//---------------------------------------------------------------------// 
document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.addEventListener('open', () => {
        const currentPath = window.location.pathname;
        const menuApplications = document.getElementById("menu-applications");
        const submitButton = document.getElementById("submitForm");

        const submitForm = () => {
            let appNameInput = document.getElementById('appNameInput');
            let descriptionInput = document.getElementById('descriptionInput');
            
            let appNameValue = appNameInput.value;
            let descriptionValue = descriptionInput.value;
            let message = {app_name: appNameValue, description: descriptionValue};
    
            const req = { status: 'addAppReq', message: message };
            socket.send(JSON.stringify(req));

            appNameInput.value = '';
            descriptionInput.value = '';
            document.getElementById('app_AddApp').style.display = "none";
        }
        const sendApplicationsListRequest = () => {
            const message = { status: 'displayApplications', message: 'Applications List Request.' };
            socket.send(JSON.stringify(message));
        };

        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            submitForm();
        });
        menuApplications.addEventListener('click', (event) => {
            event.preventDefault();
            sendApplicationsListRequest();
        });
        if (currentPath.includes('applications.html')) {
            sendApplicationsListRequest();
        }
    });

    socket.addEventListener('message', (event) => {
        try {
            const messageFromServer = JSON.parse(event.data);
            console.log('Message from server:', messageFromServer);

            if ( messageFromServer.status === 'appsListSuccess' ) {
                console.log('Request compleled.');
                displayApplicationsList(messageFromServer.message);
            } else if ( messageFromServer.status === 'addAppReqSuccess' ) {
                alert('Add Application Compleled!');
            } 
            else {
                console.log('Request failed, pls try again.');
            }
        } catch (error) {
            console.log('Error, pls try again.');
        }
    });    
});
//---------------------------------------------------------------------// 
//-----------------------------FUNCTIONS-------------------------------// 
//---------------------------------------------------------------------// 
function displayApplicationsList(items) {
    let tbody = document.getElementById('data-table');

    tbody.innerHTML = '';

    let count = 0;
    // Loop through the items and append rows to the tbody
    items.forEach(function(item, index) {
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

        // Application name column with a link
        var appNameCell = document.createElement('td');
        var appNameLink = document.createElement('a');
        appNameLink.href = 'javascript:void(0)';
        // Add click event listener to appNameLink
        appNameLink.setAttribute('app-id', item.app_id);
        appNameLink.addEventListener('click', function(event) {
            event.preventDefault();
            const socket = new WebSocket('ws://localhost:3000');

            socket.addEventListener('open', () => {
                let appID = this.getAttribute('app-id');
                let appName = item.app_name;
                const message = { status: 'appIdClickRequest', message: { app_id: appID, app_name: appName } };
                socket.send(JSON.stringify(message));

                window.location.href = 'devices.html';
            });
        });
        appNameLink.textContent = item.app_name;
        appNameCell.appendChild(appNameLink);
        row.appendChild(appNameCell);

        // Application ID column
        var appIdCell = document.createElement('td');
        appIdCell.textContent = item.app_id;
        row.appendChild(appIdCell);

        // Number of registered devices column
        var registeredDeviceCell = document.createElement('td');
        registeredDeviceCell.textContent = item.app_num;
        row.appendChild(registeredDeviceCell);

        // Append the row to the tbody
        tbody.appendChild(row);
    });
}
//---------------------------------------------------------------------//
