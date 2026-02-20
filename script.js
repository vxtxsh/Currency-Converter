// // ===============================
// // Flags (real SVG via FlagCDN)
// // ===============================
// const currencyToCountry = {
//   USD: "us",
//   INR: "in",
//   GBP: "gb",
//   JPY: "jp",
//   EUR: "eu" // region flag for EUR
// };
// const flagUrl = (cc) => `https://flagcdn.com/${cc}.svg`;

// // ===============================
// // DOM Elements
// // ===============================
// const fromCurrency = document.getElementById("fromCurrency");
// const toCurrency = document.getElementById("toCurrency");
// const amountInput = document.getElementById("amount");
// const convertBtn = document.getElementById("convertBtn");
// const swapBtn = document.getElementById("swapBtn");

// const rateInfo = document.getElementById("rateInfo");
// const bigResult = document.getElementById("bigResult");
// const historyList = document.getElementById("historyList");
// const fromFlagEl = document.getElementById("fromFlag");
// const toFlagEl = document.getElementById("toFlag");
// const oneRateInfo = document.getElementById("oneRateInfo");

// let myChart = null; // Chart.js instance
// const MAX_HISTORY = 5; // change to 5 if you want exactly five

// // ===============================
// // Manual FX table (no API)
// // Base currency: USD. Update these values when needed.
// // ===============================
// const FX_BASE = 'USD';
// const FX = {
//   USD: 1,
//   INR: 90.94,
//   GBP: 0.74,
//   JPY: 155.19,
//   EUR: 0.85
// };

// // Convert using the base (USD) table: amount * (USD→to) / (USD→from)
// function convertManually(amount, from, to) {
//   if (from === to) return amount;

//   const fromRate = FX[from];
//   const toRate   = FX[to];

//   if (typeof fromRate !== 'number' || typeof toRate !== 'number') {
//     throw new Error(`Unsupported currency pair: ${from} → ${to}`);
//   }
//   return amount * (toRate / fromRate);
// }

// // ===============================
// // ===== API CONVERSION ENABLED =====
// // ===============================
 
// // Currency Conversion via API (Frankfurter)
// // async function convertViaAPI(amount, from, to) {
// //   if (from === to) return amount;
// //   const url = `https://api.frankfurter.app/latest?amount=${encodeURIComponent(
// //     amount
// //   )}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
// //   const res = await fetch(url, { cache: "no-store" });
// //   if (!res.ok) throw new Error("Conversion API request failed");
// //   const data = await res.json();
// //   const converted = data?.rates?.[to];
// //   if (typeof converted !== "number") {
// //     throw new Error(`No rate found for ${from} → ${to}`);
// //   }
// //   return converted;
// // }
 
// // Show "1 FROM = X TO" live rate
// // async function updateOneRate(from, to) {
// //   const oneRateInfo = document.getElementById("rateInfo"); // Ensure this matches your HTML ID
// //   if (!oneRateInfo) return;
// //   if (!from || !to) { oneRateInfo.innerText = ""; return; }
// //   if (from === to) { oneRateInfo.innerText = `1 ${from} = 1 ${to}`; return; }
 
// //   try {
// //     const url = `https://api.frankfurter.app/latest?amount=1&from=${encodeURIComponent(
// //       from
// //     )}&to=${encodeURIComponent(to)}`;
// //     const res = await fetch(url, { cache: "no-store" });
// //     if (!res.ok) throw new Error("Failed to fetch 1-unit rate");
// //     const data = await res.json();
// //     const val = data?.rates?.[to];
// //     if (typeof val !== "number") throw new Error("Rate not available");
// //     oneRateInfo.innerText = `1 ${from} = ${val.toLocaleString(undefined, {
// //       maximumFractionDigits: 6,
// //     })} ${to}`;
// //   } catch (e) {
// //     console.error(e);
// //     oneRateInfo.innerText = "";
// //   }
// // }

// function updateOneRateManual(from, to) {
//   if (!oneRateInfo) return;

