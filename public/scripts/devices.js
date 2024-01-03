//---------------------------------------------------------------------// 
//------------------------------EVENTS---------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.addEventListener('open', () => {
        const currentPath = window.location.pathname;

        const sendDevicesListRequest = () => {
            const message = { status: 'displayRefreshDevices', message: 'Deivces List Request.' };
            socket.send(JSON.stringify(message));
        };

        if (currentPath.includes('devices.html')) {
            sendDevicesListRequest();
        }
    });

    socket.addEventListener('message', (event) => {
        try {
            const messageFromServer = JSON.parse(event.data);
            console.log('Message from server:', messageFromServer);

            if (messageFromServer.status === 'devsListSuccess') {
                console.log('Request compleled.');
                displayDevicesList(messageFromServer.message, 
                    messageFromServer.app_id, messageFromServer.app_name);
            } else {
                console.log('Request failed, pls try again.');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });    
});
//---------------------------------------------------------------------//
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
}
//---------------------------------------------------------------------// 
//-----------------------------FUNCTIONS-------------------------------// 
//---------------------------------------------------------------------// 
function displayDevicesList(items, appID, appName) {
    let tbody = document.getElementById('app-table-devices');

    // tbody.innerHTML = '';

    // Header title
    let newH1Element = document.createElement('h1');
    let newH4Element = document.createElement('h4');
    newH1Element.textContent = appName;
    newH4Element.innerHTML = `> <a>${appName}</a></h4>`;
    let headerTitleDiv = document.querySelector('.header--title');
    let locatedDiv = document.querySelector('.located');
    headerTitleDiv.appendChild(newH1Element);
    locatedDiv.appendChild(newH4Element);

    let count = 0;
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
        
        // Device name column with a link
        var devNameCell = document.createElement('td');
        var devNameLink = document.createElement('a');
        devNameLink.href = 'javascript:void(0)';
        devNameLink.setAttribute('dev-id', item.dev_id);
        devNameLink.addEventListener('click', function(event) {
            event.preventDefault();
            const socket = new WebSocket('ws://localhost:3000');

            socket.addEventListener('open', () => {
                let devId = this.getAttribute('dev-id');
                let devName = item.dev_name;
                const message = { status: 'devNameClickRequest', 
                message: { dev_id: devId, dev_name: devName }};
                socket.send(JSON.stringify(message));

                window.location.href = 'devicesConfiguration.html';
            });
        });
        devNameLink.textContent = item.dev_name;
        devNameCell.appendChild(devNameLink);
        row.appendChild(devNameCell);
        
        // Deivce ID column
        var devIdCell = document.createElement('td');
        devIdCell.textContent = item.dev_id;
        row.appendChild(devIdCell);
        
        // Last Seen column
        var lastSeenCell = document.createElement('td');
        lastSeenCell.textContent = formatLastSeen(item.last_seen);
        row.appendChild(lastSeenCell);
        
        // Append the row to the tbody
        tbody.appendChild(row);
    });
}
//---------------------------------------------------------------------//
function formatLastSeen(items) {
if (!items) {
  return 'never';
}
  
var lastSeenDate = new Date(items);
var formattedDate = lastSeenDate.toLocaleTimeString('en-US', { hour12: false }) + ' ' +
                    lastSeenDate.toLocaleDateString('en-US');
return formattedDate;
}
//---------------------------------------------------------------------//
