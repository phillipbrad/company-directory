/**
 * Global state variables
 */
var departments = [];
var locations = [];
var personnelData = [];
let locationNameToDelete = "";

/**
 * Initialize the application 
 * Fetches and populates all personnel, departments and locations data
 */
$(document).ready(function () {
  getAll();
  getAllDepartments();
  getAllLocations();
});

/**
 * Fetches and displays all personnel data
 * Makes an AJAX call to retrieve personnel information
 * Updates the personnel table with the retrieved data
 */
function getAll() {
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {

        personnelData = result.data;
        renderPersonnelTable(personnelData);
      } else {
        alert("Failed to fetch personnel data. Please try again later.");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX Error:", textStatus, errorThrown);
      alert("An error occurred while fetching personnel data. Please try again later.");
    }
  });
}

/**
 * Fetches and displays all department data
 * Makes an AJAX call to retrieve department information
 * Updates the department table with the retrieved data
 */
function getAllDepartments() {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        departments = result.data;
        renderDepartmentTable(departments);
      } else {
        console.error("Unexpected result code:", resultCode);
        alert("Failed to fetch department data. Please try again later.");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX Error:", textStatus, errorThrown);
      alert("An error occurred while fetching department data. Please try again later.");
    }
  });
}

/**
 * Fetches and displays all location data
 * Makes an AJAX call to retrieve locations information
 * Updates the location table with the retrieved data
 */
function getAllLocations() {
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    success: function (result) {
      var resultCode = result.status.code;
      if (resultCode == 200) {
        locations = result.data;
        renderLocationTable(locations);
      } else {
        console.warn("Unexpected result code:", resultCode);
        alert("Failed to fetch location data. Please try again later.");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX Error:", textStatus, errorThrown);
      alert("An error occurred while fetching location data. Please try again later.");
    }
  });
}

/**
 * Search functionality for personnel, departments, and locations
 * Filters data based on user input and updates the respective tables
 */
$("#searchInp").on("keyup", function () {
  const searchTerm = $(this).val().trim().toLowerCase();

  if (!searchTerm) {
    renderPersonnelTable(personnelData);
    renderDepartmentTable(departments);
    renderLocationTable(locations);
    return;
  }

  // Filter departments 
  const filteredDepartments = departments.filter(dept =>
    ((dept.departmentName || '').toLowerCase().includes(searchTerm)) ||
    (dept.locationName && dept.locationName.toLowerCase().includes(searchTerm))
  );
  renderDepartmentTable(filteredDepartments);

  // Filter locations 
  const filteredLocations = locations.filter(loc =>
    loc.name && loc.name.toLowerCase().includes(searchTerm)
  );
  renderLocationTable(filteredLocations);

  // Server-side search for personnel 
  $.ajax({
    url: "libs/php/searchAll.php",
    type: "POST",
    dataType: "json",
    data: { txt: searchTerm },
    success: function (result) {
      if (result.status.code == 200) {
        renderPersonnelTable(result.data.found);
      }
    },
    error: function () {
      alert("An error occurred while searching. Please try again later.");
    }
  });
});

$("#refreshBtn").click(function () {
  // Clear search input
  $("#searchInp").val('');
  $(this).removeClass("active");
  if ($("#personnelBtn").hasClass("active")) {
    // Refresh personnel table
    getAll();
  } else if ($("#departmentsBtn").hasClass("active")) {
    // Refresh department table
    getAllDepartments();
  } else if ($("#locationsBtn").hasClass("active")) {
    // Refresh location table
    getAllLocations();
  }
});

//---------------------*---------------------BUTTONS-----------------------------*-------------------------

// filter only on personnelBtn
$("#personnelBtn").click(function () {
  $("#filterBtn").prop("disabled", false);
});
$("#departmentsBtn, #locationsBtn").click(function () {
  $("#filterBtn").prop("disabled", true);
});

// Filter button click
$("#filterBtn").click(function () {
  if (!$("#personnelBtn").hasClass("active")) return;
  new bootstrap.Modal(document.getElementById("filterModal")).show();
});