//   if (!from || !to) {
//     oneRateInfo.innerText = "";
//     return;
//   }
//   if (from === to) {
//     oneRateInfo.innerText = `1 ${from} = 1 ${to}`;
//     return;
//   }
//   try {
//     const per1 = convertManually(1, from, to);
//     oneRateInfo.innerText = `1 ${from} = ${Number(per1).toLocaleString(undefined, {
//       maximumFractionDigits: 6,
//     })} ${to}`;
//   } catch (e) {
//     console.error(e);
//     oneRateInfo.innerText = "";
//   }
// }
// // ===============================
// // Navigation Logic
// // ===============================
// function showPage(pageId) {
//   document.getElementById('converter-page').style.display = pageId === 'converter' ? 'block' : 'none';
//   document.getElementById('trends-page').style.display = pageId === 'trends' ? 'block' : 'none';
//   document.getElementById('about-page').style.display = pageId === 'about' ? 'block' : 'none';

//   const headerTitle = document.querySelector('.main-header h1');
//    if (pageId === 'converter') {
//     headerTitle.innerText = 'Currency Converter';
//   } else if (pageId === 'trends') {
//     headerTitle.innerText = 'Market Trends';
//     updateTrendGraph();
//   }
//   // Sidebar active state
//   const items = document.querySelectorAll('.sidebar li');
//   items[0].classList.toggle('active', pageId === 'converter');
//   items[1].classList.toggle('active', pageId === 'trends');
//   items[2].classList.toggle('active', pageId === 'about');

//   //if (pageId === 'trends') updateTrendGraph();
// }
// window.showPage = showPage; // expose to inline onclicks

// // ===============================
// // Initial Setup: flags + empty history on first load
// // ===============================
// window.addEventListener("DOMContentLoaded", () => {
//   // Start with empty history per your requirement
//   localStorage.removeItem("conversionHistory");
//   historyList.innerHTML = "";

//   updateFlags();

//   // Initialize trends label
//   const trendLabel = document.getElementById('trendLabel');
//   if (trendLabel) trendLabel.innerText = `${fromCurrency.value} to ${toCurrency.value}`;
//   // Show the per-1 rate on load (manual)
//   updateOneRateManual(fromCurrency.value, toCurrency.value);
// });

// // Update flags next to selects
// function updateFlags() {
//   const fromCC = currencyToCountry[fromCurrency.value] || "un";
//   const toCC = currencyToCountry[toCurrency.value] || "un";
//   fromFlagEl.src = flagUrl(fromCC);
//   fromFlagEl.alt = `${fromCurrency.value} flag`;
//   toFlagEl.src = flagUrl(toCC);
//   toFlagEl.alt = `${toCurrency.value} flag`;
// }
// fromCurrency.addEventListener("change", () => {
//   updateFlags();
//   // Update trends label to reflect new pair
//   const trendLabel = document.getElementById('trendLabel');
//   if (trendLabel) trendLabel.innerText = `${fromCurrency.value} to ${toCurrency.value}`;
//   // Update 1-unit line (manual)
//   updateOneRateManual(fromCurrency.value, toCurrency.value);
// });
// toCurrency.addEventListener("change", () => {
//   updateFlags();
//   const trendLabel = document.getElementById('trendLabel');
//   if (trendLabel) trendLabel.innerText = `${fromCurrency.value} to ${toCurrency.value}`;
//   // Update 1-unit line (manual)
//   updateOneRateManual(fromCurrency.value, toCurrency.value);
// });

// // ===============================
// // Conversion Logic (Manual - no API) - only on button click
// // ===============================
// convertBtn.addEventListener('click', () => {
//   const amount = parseFloat(amountInput.value);
//   const from = fromCurrency.value;
//   const to = toCurrency.value;

//   if (isNaN(amount) || amount <= 0) {
//     alert("Please enter a valid amount");
//     return;
//   }

//   try {
//     const converted = convertManually(amount, from, to);

//     rateInfo.innerText = `${amount} ${from} is approximately`;
//     bigResult.innerText = `${converted.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${to}`;

//     addToHistory({ from, to, amount, converted: converted.toFixed(2) });

//     const trendLabel = document.getElementById('trendLabel');
//     if (trendLabel) trendLabel.innerText = `${from} to ${to}`;
//   } catch (err) {
//     console.error(err);
//     alert(err.message || "Conversion failed. Please check your currency selection.");
//   }
// });

// // ===============================
// // Swap currencies (no auto-convert)
// // ===============================
// swapBtn.addEventListener("click", () => {
//   const tmp = fromCurrency.value;
//   fromCurrency.value = toCurrency.value;
//   toCurrency.value = tmp;

