import { fetchData } from "./fetch.js";

//loads the latest diary entry from the API and updates the HTML elements with the data
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log("Ei löytynyt voimassa olevaa tokenia.");
    return;
  }

  const url = "http://127.0.0.1:3000/api/entries";
  const options = {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  };

  const data = await fetchData(url, options);

  if (data.error) {
    console.log(data.error);
    return;
  }

  if (!data.length) {
    console.log("Ei päiväkirjamerkintöjä löytynyt.");
    return;
  }

  const latest = data.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date))[0];

  
  // Update the HTML elements with the latest entry data
  document.getElementById("latest-date").textContent = formatDate(latest.entry_date);
  document.getElementById("latest-notes").textContent = latest.notes || "-";
  let stressCategory = "-";
  if (typeof latest.stress_level === "number") {
    if (latest.stress_level >= 8) {
      stressCategory = "Korkea stressi";
    } else if (latest.stress_level >= 4) {
      stressCategory = "Kohtalainen stressi";
    } else {
      stressCategory = "Normaali stressi";
    }
  }
document.getElementById("latest-stress").textContent = stressCategory;

});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("fi-FI");
}
