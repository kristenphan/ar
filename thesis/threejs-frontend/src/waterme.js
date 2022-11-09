// Wait until html finishes loading, 
// then invoke a lambda function to write a new watering record in backend database
document.addEventListener("DOMContentLoaded", () => {
  // If button Submit is clicked, add a new watering record to backend database
  document.getElementById("button-submit").addEventListener("click", () => {
    console.log("water me button submit clicked");
    
    // Obtain the plant status and write it to a database
    // Radio button "Good" is checked by default
    const radioButtonGroup = document.getElementsByName("plant-status");
    const checkedRadio = Array.from(radioButtonGroup).find((radio) => radio.checked);
    const plantStatus = checkedRadio.value;

    // TODO: Call to lambda to write a new watering record to database
    const plantId = 1;
    alert("Recorded html form: plantId = " + plantId + "; plantStatus = " + plantStatus);

    // Return to main dashboard
    window.location.href = "./index.html";
  });
});