// store current values
$("#filterModal").on("show.bs.modal", function () {
  
  var currentfilterDepartmentSelect = $('#filterDepartment').val();
  var currentfilterLocationSelect   = $('#filterLocation').val();
  

  // Clear and rebuild department select
  var deptSel = $('#filterDepartment')
    .empty()
    .append('<option value="">All</option>');
  departments.forEach(function (d) {
    deptSel.append(
      `<option value="${d.departmentName}">${d.departmentName}</option>`
    );
  });

  // Clear and rebuild location select
  var locSel = $('#filterLocation')
    .empty()
    .append('<option value="">All</option>');
  locations.forEach(function (l) {
    locSel.append(`<option value="${l.name}">${l.name}</option>`);
  });

  // restore values
  $('#filterDepartment').val(currentfilterDepartmentSelect);
  $('#filterLocation').val(currentfilterLocationSelect);
});

function applyFilter() {
  var selDept = $('#filterDepartment').val();
  var selLoc  = $('#filterLocation').val();

  var filtered = personnelData.filter(function (person) {
    if (selDept) return person.departmentName === selDept;
    if (selLoc ) return person.locationName   === selLoc;
    return true;
  });
  renderPersonnelTable(filtered);
}

$('#filterDepartment').on('change', function () {
  $('#filterLocation').val('');
  applyFilter();
});
$('#filterLocation').on('change', function () {
  $('#filterDepartment').val('');
  applyFilter();
});



// Filter form submit
$("#filterForm").on("submit", function (e) {
  e.preventDefault();

  if (!$("#personnelBtn").hasClass("active")) return;

  const selectedDepartment = $("#filterDepartment").val();
  const selectedLocation = $("#filterLocation").val();

  const filteredPersonnel = personnelData.filter(person => {
    if (selectedDepartment) {
      return person.departmentName === selectedDepartment;
    }
    if (selectedLocation) {
      return person.locationName === selectedLocation;
    }
    return true;
  });
  renderPersonnelTable(filteredPersonnel);

  bootstrap.Modal.getOrCreateInstance(document.getElementById("filterModal")).hide();
});


//---------------------*---------------------ADD BUTTON FUNCTIONALITY-----------------------------*-------------------------

// Get the active tab
function getActiveTab() {
  if ($("#personnelBtn").hasClass("active")) return "personnel";
  if ($("#departmentsBtn").hasClass("active")) return "departments";
  if ($("#locationsBtn").hasClass("active")) return "locations";
  return null;
}

// Main Add Button Handler
$("#addBtn").on("click", function () {
  const tab = getActiveTab();
  if (tab === "personnel") {
    showAddPersonnelModal();
  } else if (tab === "departments") {
    showAddDepartmentModal();
  } else if (tab === "locations") {
    showAddLocationModal();
  }
});

// -------------------- ADD PERSONNEL --------------------
$('#addPersonnelModal').on('show.bs.modal', function () {
  const select = document.getElementById('addPersonnelDepartment');
  select.innerHTML = '';
  departments.forEach(dept => {
    const option = document.createElement('option');
    option.value = dept.id;
    option.textContent = dept.departmentName;
    select.appendChild(option);
  });
});
function showAddPersonnelModal() {
   bootstrap.Modal.getOrCreateInstance(document.getElementById('addPersonnelModal')).show();
  };
 


$("#addPersonnelForm").on("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const newPerson = {
    firstName: form.querySelector('#addPersonnelFirstName').value.trim(),
    lastName: form.querySelector('#addPersonnelLastName').value.trim(),
    jobTitle: form.querySelector('#addPersonnelJobTitle').value.trim(),
    email: form.querySelector('#addPersonnelEmailAddress').value.trim(),
    departmentID: form.querySelector('#addPersonnelDepartment').value
  };

  const duplicate = personnelData.some(person =>
    person.email.toLowerCase().trim() === newPerson.email.toLowerCase()
  );
  if (duplicate) {
    alert("A personnel with this email already exists.");
    return;
  }
  $.ajax({
    url: "libs/php/insertPersonnel.php",
    type: "POST",
    dataType: "json",
    data: newPerson,
    success: function (result) {
      if (result.status.code == 200) {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('addPersonnelModal')).hide();
        document.getElementById('added').textContent = newPerson.firstName + ' ' + newPerson.lastName;
        const successMdl = document.getElementById('SuccessModal');
        const successModal = new bootstrap.Modal(successMdl);
        successModal.show();
        getAll();
      } else {
        alert("Failed to add personnel.");
      }
    },
    error: function () {
      alert("Error occurred while adding personnel.");
    }
  });
});

