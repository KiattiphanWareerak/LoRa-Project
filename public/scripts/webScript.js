

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
  