//   // Update flags
//   updateFlags();

//   // Clear previous outputs so it’s clear no new conversion happened
//   rateInfo.innerText = "";
//   bigResult.innerText = "";

//   // Update trends label
//   const trendLabel = document.getElementById('trendLabel');
//   if (trendLabel) trendLabel.innerText = `${fromCurrency.value} to ${toCurrency.value}`;
//   // Update the 1-unit display after swap (manual)
//   updateOneRateManual(fromCurrency.value, toCurrency.value);
//   // If Trends page is visible, optionally refresh the chart
//   const trendsVisible = document.getElementById('trends-page').style.display !== 'none';
//   if (trendsVisible) updateTrendGraph();
// });

// // ===============================
// // History Helpers (with flag <img> tags)
// // ===============================
// function addToHistory({ from, to, amount, converted }) {
//   const fromCC = currencyToCountry[from] || "un";
//   const toCC = currencyToCountry[to] || "un";

//   const li = document.createElement("li");
//   li.innerHTML = `
//     <img class="inline-flag" src="${flagUrl(fromCC)}" alt="${from} flag" />
//     ${Number(amount).toLocaleString()} ${from}
//     &nbsp;→&nbsp;
//     ${Number(converted).toLocaleString()} ${to}
//     <img class="inline-flag" src="${flagUrl(toCC)}" alt="${to} flag" />
//   `;
//   historyList.prepend(li);

//   // Trim UI list to MAX_HISTORY
//   while (historyList.children.length > MAX_HISTORY) {
//     historyList.removeChild(historyList.lastChild);
//   }

//   // Persist within this session (cleared on reload per requirement)
//   let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
//   history.unshift({ from, to, amount, converted });
//   history = history.slice(0, MAX_HISTORY);
//   localStorage.setItem("conversionHistory", JSON.stringify(history));
// }

// // ===============================
// // Trend Graph Logic (last 30 days) with rich tooltips
// // (Still uses API; tell me if you want offline options.)
// // ===============================
// async function updateTrendGraph() {
//   const from = document.getElementById('fromCurrency').value;
//   const to = document.getElementById('toCurrency').value;

//   try {
//     const end = new Date().toISOString().split('T')[0];
//     const start = new Date();
//     start.setDate(start.getDate() - 30);
//     const startStr = start.toISOString().split('T')[0];

//     const res = await fetch(`https://api.frankfurter.app/${startStr}..${end}?from=${from}&to=${to}`);
//     if (!res.ok) throw new Error('Failed to fetch historical data');
//     const data = await res.json();
    
//     // Sort dates chronologically
//     const rawLabels = Object.keys(data.rates).sort(); 
    
//     // Format labels to be shorter (e.g., "Feb 19") to save space
//     const labels = rawLabels.map(dateStr => {
//       const date = new Date(dateStr);
//       return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
//     });

//     const points = rawLabels.map(d => data.rates[d][to]);
//     const ctx = document.getElementById('trendChart').getContext('2d');
    
//     if (window.myChart) window.myChart.destroy();