$('#addPersonnelModal').on('hidden.bs.modal', function () {
  $('#addPersonnelForm')[0].reset();
  $('#addPersonnelDepartment').empty();
});

// -------------------- ADD DEPARTMENT --------------------

$('#addDepartmentModal').on('show.bs.modal', function () {
  const select = document.getElementById('addDepartmentLocation');
  select.innerHTML = '';
  locations.forEach(loc => {
    const option = document.createElement('option');
    option.value = loc.id;
    option.textContent = loc.name;
    select.appendChild(option);
  });
});
function showAddDepartmentModal() {
  bootstrap.Modal.getOrCreateInstance(document.getElementById('addDepartmentModal')).show();
}

$("#addDepartmentForm").on("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const newDept = {
    name: form.querySelector('#addDepartmentName').value.trim(),
    locationID: form.querySelector('#addDepartmentLocation').value
  };
  const duplicate = departments.some(dept =>
    dept.departmentName.toLowerCase().trim() === newDept.name.toLowerCase()
  );
  if (duplicate) {
    alert("A department with this name already exists.");
    return;
  }
  $.ajax({
    url: "libs/php/insertDepartment.php",
    type: "POST",
    dataType: "json",
    data: newDept,
    success: function (result) {
      if (result.status.code == 200) {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('addDepartmentModal')).hide();
        document.getElementById('added').textContent = ' department ' + newDept.name;
        const successMdl = document.getElementById('SuccessModal');
        const successModal = new bootstrap.Modal(successMdl);
        successModal.show();
        getAllDepartments();
      } else {
        alert("Failed to add department: " + result.status.description);
      }
    },
    error: function () {
      alert("Error occurred while adding department.");
    }
  });
});

$('#addDepartmentModal').on('hidden.bs.modal', function () {
  $('#addDepartmentForm')[0].reset();
  $('#addDepartmentLocation').empty();
});

// -------------------- ADD LOCATION --------------------
function showAddLocationModal() {
  bootstrap.Modal.getOrCreateInstance(document.getElementById('addLocationModal')).show();
}

$("#addLocationForm").on("submit", function (e) {
  e.preventDefault();
  const locationName = $("#addLocation").val().trim();
  const duplicate = locations.some(loc =>
    loc.name.toLowerCase().trim() === locationName.toLowerCase()
  );
  if (duplicate) {
    alert("A location with this name already exists.");
    return;
  }
  $.ajax({
    url: "libs/php/insertLocation.php",
    type: "POST",
    dataType: "json",
    data: { name: locationName },
    success: function (result) {
      if (result.status.code == 200) {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('addLocationModal')).hide();
        document.getElementById('added').textContent = locationName;
        bootstrap.Modal.getOrCreateInstance(document.getElementById('SuccessModal')).show();
        getAllLocations();
      } else {
        alert("Failed to add location: " + result.status.description);
      }
    },
    error: function () {
      alert("Error occurred while adding location.");
    }
  });
});

$('#addLocationModal').on('hidden.bs.modal', function () {
  $('#addLocationForm')[0].reset();
});

$("#personnelBtn").click(function () {
  $("#filterBtn").prop("disabled", false);
  getAll();
});

$("#departmentsBtn").click(function () {
  $("#filterBtn").prop("disabled", true);
  getAllDepartments();
});

$("#locationsBtn").click(function () {
  $("#filterBtn").prop("disabled", true);
  getAllLocations();
});


// ----------------------------------EDIT CALLS--------------------------------------------------------------------------------------

/**
 * Populate the edit personnel modal with data
 * Fetches personnel details by ID and populates the modal 
 */
$("#editPersonnelModal").on("show.bs.modal", function (e) {

  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id")
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {

        // Populate the modal fields with the retrieved personnel data
        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
        $("#editPersonnelDepartment").html("");

        // Populate the department dropdown
        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        // Set the selected department
        $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);

      } else {
        // Handle error if personnel data could not be retrieved
        $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX errors
      console.error("AJAX Error:", textStatus, errorThrown);
      $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
    }
  });
});

