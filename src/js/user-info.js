import { fetchData } from "./fetch.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token"); // Hakee tokenin

  if (!token) {
    alert("Kirjaudu sisään");
    window.location.href = "login.html";
    return;
  }

  const url = "http://127.0.0.1:3000/api/kubios-data/user-info";
  
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetchData(url, options);

    if (response && response.user) {
      const birthdate = new Date(response.user.birthdate);
      const formattedBirthdate = birthdate.toLocaleDateString("fi-FI");

      document.getElementById("given-name").textContent = response.user.given_name;
      document.getElementById("family-name").textContent = response.user.family_name;
      document.getElementById("birthdate").textContent = formattedBirthdate;
      document.getElementById("email").textContent = response.user.email;
    } else {
      console.error("Virheellinen vastaus:", response);
      alert("Tietojen hakeminen epäonnistui.");
    }
  } catch (error) {
    console.error("Virhe:", error);
  }
});