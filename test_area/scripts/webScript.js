const tags = document.querySelectorAll('[data-tab-target]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        target.classList.add('active')
    })
})




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