/**
 * Handle the submission of the edit personnel form
 * Sends updated personnel data to the server and refreshes the table
 */
$("#editPersonnelForm").on("submit", function (e) {
  e.preventDefault();

  // Collect updated personnel data from the form
  const updatedPerson = {
    id: $("#editPersonnelEmployeeID").val(),
    firstName: $("#editPersonnelFirstName").val(),
    lastName: $("#editPersonnelLastName").val(),
    jobTitle: $("#editPersonnelJobTitle").val(),
    email: $("#editPersonnelEmailAddress").val(),
    departmentID: $("#editPersonnelDepartment").val()
  };

  // Send the updated data to the server
  $.ajax({
    url: "libs/php/editPersonnel.php",
    type: "POST",
    data: updatedPerson,
    success: function (result) {
      if (result.status.code === "200") {
        // Clear the search input
        $("#searchInp").val('');
        bootstrap.Modal.getOrCreateInstance(document.getElementById('editPersonnelModal')).hide();
        document.getElementById('addedUpdate').textContent = updatedPerson.firstName + ' ' + updatedPerson.lastName;
        const modalSc = document.getElementById('updateSuccessModal');
        const editModal = bootstrap.Modal.getOrCreateInstance(modalSc);
        editModal.show();


        getAll();

      } else {
        // Handle failure to update personnel
        alert("Update failed: " + result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX errors
      console.error("AJAX Error:", textStatus, errorThrown);
      alert("An error occurred while updating personnel.");
    }
  });
});
//------------------------EDIT DEPARTMENT--------------------------------------------------

/**
 * Populate the edit department modal with data
 * Fetches department details by ID and populates the modal fields
 */
$("#editDepartmentModal").on("show.bs.modal", function (e) {
  const departmentID = $(e.relatedTarget).data('id');

  $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: "GET",
    dataType: "json",
    data: { id: departmentID },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode === "200") {
        const department = result.data[0];

        // Populate the modal fields with the retrieved department data
        $("#editDepartmentID").val(departmentID);
        $("#editDepartmentName").val(department.name);

        // Clear and populate the location dropdown
        $("#editDepartmentLocation").empty().append(
          $("<option>", {
            value: "",
            text: "Select Location"
          })
        );

        // Fetch and populate locations for the dropdown
        $.ajax({
          url: "libs/php/getAllLocations.php",
          type: "GET",
          dataType: "json",
          success: function (result) {
            if (result.status.code === "200") {
              result.data.forEach(loc => {
                $("#editDepartmentLocation").append(
                  $("<option>", {
                    value: loc.id,
                    text: loc.name
                  })
                );
              });

              // Set the selected location in the dropdown
              $("#editDepartmentLocation").val(department.locationID);
            }
          },
          error: function (xhr, status, error) {
            console.error("Failed to load locations:", error);
          }
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("Failed to load department data:", error);
    }
  });
});

/**
 * Handle the submission of the edit department form
 * Sends updated department data to the server and refreshes the table
 */
$("#editDepartmentForm").on("submit", function (e) {
  e.preventDefault();


  const departmentName = $("#editDepartmentName").val().trim();
  const locationID = $("#editDepartmentLocation").val();

  if (!departmentName) {
    alert("Please enter a department name");
    return;
  }

  if (!locationID) {
    alert("Please select a location");
    return;
  }

  // Prepare the updated department data
  const updatedDepartment = {
    id: $("#editDepartmentID").val(),
    name: departmentName,
    locationID: locationID
  };

  // Send the updated data to the server
  $.ajax({
    url: "libs/php/editDepartment.php",
    type: "POST",
    data: updatedDepartment,
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode === "200") {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('editDepartmentModal')).hide();
        document.getElementById('addedUpdate').textContent = updatedDepartment.name;
        const modalSc = document.getElementById('updateSuccessModal');
        const editModal = bootstrap.Modal.getOrCreateInstance(modalSc);
        editModal.show();
        getAllDepartments();
      } else {
        console.error("Failed to update department");
      }
    },
    error: function (xhr, status, error) {
      console.error("Failed to update department data:", error);
    }
  });
});

//-------------------------------------EDIT LOCATION ----------------------------------------------------

