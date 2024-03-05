//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const applicationSocket = new WebSocket('ws://localhost:3001');
    //---------------------------SENDER ZONE---------------------------//
    applicationSocket.addEventListener('open', () => {
        console.log('WebSocket connection established with WebServer from applications');

        // Add application button
        const addAppButton = document.getElementById("addAppConfirm");

        const addAppConfirm = () => {
            let appNameInput = document.getElementById('appNameInput');
            let descriptionInput = document.getElementById('descriptionInput');
            let appIntgInput = document.getElementById('appIntgInput');

            let appNameValue = appNameInput.value.trim();

            let appNameRegex = /^[a-zA-Z0-9_\-@]+$/;

            if (appNameValue === '') {
                alert('Please enter the application name.');
            } else if (!appNameRegex.test(appNameValue)) {
                alert('Please enter the application name in English lowercase-uppercase, numbers 0-9, "_", "-", and "@".');
            } else {
                let descriptionValue = descriptionInput.value.trim();

                let addAppData = { app_name: appNameValue, app_desc: descriptionValue, app_intg: appIntgInput };

                const req = {
                    request: 'addApp',
                    message: {
                        status: undefined,
                        data: addAppData
                    }
                };
                sendRequset(req);

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

            const req = {
                request: 'delApp', message: {
                    status: undefined,
                    data: appIDsSelect
                }
            };
            sendRequset(req);

            document.getElementById('app_DelApp').style.display = "none";
        }

        delAppButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteForm();
        })
    });
    //-------------------------RECEIVER ZONE-------------------------//
    applicationSocket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if (messageFromServer.request === 'addApp') {
            if (messageFromServer.message.status === 'success') {
                alert('Add application has been completed.');

                window.location.href = 'applications.html';
            } else {
                alert('Add application failed.');
            }
        } else if (messageFromServer.request === 'delApp') {
            if (messageFromServer.message.status === 'success') {
                alert('Delete application has been completed.');

                window.location.href = 'applications.html';
            } else {
                alert('Delete application failed.');
            }
        }
    });

    applicationSocket.addEventListener('error', (event) => {
        console.log('WebSocket error:', event);
    });
    
    applicationSocket.addEventListener('close', (event) => {
        console.log('WebSocket closed:', event);
    });

    function sendRequset(data) {
        if (applicationSocket.readyState === WebSocket.OPEN) {
            applicationSocket.send(JSON.stringify(data));
        } else {
            console.log('WebSocket not ready, message not sent!');
        }
    }
});
//---------------------------------------------------------------------//
