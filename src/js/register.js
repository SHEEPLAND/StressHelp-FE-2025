import { fetchData } from "./fetch.js";

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.querySelector(".registerForm");

  const registerUser = async (event) => {
    event.preventDefault();

    // Get form values
    const username = document.querySelector("#username").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    // Create request body
    const bodyData = { username, password, email };

    // API endpoint
    const url = "http://127.0.0.1:3000/api/users";

    // API request options
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(bodyData),
    };

    console.log("Sending registration request:", options);

    const response = await fetchData(url, options);

    if (response.error) {
      console.error("Registration error:", response.error);
      alert("Registration failed: " + response.error);
      return;
    }

    console.log("Registration successful:", response);
    alert("Registration successful! Redirecting to login...");
    window.location.href = "login.html"; // Redirect to login page
  };

  if (registerForm) registerForm.addEventListener("submit", registerUser);
});