/**
 * Populate the edit location modal with data
 * Fetches location details by ID and populates the modal fields
 */
$("#editLocationModal").on("show.bs.modal", function (e) {
  const locationID = $(e.relatedTarget).data('id'); // Get the location ID from the button that triggered the modal

  $.ajax({
    url: "libs/php/getLocationById.php",
    type: "GET",
    dataType: "json",
    data: { id: locationID },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        const location = result.data[0];

        // Populate the modal fields with the retrieved location data
        $("#editLocationID").val(location.id);
        $("#editLocationName").val(location.name);

      } else {

        console.error("Failed to get location data");
      }
    },
    error: function (xhr, status, error) {

      console.error("AJAX Error:", error);
    }
  });
});

/**
 * Handle the submission of the edit location form
 * Sends updated location data to the server and refreshes the table
 */
$("#editLocationForm").on("submit", function (e) {
  e.preventDefault();

  const locationName = $("#editLocationName").val(); // Get the updated location name


  if (!locationName) {
    alert("Please enter a location name");
    return;
  }

  // Prepare the updated location data
  const updatedLocation = {
    id: $("#editLocationID").val(),
    name: locationName
  };

  // Send the updated data to the server
  $.ajax({
    url: "libs/php/editLocation.php",
    type: "POST",
    data: updatedLocation,
    success: function (result) {

      var resultCode = result.status.code;

      if (resultCode == 200) {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('editLocationModal')).hide();
        document.getElementById('addedUpdate').textContent = locationName;
        const modalSc = document.getElementById('updateSuccessModal');
        const editModal = bootstrap.Modal.getOrCreateInstance(modalSc);
        editModal.show();


        getAllLocations();
      } else {

        console.error("Failed to update location");
      }
    },
    error: function (xhr, status, error) {

      console.error("Failed to update location data:", error);
    }
  });
});

//------------------------------------------------DELETE PERSONNEL----------------------------------------------------------------

// Show.bs.modal: Fetch and display personnel name
document.getElementById("deletePersonnelModal").addEventListener("show.bs.modal", function (e) {
  const button = e.relatedTarget;
  const personID = button.getAttribute("data-id");

  // AJAX call to get personnel details by ID
  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: { id: personID },
    success: function (result) {
      if (result.status.code == 200) {
        const person = result.data.personnel[0];
        document.getElementById("personnelToRemove").textContent = person.firstName + " " + person.lastName;
        document.getElementById("deletePersonnelID").value = personID;
        document.getElementById("deletePersonnelForm").setAttribute("data-person-name", person.firstName + " " + person.lastName);
      } else {
        document.getElementById("personnelToRemove").textContent = "Unknown";
        document.getElementById("deletePersonnelID").value = "";
        document.getElementById("deletePersonnelForm").removeAttribute("data-person-name");
      }
    },
    error: function () {
      document.getElementById("personnelToRemove").textContent = "Unknown";
      document.getElementById("deletePersonnelID").value = "";
      document.getElementById("deletePersonnelForm").removeAttribute("data-person-name");
    }
  });
});

//  Delete personnel 
document.getElementById("deletePersonnelForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const personID = document.getElementById("deletePersonnelID").value;
  const personName = this.getAttribute("data-person-name") || "";

  $.ajax({
    url: "libs/php/deletePersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: { id: personID },
    success: function (result) {
      if (result.status.code == "200") {

        const deleteModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deletePersonnelModal'));
        document.getElementById('deletePersonnelModal').addEventListener('hidden.bs.modal', function handler() {
          document.getElementById('deleted').textContent = personName;
          const delSuccessModal = new bootstrap.Modal(document.getElementById('deleteSuccessModal'));
          delSuccessModal.show();
          document.getElementById('deletePersonnelModal').removeEventListener('hidden.bs.modal', handler);
        });
        deleteModal.hide();
        getAll();
      } else {
        alert("Failed to delete personnel.");
      }
    },
    error: function () {
      alert("Error deleting personnel.");
    }
  });
});


document.getElementById('deletePersonnelModal').addEventListener('hidden.bs.modal', function () {
  document.getElementById('deletePersonnelForm').reset();
  document.getElementById('personnelToRemove').textContent = '';
  document.getElementById('deletePersonnelForm').removeAttribute("data-person-name");
});

