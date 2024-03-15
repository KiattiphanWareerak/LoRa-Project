//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
const SERVICE_IP_ADDRESS = "<SERVICE SERVER IP ADDRESS>";
const SERVICE_PORT = "3333";
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    // set default tab (Dashboard of device)
    sessionStorage.setItem('activeTabIndex', 0);
    sessionStorage.setItem('activeTab', 'Dashboard');

    // reset app_name, app_id, dev_name, dev_id before
    // localStorage.setItem('app_id', null);
    // localStorage.setItem('app_name', null);
    // localStorage.setItem('dev_id', null);
    // localStorage.setItem('dev_name', null);

    // Add application button
    const addAppButton = document.getElementById("addAppConfirm");

    const addAppConfirm = async () => {
        let appNameInput = document.getElementById('appNameInput');
        let descriptionInput = document.getElementById('descriptionInput');

        let appNameValue = appNameInput.value.trim();
        let appNameRegex = /^[a-zA-Z0-9_\-@]+$/;

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

            const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/add-application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_token: localStorage.getItem('user_token'),
                    user_un: localStorage.getItem('user_un'),
                    user_id: localStorage.getItem('user_id'),
                    tenant_id: localStorage.getItem('tenant_id'),
                    app_name: appNameValue,
                    app_desc: descriptionValue,
                    app_intg: appIntgInput
                })
            });

            const result = await response.json();
            console.log('Authenticated:\n', result);

            if (result === 'failed') {
                alert('Add application failed.');
            } else {
                alert('Add application has been completed.');

                document.getElementById('app_AddApp').style.display = "none";
                window.location.href = '../htmls/applications.html';
            }
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

    const deleteForm = async () => {
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

        const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/del-application`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_token: localStorage.getItem('user_token'),
                user_un: localStorage.getItem('user_un'),
                user_id: localStorage.getItem('user_id'),
                tenant_id: localStorage.getItem('tenant_id'),
                del_apps: appIDsSelect
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            alert('Delete application failed.');
        } else {
            alert('Delete application has been completed.');

            document.getElementById('app_DelApp').style.display = "none";
            window.location.href = '../htmls/applications.html';
        }
    }

    delAppButton.addEventListener('click', (event) => {
        event.preventDefault();
        deleteList();
    })

    delAppConfirm.addEventListener('click', (event) => {
        event.preventDefault();
        deleteForm();
    })

    // other
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
//---------------------------------------------------------------------//
