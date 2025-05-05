import { fetchData } from "./fetch.js"; 


document.addEventListener("DOMContentLoaded", function () {
  const logaccordionrm = document.querySelector(".login-form"); // Adjusted selector

  const loginUser = async (event) => {
    event.preventDefault();

    // Extract values input fields
    const username = document.querySelector("#login-username").value.trim();
    const password = document.querySelector("#login-pass").value.trim();

 
    const bodyData = {
      username: username, 
      password: password,
    };

    // API Endpoint
    const url = "http://4.231.239.48/api/auth/login";

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
      window.location.href = "data.html"; 
    }

    console.log("Login response:", response);
    logaccordionrm.reset(); // Clear form fields
  };

  document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            console.log("Logging out...");

            localStorage.removeItem("token");
            localStorage.removeItem("user_id");

            window.location.href = "login.html";
        });
    }
});


  logaccordionrm.addEventListener("submit", loginUser);
});