//     window.myChart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels,
//         datasets: [{
//           label: `Rate (${from}→${to})`,
//           data: points,
//           borderColor: '#c40303',
//           backgroundColor: 'rgba(196, 3, 3, 0.12)',
//           tension: 0.3,
//           fill: true,
//           pointRadius: 2,
//           pointHoverRadius: 5,
//           pointHitRadius: 10
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         layout: {
//           padding: {
//             bottom: 80 // Space for rotated labels
//           }
//         },
//         interaction: { mode: 'index', intersect: false, axis: 'x' },
//         plugins: {
//           legend: { 
//             display: false // Hide legend to give the graph more room
//           },
//           tooltip: {
//             enabled: true,
//             displayColors: false,
//             callbacks: {
//               title: (items) => items.length ? items[0].label : '',
//               label: (ctx) => {
//                 const val = Number(ctx.parsed.y);
//                 return `Rate: ${val.toLocaleString(undefined, { maximumFractionDigits: 6 })}`;
//               },
//               afterLabel: () => `Pair: ${from} → ${to}`
//             }
//           }
//         },
//         scales: {
//           x: { 
//             ticks: { 
//               color: '#8b6464',
//               autoSkip: true,      // Automatically hide labels if they overlap
//               maxTicksLimit: 10,   // Maximum number of labels to show
//               maxRotation: 45,     // Slant them if they get crowded
//               minRotation: 0 
//             }, 
//             grid: { display: false } 
//           },
//           y: { 
//             ticks: { 
//               color: '#8b6464',
//               callback: (value) => value.toFixed(2) // Keeps Y axis consistent
//             }, 
//             grid: { color: 'rgba(148, 163, 184, 0.1)' } 
//           }
//         },
//         hover: { mode: 'index', intersect: false }
//       }
//     });

//     const trendLabel = document.getElementById('trendLabel');
//     if (trendLabel) trendLabel.innerText = `${from} to ${to}`;
//   } catch (err) {
//     console.error(err);
//     alert("Sorry, couldn't load the trend chart. Please try again.");
//   }
// }

// window.onload = function() {
//   setTimeout(function() {
//     const splash = document.getElementById('splash-screen');
//     splash.style.opacity = '0'; // Fade out
    
//     // Completely remove from view after fade animation finishes
//     setTimeout(() => {
//       splash.style.display = 'none';
//     }, 500); 
    
//   }, 1050); // 1000ms = 1 second
// };

// /*
// // CLEAR BUTTON LOGIC 
// // 1. Select the input and the clear button
// //const amountInput = document.getElementById('amount');
// const clearBtn = document.getElementById('clearBtn');

// // 2. Add the click event
// clearBtn.addEventListener('click', () => {
//   // Clear the value in the input box
//   amountInput.value = '';
  
//   // Optional: Place the typing cursor back in the box immediately
//   amountInput.focus();
// });
// */

// // ===============================
// // Clear Button Logic 
// // ===============================
// const clearBtn = document.getElementById('clearBtn');

// clearBtn.addEventListener('click', () => {
//   // 1. Clear the input box value
//   const amountInput = document.getElementById('amount');
//   amountInput.value = '';

//   // 2. Clear the result display divs
//   const rateInfo = document.getElementById('rateInfo');
//   const bigResult = document.getElementById('bigResult');
  
//   rateInfo.innerText = '';
//   bigResult.innerText = '';

//   // 3. Reset focus to the input box
//   amountInput.focus();
// });

// // ===============================
// // Toggle Button Logic 
// // ===============================

// const themeToggleContainer = document.getElementById('themeToggleContainer');
// const themeLabel = document.getElementById('themeLabel');
// const sidebarLogo = document.querySelector('.sidebar-img'); // 1. Add this selector

// // 2. Add this helper function to handle the image swap
// const updateLogo = (isDark) => {
//   if (sidebarLogo) {
//     sidebarLogo.src = isDark ? 'logo-dark.png' : 'logo.png';
//   }
// };

// // 3. Check for saved preference (Updated to include logo)
// if (localStorage.getItem('theme') === 'dark') {
//   document.body.classList.add('dark-mode');
//   themeLabel.innerText = 'Light Mode';
//   updateLogo(true); 
// }

// // 4. Click Event (Updated to include logo)
// themeToggleContainer.addEventListener('click', () => {
//   const isDark = document.body.classList.toggle('dark-mode');
  
//   themeLabel.innerText = isDark ? 'Light Mode' : 'Dark Mode';
//   localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
//   updateLogo(isDark); // Swaps the image on click
// });


// // ===============================
// // ABOUT US CARDS 
// // ===============================

// // 1. Team Data
// const teamMembers = [
//     { name: "Mathi", quote: "Leadership is the capacity to translate vision into reality." },
//     { name: "Likhitha", quote: "The best error message is the one that never shows up." },
//     { name: "Swastika", quote: "Efficiency is doing things right; effectiveness is doing the right things." },
//     { name: "Pranav", quote: "Don't find customers for your products, find products for your customers." },
//     { name: "Mithun", quote: "Design adds value faster than it adds cost." },
//     { name: "Vitesh", quote: "Customer service shouldn't just be a department, it should be the entire company." }
// ];

// // 2. Navigation Function
// function showAboutPage(pageId) {
//     // Hide all sections
//     //const grid = document.getElementById('team-grid');
//     const headerTitle = document.querySelector('.main-header h1');
//     headerTitle.innerText = 'About Our Team';
//     document.getElementById('converter-page').style.display = 'none';
//     document.getElementById('trends-page').style.display = 'none';
//     document.getElementById('about-page').style.display = pageId === 'about' ? 'block' : 'none';

//     // Show the selected section
//     document.getElementById(pageId + '-page').style.display = 'block';

//     // Update Sidebar Active State
//     const navItems = document.querySelectorAll('.sidebar li');
//     navItems.forEach(li => li.classList.remove('active'));
    
//     // Find the clicked item based on text (or add specific IDs to the LIs)
//     event.currentTarget.classList.add('active');

//     // If "About" is selected, render cards if they aren't there
//     if (pageId === 'about') {
//         renderTeamCards();
//     }
// }

// // 3. Render Cards Function
// function renderTeamCards() {
//     const grid = document.getElementById('team-grid');
//     if (grid.innerHTML.trim() === "") {
//         grid.innerHTML = teamMembers.map(member => `
//             <div class="card-container">
//                 <div class="card-inner">
//                     <div class="card-front">
//                         <h3>${member.name}</h3>
//                         <span class="hover-text">Hover for Insight</span>
//                     </div>
//                     <div class="card-back">
//                         <p>${member.quote}</p>
//                     </div>
//                 </div>
//             </div>
//         `).join('');
//     }
// }

// function toggleSidebar() {
//   const sidebar = document.querySelector('.sidebar');
//   const toggleBtn = document.querySelector('.menu-toggle');
//   const closeBtn=document.querySelector('.menu-close')

//   sidebar.classList.toggle('active');
//   if (sidebar.classList.contains('active')) {
//     toggleBtn.textContent="✖";
//     // toggleBtn.style.display="none";
//     // closeBtn.style.display="block"; // Close symbol
//   } else {
//     toggleBtn.textContent = '☰';
//     // closeBtn.style.display="none"; // Hamburger menu
//     // toggleBtn.style.display = "block"; 
//     // closeBtn.style.display = "none";
  
//   }
// }





// ===============================
// Flags (real SVG via FlagCDN)
// ===============================
const currencyToCountry = {
  USD: "us",
  INR: "in",
  GBP: "gb",
  JPY: "jp",
  EUR: "eu" // region flag for EUR
};
const flagUrl = (cc) => `https://flagcdn.com/${cc}.svg`;
 
// ===============================
// DOM Elements
// ===============================
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
 
const rateInfo = document.getElementById("rateInfo");
const bigResult = document.getElementById("bigResult");
const oneRateInfo = document.getElementById("oneRateInfo");
 
const historyList = document.getElementById("historyList");
const fromFlagEl = document.getElementById("fromFlag");
const toFlagEl = document.getElementById("toFlag");
 
let myChart = null; // Chart.js instance
const MAX_HISTORY = 5;
 
// ===============================
// Manual FX table (DISABLED) - Base: USD
// ===============================
// NOTE: Manual conversion is disabled for API mode.
// const FX_BASE = 'USD';
// const FX = {
//   USD: 1,
//   INR: 83.10,
//   GBP: 0.79,
//   JPY: 150.30,
//   EUR: 0.92
// };
 
// // Convert using the base (USD) table: amount * (USD→to) / (USD→from)
// function convertManually(amount, from, to) {
//   if (from === to) return amount;
//
//   const fromRate = FX[from];
//   const toRate   = FX[to];
//
//   if (typeof fromRate !== 'number' || typeof toRate !== 'number') {
//     throw new Error(`Unsupported currency pair: ${from} → ${to}`);
//   }
//   return amount * (toRate / fromRate);
// }
 
// // Show "1 FROM = X TO" using manual table
// function updateOneRateManual(from, to) {
//   if (!oneRateInfo) return;
//
//   if (!from || !to) {
//     oneRateInfo.innerText = "";
//     return;
//   }
//   if (from === to) {
//     oneRateInfo.innerText = `1 ${from} = 1 ${to}`;
//     return;
//   }
//   try {
//     const per1 = convertManually(1, from, to);
//     oneRateInfo.innerText = `1 ${from} = ${Number(per1).toLocaleString(undefined, {
//       maximumFractionDigits: 6,
//     })} ${to}`;
//   } catch (e) {
//     console.error(e);
//     oneRateInfo.innerText = "";
//   }
// }
 
// ===============================
// ===== API CONVERSION (ENABLED) =====
// Currency Conversion via API (Frankfurter)
async function convertViaAPI(amount, from, to) {
  if (from === to) return amount;
  const url = `https://api.frankfurter.app/latest?amount=${encodeURIComponent(
    amount
  )}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Conversion API request failed");
  const data = await res.json();
  const converted = data?.rates?.[to];
  if (typeof converted !== "number") {
    throw new Error(`No rate found for ${from} → ${to}`);
  }
  return converted;
}
 
// Show "1 FROM = X TO" live rate via API
async function updateOneRate(from, to) {
  if (!oneRateInfo) return;
  if (!from || !to) { oneRateInfo.innerText = ""; return; }
  if (from === to) { oneRateInfo.innerText = `1 ${from} = 1 ${to}`; return; }
 
  try {
    const url = `https://api.frankfurter.app/latest?amount=1&from=${encodeURIComponent(
      from
    )}&to=${encodeURIComponent(to)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch 1-unit rate");
    const data = await res.json();
    const val = data?.rates?.[to];
    if (typeof val !== "number") throw new Error("Rate not available");
    oneRateInfo.innerText = `1 ${from} = ${val.toLocaleString(undefined, {
      maximumFractionDigits: 6,
    })} ${to}`;
  } catch (e) {
    console.error(e);
    oneRateInfo.innerText = "";
  }
}
// ===== API CONVERSION (ENABLED) =====
 
