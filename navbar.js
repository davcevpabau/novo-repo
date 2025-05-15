document.addEventListener("DOMContentLoaded", () => {
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navbarMenu = document.getElementById("navbar-menu");
  const navItems = document.querySelectorAll(".nav-item");
  const gameLink = document.getElementById("game-link");
  const todoLink = document.getElementById("todo-link");
  const rpsGameContainer = document.getElementById("rps-game-container");
  const todoContainer = document.getElementById("todo-container");

  // Toggle mobile menu
  mobileToggle.addEventListener("click", () => {
    navbarMenu.classList.toggle("mobile-visible");
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".navbar") &&
      navbarMenu.classList.contains("mobile-visible")
    ) {
      navbarMenu.classList.remove("mobile-visible");
    }
  });

  // Handle navigation items
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      // Remove active class from all nav items
      navItems.forEach((ni) => ni.classList.remove("active"));

      // Add active class to clicked item
      this.classList.add("active");

      // Close mobile menu after clicking
      navbarMenu.classList.remove("mobile-visible");
    });
  });

  // Navigation between todo app and game
  if (gameLink && todoLink && rpsGameContainer && todoContainer) {
    gameLink.addEventListener("click", (e) => {
      e.preventDefault();
      todoContainer.style.display = "none";
      rpsGameContainer.style.display = "block";
    });

    todoLink.addEventListener("click", (e) => {
      e.preventDefault();
      rpsGameContainer.style.display = "none";
      todoContainer.style.display = "block";
    });
  }
});
