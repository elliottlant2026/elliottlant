// ==========================================
// CONFIGURATION & VARIABLES
// ==========================================
const MY_HOME_IP = "150.195.205.222";


// ==========================================
// FUNCTIONS
// ==========================================
async function checkWifi() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const visitorIP = data.ip;

    const container = document.getElementById("wifi-checker");

    // Safety check: only run if the element exists on the current page
    if (container) {
      if (visitorIP === MY_HOME_IP) {
        container.innerHTML = "<h3>🏠 Welcome home, Elliott! You are on the Wi-Fi.</h3>";
      } else {
        container.innerHTML = "<h3>🌐 Welcome! You are browsing from the public internet.</h3>";
      }
    }
  } catch (error) {
    console.error("Could not check IP:", error);
  }
}


// ==========================================
// EVENT LISTENERS / INITIALIZATION
// ==========================================
// Run functions after the page content has fully loaded
document.addEventListener("DOMContentLoaded", () => {
  checkWifi();
});