//------------------------------------------DELETE DEPARTMENT--------------------------------------------

/**
 * Click handler for the delete department button
 * Checks if the department has employees and updates the delete modal accordingly
 */
$(document).on("click", ".delete-department-btn", function () {
  const selectedDepartmentID = $(this).data("id"); // Get the department ID from the button

  // Find the department in the global departments array
  const department = departments.find(dept => dept.id == selectedDepartmentID);


  // Make an AJAX call to check if the department has employees
  $.ajax({
    url: "libs/php/checkHasEmployees.php", 
    type: "POST",
    dataType: "json",
    data: {
      id: selectedDepartmentID,
      type: "department"
    },
    success: function (result) {
      const hasEmployees = result.data.count > 0; // Check if the department has employees

      
      $("#deleteDepartmentID").val(selectedDepartmentID);

      if (hasEmployees) {
        // If the department has employees show a message and hide the delete button
        document.getElementById("cantDeleteDeptName").textContent = result.data.name;
        document.getElementById("personnelCount").textContent = result.data.count;
        const cantDeleteDeptModal = new bootstrap.Modal(document.getElementById("cantDeleteDepartmentModal"));
        cantDeleteDeptModal.show();
        
      } else {
        // If the department has no employees show a confirmation message and the delete button
        document.getElementById("departmentToDelete").textContent = result.data.name;
        const deleteDeptModal = new bootstrap.Modal(document.getElementById("deleteDepartmentModal"));
        deleteDeptModal.show();
      }

    },
    error: function () {
      
      alert("An error occurred while checking department employees.");
    }
  });
});

/**
 * Confirm delete handler for the delete department modal
 * Sends a request to delete the department and refreshes the department table
 */
$("#confirmDeleteDepartmentBtn").on("click", function () {
  const departmentID = $("#deleteDepartmentID").val(); 
  // Get the name from the departments array
  const department = departments.find(dept => dept.id == departmentID);
  const departmentNameToDelete = department ? department.departmentName : '';

  // Make an AJAX call to delete the department
  $.ajax({
    url: "libs/php/deleteDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: { id: departmentID },
    success: function (result) {
      if (result.status.code === "200") {
        const deleteDeptModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteDepartmentModal'));
        deleteDeptModal.hide();

        document.getElementById('deleted').textContent = departmentNameToDelete;
        const deleteSuccessModal = new bootstrap.Modal(document.getElementById('deleteSuccessModal'));
        deleteSuccessModal.show();
        getAllDepartments();
      } else {
        
        alert("Failed to delete department.");
      }
    },
    error: function () {
    
      alert("Error deleting department.");
    }
  });
});

//----------------------------------------------------------------DELETE LOCATION------------------------------

$(document).on('click', '.delete-location-btn', function () {
  const locationID = $(this).data("id");

  // AJAX call to check dependencies
  $.ajax({
    url: "libs/php/checkHasEmployees.php",
    type: "POST",
    dataType: "json",
    data: { id: locationID, type: "location" },
    success: function (result) {
      const hasDepartments = result.data.count > 0;
      const locationObj = result.data;

      if (hasDepartments) {
        document.getElementById("cantDeleteLocationName").textContent = locationObj.name;
        document.getElementById("departmentCount").textContent = result.data.count;
        const cantDeleteLocModal = new bootstrap.Modal(document.getElementById("cantDeleteLocationModal"));
        cantDeleteLocModal.show();
      } else {
        // Show the normal delete confirmation modal
        document.getElementById("DeleteLocationName").textContent = locationObj ? locationObj.name : '';
        document.getElementById("deleteLocationID").value = locationID;
        locationNameToDelete = locationObj ? locationObj.name : '';
        document.getElementById("confirmDeleteLocationBtn").style.display = "";
        const deleteLocModal = new bootstrap.Modal(document.getElementById("deleteLocationModal"));
        deleteLocModal.show();
      }
    },
    error: function () {
      alert("Error checking location dependencies.");
    }
  });
});

