//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    //---------------------------SENDER ZONE---------------------------//
    const socket = new WebSocket('ws://localhost:3001');

    const sendApplicationsListRequest = () => {
        const req = { request: 'dispApp', message: { 
            status: undefined, 
            data:  undefined 
        }};
        socket.send(JSON.stringify(req));
    };

    socket.addEventListener('open', () => {
        // Display applictions
        const currentPath = window.location.pathname;
        const menuApplications = document.getElementById("menu-applications");

        menuApplications.addEventListener('click', (event) => {
            event.preventDefault();
            sendApplicationsListRequest();
        });
        
        if (currentPath.includes('applications.html')) {
            sendApplicationsListRequest();
        }

        // Add application button
        const addAppButton = document.getElementById("addAppConfirm");

        const addAppConfirm = () => {
            let appNameInput = document.getElementById('appNameInput');
            let descriptionInput = document.getElementById('descriptionInput');
            
            let appNameValue = appNameInput.value.trim();
            
            let appNameRegex = /^[a-zA-Z0-9_\-@]+$/;
            
            if (appNameValue === '') {
                alert('Please enter the application name.');
            } else if (!appNameRegex.test(appNameValue)) {
                alert('Please enter the application name in English lowercase-uppercase, numbers 0-9, "_", "-", and "@".');
            } else {
                let descriptionValue = descriptionInput.value.trim();
            
                let addAppData = { app_name: appNameValue, app_desc: descriptionValue };
            
                const req = {
                    request: 'addApp',
                    message: {
                        status: undefined,
                        data: addAppData
                    }
                };
                socket.send(JSON.stringify(req));
            
                appNameInput.value = '';
                descriptionInput.value = '';
                document.getElementById('app_AddApp').style.display = "none";
            }            
        }

        addAppButton.addEventListener('click', (event) => {
            event.preventDefault();
            addAppConfirm();
        });

        // Delete application button
        const delAppButton = document.getElementById('delAppConfirm');

        const deleteForm = () => {
            let appIDs = [];
            for (let i = 0; i < document.querySelectorAll("input[type='checkbox']").length; i++) {
                if (document.querySelectorAll("input[type='checkbox']")[i].checked) {
                    const checkedCheckbox = document.querySelectorAll("input[type='checkbox']")[i];

                    const appIDCell = checkedCheckbox.closest("tr").querySelector("td:nth-child(4)");
              
                    if (appIDCell) {
                      const appID = appIDCell.textContent;
                      appIDs.push(appID);
                    } else {
                      console.error("appID cell not found");
                    }
                }
            }
            let appIDsSelect = appIDs.map((appID) => ({ app_id: appID }));

            const req = { request: 'delApp', message: { 
                status: undefined, 
                data: appIDsSelect 
            }};
            socket.send(JSON.stringify(req));

            document.getElementById('app_DelApp').style.display = "none";
        }

        delAppButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteForm();
        })
    });
    //-------------------------RECEIVER ZONE-------------------------//
    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

<<<<<<< HEAD
        if ( messageFromServer.request === 'dispApp' ) {
            if ( messageFromServer.message.status === 'success' ) {
                displatHeaderAndMiddleTitle();
                displayApplicationsList(messageFromServer.message.data);
            } else {
                alert("Application List failed.");
            }
        } else if ( messageFromServer.request === 'addApp' ) {
            if ( messageFromServer.message.status === 'success' ) {
                alert('Add application has been completed.');
                sendApplicationsListRequest();
            } else {
                alert('Add application failed.');
            }
        } else if ( messageFromServer.request === 'delApp' ) {
            if ( messageFromServer.message.status === 'success' ) {
                alert('Delete application has been completed.');
                sendApplicationsListRequest();
            } else {
                alert('Delete application failed.');
            }
        } else {
            alert("Error 505.");
=======
        if ( messageFromServer.request === 'dispApp' && messageFromServer.message.status === 'success' ) {
            displayApplicationsList(messageFromServer.message.data);
            return;
        } 
        else if ( messageFromServer.request === 'addApp' && messageFromServer.message.status === 'success' ) {
            alert('Add application has been completed.');
            sendApplicationsListRequest();
            return;
        }
        else if ( messageFromServer.request === 'delApp' && messageFromServer.message.status === 'success' ) {
            alert('Delete application has been completed.');
            sendApplicationsListRequest();
            return;
        } else {
            alert("Error");
>>>>>>> 56358410dab45be955c7fcfc4a0dcbf714bbc189
        }
    });    
});
//---------------------------------------------------------------------// 
//---------------------------DISPLAYS ZONE-----------------------------// 
//---------------------------------------------------------------------// 
function displayApplicationsList(items) {
    let tbody = document.getElementById('data-table');

    tbody.innerHTML = '';
    
    let count = 0;
    items.app_list.resultList.forEach(function(item, index) {
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
        appNameLink.setAttribute('app-id', item.id);
        appNameLink.addEventListener('click', function(event) {
            event.preventDefault();
            const socket = new WebSocket('ws://localhost:3001');

            socket.addEventListener('open', () => {
                let appID = this.getAttribute('app-id');
                let appName = item.name;

                const req = { request: 'enterAppId', message: { 
                    status: undefined, 
                    data: { app_id: appID, app_name: appName 
                }}};
                socket.send(JSON.stringify(req));

                window.location.href = 'devices.html';
            });
        });
        appNameLink.textContent = item.name;
        appNameCell.appendChild(appNameLink);
        row.appendChild(appNameCell);

        // Application ID column
        var appIdCell = document.createElement('td');
        appIdCell.textContent = item.id;
        row.appendChild(appIdCell);

        // Description column
        var registeredDeviceCell = document.createElement('td');
        registeredDeviceCell.textContent = item.description;
        row.appendChild(registeredDeviceCell);

        // Append the row to the tbody
        tbody.appendChild(row);
    });
}
//---------------------------------------------------------------------//
function displatHeaderAndMiddleTitle() {
    // Header and Middle title
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newH1Element.textContent = 'Applications';
    newH4Element.innerHTML = `<a href="applications.html" >Applications</a> `;
    let headerTitleDiv = document.querySelector('.header--title');
    let locatedDiv = document.querySelector('.located');
    headerTitleDiv.innerHTML = '';
    locatedDiv.innerHTML = '';
    headerTitleDiv.appendChild(newH1Element);
    locatedDiv.appendChild(newH4Element);
}
//---------------------------------------------------------------------// 