// ===============================
// Navigation Logic
// ===============================
function showPage(pageId) {
  document.getElementById("converter-page").style.display =
    pageId === "converter" ? "block" : "none";
  document.getElementById("trends-page").style.display =
    pageId === "trends" ? "block" : "none";
  const aboutPage = document.getElementById("about-page");
  if (aboutPage) aboutPage.style.display = pageId === "about" ? "block" : "none";
 
  // Sidebar active state
  const items = document.querySelectorAll(".sidebar li");
  items.forEach((li) => li.classList.remove("active"));
  items.forEach((li) => {
    const action = li.getAttribute("onclick") || "";
    if (action.includes(`'${pageId}'`)) li.classList.add("active");
  });
 
  if (pageId === "trends") updateTrendGraph();
}
window.showPage = showPage; // expose to inline onclicks
 
// ===============================
// Initial Setup: flags + history render + 1-unit display (API)
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  // Render existing history (if any)
  try {
    const saved = JSON.parse(localStorage.getItem("conversionHistory")) || [];
    historyList.innerHTML = "";
 
    saved.slice(0, MAX_HISTORY).forEach(({ from, to, amount, converted }) => {
      const fromCC = currencyToCountry[from] || "un";
      const toCC = currencyToCountry[to] || "un";
 
      const li = document.createElement("li");
      li.innerHTML = `
        ${flagUrl(fromCC)}
        ${Number(amount).toLocaleString()} ${from}
        &nbsp;→&nbsp;
        ${Number(converted).toLocaleString()} ${to}
        ${flagUrl(toCC)}
      `;
      historyList.appendChild(li);
    });
  } catch (e) {
    console.error("Failed to load conversion history:", e);
  }
 
  updateFlags();
 
  // Initialize trends label
  const trendLabel = document.getElementById("trendLabel");
  if (trendLabel) trendLabel.innerText = `${fromCurrency.value} to ${toCurrency.value}`;
 
  // Show the per-1 rate on load (API)
  updateOneRate(fromCurrency.value, toCurrency.value);
});
 
