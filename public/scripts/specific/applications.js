//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://202.28.95.234:3001');
    //---------------------------SENDER ZONE---------------------------//
    socket.addEventListener('open', () => {
        console.log('WebSocket connection established with WebServer from applications');

        // Add application button
        const addAppButton = document.getElementById("addAppConfirm");

        const addAppConfirm = () => {
            let appNameInput = document.getElementById('appNameInput');
            let descriptionInput = document.getElementById('descriptionInput');

            let appNameValue = appNameInput.value.trim();
            let appNameRegex = /^[a-zA-Z0-9_\-@]+$/;

            // integration-checkboxes
            var checkboxes = document.querySelectorAll(".integration-checkboxes input[type='checkbox']");

            var isChecked = false;
            checkboxes.forEach(function (checkbox) {
                if (checkbox.checked) {
                    isChecked = true;
                }
            });

            if (!isChecked) {
                alert("Please select at least one integration checkbox, which allows only one selection.");
                return;
            }

            let appIntgInput;
            checkboxes.forEach(function (checkbox) {
                if (checkbox.checked) {
                    if (checkbox.id === "influxDB") {
                        console.log("InfluxDB checkbox is checked!");
                        appIntgInput = 'influxDB';
                    } else {
                        console.log("Other checkbox is checked!");
                        appIntgInput = 'other';
                    }
                }
            });

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
                socket.send(JSON.stringify(data));

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
        const delAppButton = document.getElementById('deleteAppButton');
        const delAppConfirm = document.getElementById('delAppConfirm');

        const deleteList = () => {
            let selectedAppNames = [];
            for (let i = 0; i < document.querySelectorAll("input[type='checkbox']").length; i++) {
                if (document.querySelectorAll("input[type='checkbox']")[i].checked) {
                    const checkedCheckbox = document.querySelectorAll("input[type='checkbox']")[i];

                    const appNameCell = checkedCheckbox.closest("tr").querySelector("td:nth-child(3)");

                    if (appNameCell) {
                        const appName = appNameCell.textContent;
                        selectedAppNames.push(appName);
                    } else {
                        console.error("appName cell not found");
                    }
                }
            }

            const deleteSelectedTBody = document.getElementById('delete-selected');
            deleteSelectedTBody.innerHTML = "";
            selectedAppNames.forEach(function (appName) {
                const row = document.createElement('tr');
                const appNameCell = document.createElement('td');
                appNameCell.textContent = appName;
                row.appendChild(appNameCell);
                deleteSelectedTBody.appendChild(row);
            });
        }

        const deleteForm = () => {
            let checkedCount = 0;
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

                    checkedCount++;
                }
            }
            if (checkedCount === 0) {
                alert("Please select a application to delete.");
                return;
            }

            let appIDsSelect = appIDs.map((appID) => ({ app_id: appID }));

            const req = {
                request: 'delApp', message: {
                    status: undefined,
                    data: appIDsSelect
                }
            };
            socket.send(JSON.stringify(data));

            document.getElementById('app_DelApp').style.display = "none";
        }

        delAppButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteList();
        })

        delAppConfirm.addEventListener('click', (event) => {
            event.preventDefault();
            deleteForm();
        })
    });
    //-------------------------RECEIVER ZONE-------------------------//
    socket.addEventListener('message', (event) => {
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

    socket.addEventListener('error', (event) => {
        console.log('WebSocket error:', event);
    });

    socket.addEventListener('close', (event) => {
        console.log('WebSocket closed:', event);
    });
});
//---------------------------------------------------------------------//
document.addEventListener("DOMContentLoaded", function () {
    var integrationCheckboxes = document.querySelectorAll('.integration-checkboxes input[type="checkbox"]');

    integrationCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                integrationCheckboxes.forEach(function (otherCheckbox) {
                    if (otherCheckbox !== checkbox) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });
});
