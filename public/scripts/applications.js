//---------------------------------------------------------------------// 
//------------------------------EVENTS---------------------------------// 
//---------------------------------------------------------------------// 
document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.addEventListener('open', () => {
        const currentPath = window.location.pathname;
        const menuApplications = document.getElementById("menu-applications");

        const sendApplicationsListRequest = () => {
            const message = { status: 'displayApplications', message: 'Applications List Request.' };
            socket.send(JSON.stringify(message));
        };

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

            if (messageFromServer.status === 'appsListSuccess') {
                console.log('Request compleled.');
                displayApplicationsList(messageFromServer.message);
            } else {
                console.log('Request failed, pls try again.');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });    
});
//---------------------------------------------------------------------// 
const tags = document.querySelectorAll('[data-tab-target]')

// tabs.forEach(tab => {
//     tab.addEventListener('click', () => {
//         const target = document.querySelector(tab.dataset.tabTarget)
//         target.classList.add('active')
//     })
// })

function openModal() {
    document.getElementById("addModal").style.display = "block";
}

function closeModal() {
    document.getElementById("addModal").style.display = "none";
}

// Close the modal if the user clicks outside the modal content
window.onclick = function (event) {
    var modal = document.getElementById("addModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function opentab(evt, tabName) {
    // Declare all variables
    var i, tab_content, tab_button, active_line;
  
    // Get all elements with class="tab_content" and hide them
    tab_content = document.getElementsByClassName("tab_content");
    for (i = 0; i < tab_content.length; i++) {
      tab_content[i].style.display = "none";
    }
  
    // Get all elements with class="tab_button" and remove the class "active"
    tab_button = document.getElementsByClassName("tab_button");
    for (i = 0; i < tab_button.length; i++) {
        tab_button[i].className = tab_button[i].className.replace(" active", "");
    }

    // Move the line to the position of the active tab button
    active_line = document.querySelector(".active_line");
    active_line.style.left = evt.currentTarget.offsetLeft + "px";
    active_line.style.width = evt.currentTarget.offsetWidth + "px";

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }
//---------------------------------------------------------------------// 
//-----------------------------FUNCTIONS-------------------------------// 
//---------------------------------------------------------------------// 
function displayApplicationsList(items) {
    let tbody = document.getElementById('app-table-apps');

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
