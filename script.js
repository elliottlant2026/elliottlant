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


document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://script.google.com/macros/s/AKfycby1UyYgjuwZ0Isl550wYMGntVSxF4HA6PRIEnRqqnUt7F4aHVUkjt-QHNeGtkTsxeR2/exec";
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // --- PROPERLY PLACED DEBUGGING LOG ---
        if (data.length > 0) {
            console.log("First book object keys & values:", data[0]);
        }
        // -------------------------------------
        
        const currentYear = new Date().getFullYear();
        let currentYearPages = 0;
        let currentYearBooks = 0; // Added to track book count
        let annualGoal = 50;
        
        const monthlyPages = {};
        const yearlyPages = {};
        
        // Process spreadsheet rows
        data.forEach(book => {
            const year = Number(book["Year"]);
            const month = book["Month"];
            const pages = Number(book["pages read"]) || 0;
            
            if (year) {
                yearlyPages[year] = (yearlyPages[year] || 0) + pages;
                if (year === currentYear) {
                    currentYearPages += pages;
                    currentYearBooks += 1; 
                }
            }
            
            if (year === currentYear && month) {
                monthlyPages[month] = (monthlyPages[month] || 0) + pages;
            }
        });
        
        // Update Goal Progress Bar
       const goalPercent = Math.min(Math.round((currentYearBooks / annualGoal) * 100), 100);
        document.getElementById("goal-title").innerText = `${currentYear} Reading Challenge`;
        document.getElementById("goal-text").innerText = `${currentYearBooks} of ${annualGoal} books read (${goalPercent}%)`;
        document.getElementById("progress-fill").style.width = `${goalPercent}%`;
        
        // Render Monthly Bar Chart
        const monthsOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthlyData = monthsOrder.map(m => monthlyPages[m] || 0);
        
        const ctxMonthly = document.getElementById('monthlyChart').getContext('2d');
        new Chart(ctxMonthly, {
            type: 'bar',
            data: {
                labels: monthsOrder,
                datasets: [{
                    label: 'Pages Read',
                    data: monthlyData,
                    backgroundColor: '#2ea44f',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
        
        // Render Yearly Line Chart
        const sortedYears = Object.keys(yearlyPages).sort();
        const yearlyData = sortedYears.map(y => yearlyPages[y]);
        
        const ctxYearly = document.getElementById('yearlyChart').getContext('2d');
        new Chart(ctxYearly, {
            type: 'line',
            data: {
                labels: sortedYears,
                datasets: [{
                    label: 'Total Pages',
                    data: yearlyData,
                    borderColor: '#0366d6',
                    backgroundColor: 'rgba(3, 102, 214, 0.1)',
                    fill: true,
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });

    } catch (error) {
        console.error("Error fetching reading data:", error);
        document.getElementById("goal-text").innerText = "Failed to load reading progress.";
    }
});