// Confirm delete handler
document.getElementById("confirmDeleteLocationBtn").onclick = function () {
  const locationID = document.getElementById("deleteLocationID").value;

  $.ajax({
    url: "libs/php/deleteLocationByID.php",
    type: "POST",
    dataType: "json",
    data: { id: locationID },
    success: function (result) {
      if (result.status.code === "200") {
        const deleteLocModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteLocationModal'));
        deleteLocModal.hide();

       
        document.getElementById('deleted').textContent = locationNameToDelete;
        const deleteSuccessModal = new bootstrap.Modal(document.getElementById('deleteSuccessModal'));
        deleteSuccessModal.show();

        getAllLocations();
      } else {
        alert("Failed to delete location.");
      }
    },
    error: function () {
      alert("Error deleting location.");
    }
  });
};

document.getElementById('deleteLocationModal').addEventListener('hidden.bs.modal', function () {
  document.getElementById('deleteLocationID').value = '';
  document.getElementById("confirmDeleteLocationBtn").style.display = "";
});

/**
 * Renders the personnel table with the provided personnel data
 */
function renderPersonnelTable(personnelArray) {
  var tbody = document.getElementById("personnelTableBody");
  tbody.innerHTML = "";

  // empty state
  if (personnelArray.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyTd  = document.createElement("td");
    emptyTd.setAttribute("colspan", 6);
    emptyTd.classList = "text-center";
    emptyTd.append(document.createTextNode("No personnel found"));
    emptyRow.append(emptyTd);
    tbody.append(emptyRow);
    return;
  }

  var frag = document.createDocumentFragment();

  personnelArray.forEach(function(person) {
    var row = document.createElement("tr");

    // Name
    var nameTd = document.createElement("td");
    nameTd.classList = "align-middle text-nowrap";
    nameTd.append(
      document.createTextNode(person.lastName + ", " + person.firstName)
    );
    row.append(nameTd);

    // Job Title
    var jobTd = document.createElement("td");
    jobTd.classList = "align-middle text-nowrap d-none d-md-table-cell";
    jobTd.append(document.createTextNode(person.jobTitle));
    row.append(jobTd);

    // Location
    var locTd = document.createElement("td");
    locTd.classList = "align-middle text-nowrap d-none d-md-table-cell";
    locTd.append(
      document.createTextNode(person.locationName)
    );
    row.append(locTd);

    // Department
    var deptTd = document.createElement("td");
    deptTd.classList = "align-middle text-nowrap d-none d-md-table-cell";
    deptTd.append(
      document.createTextNode(person.departmentName)
    );
    row.append(deptTd);

    // Email
    var emailTd = document.createElement("td");
    emailTd.classList = "align-middle text-nowrap d-none d-md-table-cell";
    emailTd.append(document.createTextNode(person.email));
    row.append(emailTd);

    // Actions 
    var actionTd = document.createElement("td");
    actionTd.classList = "align-middle text-end text-nowrap";

    // Edit button
    var editBtn = document.createElement("button");
    editBtn.setAttribute("type", "button");
    editBtn.classList = "btn btn-primary btn-sm me-1 edit-btn";
    editBtn.setAttribute("data-bs-toggle", "modal");
    editBtn.setAttribute("data-bs-target", "#editPersonnelModal");
    editBtn.setAttribute("data-id", person.id);
    var editIcon = document.createElement("i");
    editIcon.classList = "fa-solid fa-pencil fa-fw";
    editBtn.append(editIcon);
    actionTd.append(editBtn);

    // Delete button
    var delBtn = document.createElement("button");
    delBtn.setAttribute("type", "button");
    delBtn.classList = "btn btn-primary btn-sm delete-btn";
    delBtn.setAttribute("data-bs-toggle", "modal");
    delBtn.setAttribute("data-bs-target", "#deletePersonnelModal");
    delBtn.setAttribute("data-id", person.id);
    var delIcon = document.createElement("i");
    delIcon.classList = "fa-solid fa-trash fa-fw";
    delBtn.append(delIcon);
    actionTd.append(delBtn);

    row.append(actionTd);
    frag.append(row);
  });

  tbody.append(frag);
}


/**
 * Renders the department table with the provided department data
 */
