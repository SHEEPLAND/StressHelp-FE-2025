const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Add event listeners to each tab button
tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    
    tabButtons.forEach(btn => btn.classList.remove("active"));
    tabContents.forEach(content => content.classList.remove("active"));

 
    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});