// ===============================
// Update flags next to selects
// ===============================
function updateFlags() {
  const fromCC = currencyToCountry[fromCurrency.value] || "un";
  const toCC = currencyToCountry[toCurrency.value] || "un";
  fromFlagEl.src = flagUrl(fromCC);
  fromFlagEl.alt = `${fromCurrency.value} flag`;
  toFlagEl.src = flagUrl(toCC);
  toFlagEl.alt = `${toCurrency.value} flag`;
}
 
fromCurrency.addEventListener("change", () => {
  updateFlags();
  const trendLabel = document.getElementById("trendLabel");
  if (trendLabel) trendLabel.innerText = `${fromCurrency.value} to ${toCurrency.value}`;
  // Update 1-unit line (API)
  updateOneRate(fromCurrency.value, toCurrency.value);
});
 
toCurrency.addEventListener("change", () => {
  updateFlags();
  const trendLabel = document.getElementById("trendLabel");
  if (trendLabel) trendLabel.innerText = `${fromCurrency.value} to ${toCurrency.value}`;
  // Update 1-unit line (API)
  updateOneRate(fromCurrency.value, toCurrency.value);
});
 
// ===============================
// Conversion Logic (API) - only on button click
// ===============================
convertBtn.addEventListener("click", async () => {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;
 
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
 
  // UI state while "processing"
  const originalBtnText = convertBtn.innerText;
  convertBtn.disabled = true;
  convertBtn.innerText = "Converting…";
 
  try {
    // API conversion
    const converted = await convertViaAPI(amount, from, to);
 
    rateInfo.innerText = `${amount} ${from} is approximately`;
    bigResult.innerText = `${Number(converted).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    })} ${to}`;
 
    // Update the per-1 line (API)
    await updateOneRate(from, to);
 
    addToHistory({ from, to, amount, converted: Number(converted).toFixed(2) });
 
    const trendLabel = document.getElementById("trendLabel");
    if (trendLabel) trendLabel.innerText = `${from} to ${to}`;
  } catch (err) {
    console.error(err);
    alert(err.message || "Conversion failed. Please try again.");
  } finally {
    convertBtn.disabled = false;
    convertBtn.innerText = originalBtnText;
  }
});
 
