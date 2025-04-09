import { fetchData } from "./fetch.js"; 

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-form");

  const loginUser = async (event) => {
    event.preventDefault();

    const email = document.querySelector("#login-email").value.trim();
    const password = document.querySelector("#login-pass").value.trim();

    const bodyData = {
      email: email,
      password: password,
    };

    const url = "http://127.0.0.1:3000/api/auth/login";

    const options = {
      body: JSON.stringify(bodyData),
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    };

    console.log("Sending request:", options);

    const response = await fetchData(url, options);

    if (response.error) {
      console.error("Login error:", response.error);
      alert("Invalid login credentials");
      return;
    }

    if (response.message) {
      console.log(response.message, "success");
      localStorage.setItem("token", response.token);
      localStorage.setItem("nimi", response.user.email); 
      alert("Login successful! Redirecting...");
      window.location.href = "data.html"; 
    }

    console.log("Login response:", response);
    loginForm.reset();
  };

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      console.log("Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      window.location.href = "login.html";
    });
  }

  loginForm.addEventListener("submit", loginUser);
});
