export function setupAuthLinks() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById("login-link");
    const loginLinkMobile = document.getElementById("login-link-mobile");
    const linkText = token ? "Kirjaudu ulos" : "Kirjaudu sisään";
    const linkHref = token ? "#" : "login.html";
    
    [loginLink, loginLinkMobile].forEach(link => {
      if (link) {
        link.textContent = linkText;
        link.href = linkHref;
        if (token) {
          link.addEventListener("click", logout); 
        }
      }
    });
  }
  
  export function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
  document.addEventListener("DOMContentLoaded", setupAuthLinks);
  