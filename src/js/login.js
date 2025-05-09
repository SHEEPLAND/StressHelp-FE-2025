import { fetchData } from "./fetch.js";

// Function to handle login form submission
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-form");

  const loginUser = async (event) => {
    event.preventDefault();

    // Extract values input fields
    const username = document.querySelector("#login-username").value.trim();
    const password = document.querySelector("#login-pass").value.trim();

    const bodyData = {
      username,
      password,
    };

    const url = "http://127.0.0.1:3000/api/auth/login";

// API Request Options
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(bodyData),
    };

    try {
      console.log("Lähetetään kirjautumispyyntö:", options);
      const response = await fetchData(url, options);
      
// Call the API using fetchData function
      if (response.error) {
        console.error("Kirjautumisvirhe:", response.error);
        alert("Virheelliset tunnistetiedot.");
        return;
      }

      if (response.message) {
        console.log("Kirjautuminen onnistui:", response.message);
        localStorage.setItem("token", response.token);
        localStorage.setItem("nimi", response.user.username);
        //alert("Kirjautuminen onnistui! Uudelleenohjataan...");
        window.location.href = "data.html";
      }

      loginForm.reset();
    } catch (err) {
      console.error("Odottamaton virhe:", err);
      alert("Jokin meni pieleen. Yritä uudelleen.");
    }
  };

  // Lisätään tapahtumankuuntelija lomakkeelle
  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }

  // Uloskirjautuminen (jos nappi löytyy)
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      console.log("Kirjaudutaan ulos...");
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      window.location.href = "login.html";
    });
  }
});
