/*  *   *   *   *   Tab Switching Function   *   *   *   *   */
const tags = document.querySelectorAll('[data-tab-target]')

tags.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        target.classList.add('active')
    })
})
// Add this line to trigger the click event for the "Dashboard" button on page load
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.tab_button.active').click();
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
}
/*  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   */


/*  *   *   *   *   Pop-up Modal Function   *   *   *   *   */
function openModal(Modal) {
    document.getElementById(Modal).style.display = "block";
}

function closeModal(Modal) {
    document.getElementById(Modal).style.display = "none";
}
/*  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   */

/*  *   *   *   *   Dropdown (list) Function   *   *   *   *   */
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const list_menu = dropdown.querySelector('.list_menu');
    const options = dropdown.querySelector('.list_menu li');
    const selected = dropdown.querySelector('.selected');

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        list_menu.classList.toggle('list_menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            select.classList.remove('select-click');
            caret.classList.remove('caret-rotate');
            list_menu.classList.remove('list_menu-open');

            options.forEach(option => {
                option.classList.remove('list_menu.active');
            });
            option.classList.add('list_menu.active');
        });
    });
});
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


/*  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   */