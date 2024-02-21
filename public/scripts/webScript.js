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

/*  *   *   *   *   Pop-up Modal Function   *   *   *   *   */
function openModal(Modal) {
  document.getElementById(Modal).style.display = "block";
}

function closeModal(Modal) {
  document.getElementById(Modal).style.display = "none";
}

function nextModal() {
  document.getElementById('dev_AddDevice').style.display = "none";
  document.getElementById('dev_AddAppkey').style.display = "block";
}
/*
// Close the modal if the user clicks outside the modal content
window.addEventListener('click', function (event) {
  var modals = document.querySelectorAll('.form');
  for (var i = 0; i < modals.length; i++) {
      var modal = modals[i];
      if (event.target.closest('.form') !== modal) {
          modal.style.display = "none";
      }
  }
}); */
/*  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   */

/*  *   *   *   *   FAQs Drop-down Function   *   *   *   *   */
const questions = document.querySelectorAll(".faq .question");

questions.forEach((question) => {
  const answer = question.nextElementSibling;

  question.addEventListener("click", () => {
      answer.classList.toggle("active");
  });
});

/*  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   */

/*  *   *   *   * SelectAll-checkbox Function   *   *   *   *   */

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('select-all').addEventListener('click', function () {
      // Get all checkboxes in the tbody
      const checkboxes = document.querySelectorAll('#data-table input[type="checkbox"]');

      // Set the state of all checkboxes to be the same as the "Select All" checkbox
      checkboxes.forEach(checkbox => {
          checkbox.checked = this.checked;
      });
  });
});

//
/*  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   */