// ===============================
// Swap currencies (no auto-convert)
// ===============================
swapBtn.addEventListener("click", () => {
  const tmp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tmp;
 
  // Update flags
  updateFlags();
 
  // Clear previous outputs so it’s clear no new conversion happened
  rateInfo.innerText = "";
  bigResult.innerText = "";
 
  // Update trends label
  const trendLabel = document.getElementById("trendLabel");
  if (trendLabel) trendLabel.innerText = `${fromCurrency.value} to ${toCurrency.value}`;
 
  // Update the 1-unit display after swap (API)
  updateOneRate(fromCurrency.value, toCurrency.value);
 
  // If Trends page is visible, optionally refresh the chart
  const trendsVisible = document.getElementById("trends-page").style.display !== "none";
  if (trendsVisible) updateTrendGraph();
});
 
// ===============================
// History Helpers (with flag <img> tags)
// ===============================
function addToHistory({ from, to, amount, converted }) {
  const fromCC = currencyToCountry[from] || "un";
  const toCC = currencyToCountry[to] || "un";
 
  const li = document.createElement("li");
  li.innerHTML = `
    ${flagUrl(fromCC)}
    ${Number(amount).toLocaleString()} ${from}
    &nbsp;→&nbsp;
    ${Number(converted).toLocaleString()} ${to}
    ${flagUrl(toCC)}
  `;
  historyList.prepend(li);
 
  // Trim UI list to MAX_HISTORY
  while (historyList.children.length > MAX_HISTORY) {
    historyList.removeChild(historyList.lastChild);
  }
 
  // Persist across reloads
  let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
  history.unshift({ from, to, amount, converted });
  history = history.slice(0, MAX_HISTORY);
  localStorage.setItem("conversionHistory", JSON.stringify(history));
}
 
// ===============================
// Trend Graph Logic (last 30 days) with rich tooltips (API: Frankfurter)
// ===============================
async function updateTrendGraph() {
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;
 
  try {
    const end = new Date().toISOString().split("T")[0];
    const start = new Date();
    start.setDate(start.getDate() - 30);
    const startStr = start.toISOString().split("T")[0];
 
    const res = await fetch(
      `https://api.frankfurter.app/${startStr}..${end}?from=${from}&to=${to}`
    );
    if (!res.ok) throw new Error("Failed to fetch historical data");
    const data = await res.json();
    const labels = Object.keys(data.rates).sort(); // chronological
    const points = labels.map((d) => data.rates[d][to]);
    const ctx = document.getElementById("trendChart").getContext("2d");
    if (myChart) myChart.destroy();
 
    myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `Rate (${from}→${to})`,
            data: points,
            borderColor: "#c40303",
            backgroundColor: "rgba(235, 37, 37, 0.12)",
            tension: 0.3,
            fill: true,
            pointRadius: 2,
            pointHoverRadius: 5,
            pointHitRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false, axis: "x" },
        plugins: {
          legend: { labels: { color: "#553333" } },
          tooltip: {
            enabled: true,
            displayColors: false,
            callbacks: {
              title: (items) => (items.length ? items[0].label : ""),
              label: (ctx) => {
                const val = Number(ctx.parsed.y);
                return `Rate: ${val.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}`;
              },
              afterLabel: () => `Pair: ${from} → ${to}`,
            },
          },
        },
        scales: {
          x: { ticks: { color: "#8b6464" }, grid: { display: false } },
          y: {
            ticks: { color: "#8b6464" },
            grid: { color: "rgba(148, 163, 184, 0.29)" },
          },
        },
        hover: { mode: "index", intersect: false },
      },
    });
 
    const trendLabel = document.getElementById("trendLabel");
    if (trendLabel) trendLabel.innerText = `${from} to ${to}`;
  } catch (err) {
    console.error(err);
    alert("Sorry, couldn't load the trend chart. Please try again.");
  }
}
 
