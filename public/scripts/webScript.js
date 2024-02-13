document.addEventListener('DOMContentLoaded', function () {
    // Check if there's a stored active tab index
    const activeTabIndex = sessionStorage.getItem('activeTabIndex');
    // If there's a stored active tab index, set the corresponding tab as active
    if (activeTabIndex !== null) {
        const activeTabButton = document.querySelectorAll('.tab_button')[activeTabIndex];
        activeTabButton.classList.add('active');
        const tabName = activeTabButton.getAttribute('onclick').match(/'(.*?)'/)[1];
        document.getElementById(tabName).classList.add('active');
        // Adjust the active line position
        const activeLine = document.querySelector(".active_line");
        activeLine.style.left = activeTabButton.offsetLeft + "px";
        activeLine.style.width = activeTabButton.offsetWidth + "px";
    } else {
        // If no stored active tab index, default to the "Dashboard" tab
        document.querySelector('.tab_button.active').click();
    }

    const data = {
        name: 'Received',
        timestampsList: [
          { seconds: 1693501200, nanos: 0 },
          { seconds: 1696093200, nanos: 0 },
          { seconds: 1698771600, nanos: 0 },
          { seconds: 1701363600, nanos: 0 },
          { seconds: 1704042000, nanos: 0 }
        ],
        datasetsList: [{ label: 'rx_count', dataList: [1, 1821, 0, 0, 0] }],
        kind: 1
      };
      
      // Extract timestamps and data from the received data
      const timestamps = data.timestampsList.map(timestamp => timestamp.seconds);
      const dataList = data.datasetsList[0].dataList;
      
      // Calculate the maximum value in the data list
      const maxDataValue = Math.max(...dataList);
      
      // Create a context for the canvas
      const ctx = document.getElementById('receivedChart').getContext('2d');
      
      // Create a line chart using Chart.js
      const receivedGraph = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timestamps,
          datasets: [{
            label: data.datasetsList[0].label,
            data: dataList,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }]
        },
        options: {
            scales: {
              y: {
                type: 'linear',
                position: 'left',
                max: Math.max(...dataList) * 1.1, // Set the maximum value to 10% higher than the maximum data value
                beginAtZero: true // Start the scale at zero
              },
              x: {
                type: 'linear',
                position: 'bottom'
              }
            }
          }
          
      });      
});

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

    // Store the active tab index in sessionStorage
    const activeTabIndex = Array.from(tab_button).indexOf(evt.currentTarget);
    sessionStorage.setItem('activeTabIndex', activeTabIndex);
}