function renderDepartmentTable(departmentArray) {
  var tbody = document.getElementById("departmentTableBody");
  tbody.innerHTML = "";

  // empty state
  if (departmentArray.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyTd  = document.createElement("td");
    emptyTd.setAttribute("colspan", 3);
    emptyTd.classList = "text-center";
    emptyTd.append(document.createTextNode("No departments found"));
    emptyRow.append(emptyTd);
    tbody.append(emptyRow);
    return;
  }

  

  var frag = document.createDocumentFragment();

  departmentArray.forEach(function(dept) {
    var row = document.createElement("tr");

    // Department Name
    var nameTd = document.createElement("td");
    nameTd.classList = "align-middle text-nowrap";
    nameTd.append(document.createTextNode(dept.departmentName));
    row.append(nameTd);

    // Location Name
    var locTd = document.createElement("td");
    locTd.classList = "align-middle text-nowrap d-none d-md-table-cell";
    locTd.append(document.createTextNode(dept.locationName));
    row.append(locTd);

    // Actions cell
    var actionTd = document.createElement("td");
    actionTd.classList = "align-middle text-end text-nowrap";

    // Edit
    var editBtn = document.createElement("button");
    editBtn.setAttribute("type", "button");
    editBtn.classList = "btn btn-primary btn-sm me-1 edit-department-btn";
    editBtn.setAttribute("data-bs-toggle", "modal");
    editBtn.setAttribute("data-bs-target", "#editDepartmentModal");
    editBtn.setAttribute("data-id", dept.id);
    var editIcon = document.createElement("i");
    editIcon.classList = "fa-solid fa-pencil fa-fw";
    editBtn.append(editIcon);
    actionTd.append(editBtn);

    // Delete
    var delBtn = document.createElement("button");
    delBtn.setAttribute("type", "button");
    delBtn.classList = "btn btn-primary btn-sm delete-department-btn";
    delBtn.setAttribute("data-id", dept.id);
    var delIcon = document.createElement("i");
    delIcon.classList = "fa-solid fa-trash fa-fw";
    delBtn.append(delIcon);
    actionTd.append(delBtn);

    row.append(actionTd);
    frag.append(row);
  });

  tbody.append(frag);
}


/**
 * Renders the location table with the provided location data
 */
function renderLocationTable(locationArray) {
  var tbody = document.getElementById("locationTableBody");
  tbody.innerHTML = "";

  // empty state
  if (locationArray.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyTd  = document.createElement("td");
    emptyTd.setAttribute("colspan", 3);
    emptyTd.classList = "text-center";
    emptyTd.append(document.createTextNode("No locations found"));
    emptyRow.append(emptyTd);
    tbody.append(emptyRow);
    return;
  }


  var frag = document.createDocumentFragment();

  locationArray.forEach(function(loc) {
    var row = document.createElement("tr");

    // Location Name
    var nameTd = document.createElement("td");
    nameTd.classList = "align-middle text-nowrap";
    nameTd.append(document.createTextNode(loc.name));
    row.append(nameTd);

    // Empty md-only cell
    var emptyTd = document.createElement("td");
    emptyTd.classList = "align-middle text-nowrap d-none d-md-table-cell";
    row.append(emptyTd);

    // Actions cell
    var actionTd = document.createElement("td");
    actionTd.classList = "align-middle text-end text-nowrap";

    // Edit
    var editBtn = document.createElement("button");
    editBtn.setAttribute("type", "button");
    editBtn.classList = "btn btn-primary btn-sm me-1 edit-location-btn";
    editBtn.setAttribute("data-bs-toggle", "modal");
    editBtn.setAttribute("data-bs-target", "#editLocationModal");
    editBtn.setAttribute("data-id", loc.id);
    var editIcon = document.createElement("i");
    editIcon.classList = "fa-solid fa-pencil fa-fw";
    editBtn.append(editIcon);
    actionTd.append(editBtn);

    // Delete
    var delBtn = document.createElement("button");
    delBtn.setAttribute("type", "button");
    delBtn.classList = "btn btn-primary btn-sm delete-location-btn";
    delBtn.setAttribute("data-id", loc.id);
    var delIcon = document.createElement("i");
    delIcon.classList = "fa-solid fa-trash fa-fw";
    delBtn.append(delIcon);
    actionTd.append(delBtn);

    row.append(actionTd);
    frag.append(row);
  });

  tbody.append(frag);
}
