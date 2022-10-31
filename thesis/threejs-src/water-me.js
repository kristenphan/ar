// Wait until html finishes loading
document.addEventListener("DOMContentLoaded", () => {
  // If button Submit is clicked, add a new watering record to backend database
  document.getElementById("button-submit").addEventListener("click", () => {
    console.log("water me button submit clicked");
    
    // Obtain the plant status and write it to a database
    const radioButtonGroup = document.getElementsByName("plant-status");
    const checkedRadio = Array.from(radioButtonGroup).find((radio) => radio.checked);
    if (checkedRadio !== undefined) {
      alert("radio = ", checkedRadio.value); // TODO: not showing checkRadio.value
      console.log("radio = ", checkedRadio.value);

      // TODO: Call lambda function to write to database

      // Return to Main Dashboard
      //window.location.href = "./index.html"; // not working
      //window.location.replace("./index.html"); // not working either
    }
    else { // If no radio button clicked
      alert("Please answer the question(s) before clicking 'Submit'.");
    }
  });
});