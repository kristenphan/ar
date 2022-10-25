// Wait until html finishes loading
document.addEventListener("DOMContentLoaded", () => {
  // If button Submit is clicked, add a new watering record to MySQL
  document.getElementById("button-submit").addEventListener("click", () => {
    console.log("water me button submit clicked");
    
    // Obtain the plant status and write it to MySQL data in a new watering record
    const radioButtonGroup = document.getElementsByName("plant-status");
    const checkedRadio = Array.from(radioButtonGroup).find((radio) => radio.checked);
    if (checkedRadio !== undefined) {
      console.log("radio = ", checkedRadio.value);

      // TODO: Call lambda function to write to MySQL

      // Return to Main Dashboard
      /* window.location.href = "./index.html"; // not working */
    }
    else { // No radio button clicked
      alert("Please answer the question(s) before clicking 'Submit'.");
    }
    
  });

  // If button Return is clicked, return to the AR dashboard
  document.getElementById("button-return").addEventListener("click", () => {
    console.log("water me button return clicked");
    // TODO: Return to index.html after Return button is clicked
    // Currently can return to index.html when no radio button is clicked (see water-me.html)
    // But when radio button is clicked, cannot return to index.html yet
  }); 
});