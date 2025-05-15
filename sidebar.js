document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarClose = document.getElementById("sidebar-close");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  // Toggle sidebar
  sidebarToggle.addEventListener("click", toggleSidebar);

  // Close sidebar with button
  sidebarClose.addEventListener("click", closeSidebar);

  // Close sidebar when clicking overlay
  sidebarOverlay.addEventListener("click", closeSidebar);

  // Handling sidebar menu items
  const menuItems = document.querySelectorAll(".sidebar-menu-link");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all menu items
      menuItems.forEach((mi) => mi.classList.remove("active"));

      // Add active class to clicked item
      this.classList.add("active");

      // On mobile, close the sidebar when an item is clicked
      if (window.innerWidth < 768) {
        closeSidebar();
      }
    });
  });

  // Functions
  function toggleSidebar() {
    sidebar.classList.toggle("open");
    sidebarOverlay.classList.toggle("visible");

    // For accessibility
    if (sidebar.classList.contains("open")) {
      sidebar.setAttribute("aria-expanded", "true");
    } else {
      sidebar.setAttribute("aria-expanded", "false");
    }
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("visible");
    sidebar.setAttribute("aria-expanded", "false");
  }

  // Handle resize events
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1200) {
      sidebar.classList.add("open");
    } else {
      // Auto-close sidebar on smaller screens
      closeSidebar();
    }
  });
});