// ===============================
// Splash screen fade
// ===============================
window.onload = function () {
  setTimeout(function () {
    const splash = document.getElementById("splash-screen");
    if (!splash) return;
    splash.style.opacity = "0"; // Fade out
 
    // Completely remove from view after fade animation finishes
    setTimeout(() => {
      splash.style.display = "none";
    }, 500);
  }, 1050); // ~1 second
};
 
// ===============================
// Clear Button Logic
// ===============================
const clearBtn = document.getElementById("clearBtn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    amountInput.value = "";
    rateInfo.innerText = "";
    bigResult.innerText = "";
    // Keep or clear the one-rate line based on your preference:
    // oneRateInfo.innerText = ''; // uncomment if you want to hide it on clear
    amountInput.focus();
  });
}
 
// ===============================
// Toggle Button Logic (Dark/Light mode)
// ===============================
const themeToggleContainer = document.getElementById("themeToggleContainer");
const themeLabel = document.getElementById("themeLabel");
const sidebarLogo = document.querySelector(".sidebar-img");
 
// swap logo helper
const updateLogo = (isDark) => {
  if (sidebarLogo) {
    sidebarLogo.src = isDark ? "logo-dark.png" : "logo.png";
  }
};
 
// check saved preference
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  if (themeLabel) themeLabel.innerText = "Light Mode";
  updateLogo(true);
}
 
// toggle click
if (themeToggleContainer) {
  themeToggleContainer.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    if (themeLabel) themeLabel.innerText = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateLogo(isDark);
  });
}
 
// ===============================
// ABOUT US CARDS
// ===============================
const teamMembers = [
  { name: "Likhitha", quote: "Leadership is the capacity to translate vision into reality." },
  { name: "Mathi", quote: "The best error message is the one that never shows up." },
  { name: "Mithun", quote: "Design adds value faster than it adds cost." },
  { name: "Pranav", quote: "Don't find customers for your products, find products for your customers." },
  { name: "Swastika", quote: "Efficiency is doing things right; effectiveness is doing the right things." },
  { name: "Vitesh", quote: "Customer service shouldn't just be a department, it should be the entire company." },
];
 
function showAboutPage(pageId) {
  // Hide all sections
  document.getElementById("converter-page").style.display =
    pageId === "converter" ? "block" : "none";
  document.getElementById("trends-page").style.display =
    pageId === "trends" ? "block" : "none";
  const aboutPage = document.getElementById("about-page");
  if (aboutPage) aboutPage.style.display = pageId === "about" ? "block" : "none";
 
  // Update Sidebar Active State
  const navItems = document.querySelectorAll(".sidebar li");
  navItems.forEach((li) => li.classList.remove("active"));
  if (event?.currentTarget) {
    event.currentTarget.classList.add("active");
  }
 
  // If "About" is selected, render cards if they aren't there
  if (pageId === "about") {
    renderTeamCards();
  }
}
window.showAboutPage = showAboutPage;
 
function renderTeamCards() {
  const grid = document.getElementById("team-grid");
  if (grid && grid.innerHTML.trim() === "") {
    grid.innerHTML = teamMembers
      .map(
        (member) => `
      <div class="card-container">
        <div class="card-inner">
          <div class="card-front">
            <h3>${member.name}</h3>
            <span class="hover-text">Hover for Insight</span>
          </div>
          <div class="card-back">
            <p>${member.quote}</p>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }
}







