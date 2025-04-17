import { fetchData } from "./fetch.js"; 


document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-form"); // Adjusted selector

  const loginUser = async (event) => {
    event.preventDefault();

    // Extract values from your input fields
    const username = document.querySelector("#login-username").value.trim();
    const password = document.querySelector("#login-pass").value.trim();

 
    const bodyData = {
      username: username, 
      password: password,
    };

    // API Endpoint
    const url = "http://127.0.0.1:3000/api/auth/login";

    // API Request Options
    const options = {
      body: JSON.stringify(bodyData),
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    };

    console.log("Sending request:", options);

    // Call the API using fetchData function
    const response = await fetchData(url, options);

    if (response.error) {
      console.error("Login error:", response.error);
      alert("Invalid login credentials");
      return;
    }

    if (response.message) {
      console.log(response.message, "success");
      localStorage.setItem("token", response.token);
      localStorage.setItem("nimi", response.user.username);
      alert("Login successful! Redirecting...");
      // Redirect to another page after successful login
      window.location.href = "diary-page.html"; 
    }

    console.log("Login response:", response);
    loginForm.reset(); // Clear form fields
  };

  document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            console.log("Logging out...");

            // ✅ Remove user authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");

            // ✅ Redirect to login page
            window.location.href = "login.html";
        });
    }
});


  // Attach event listener
  loginForm.addEventListener("submit", loginUser);
});

