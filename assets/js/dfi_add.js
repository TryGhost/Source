document.addEventListener("DOMContentLoaded", function () {
  // Reference to the menu button and sidebar
  const menuButton = document.getElementById("menu-button");
  const sidebar = document.querySelector(".gh-sidebar");
  const closeButton = document.querySelector(".close-button");

  // Function to close the sidebar
  function closeSidebar() {
    sidebar.style.width = "0px";
    sidebar.style.display = "none";
    sidebar.classList.remove("active");
    closeButton.classList.remove("visible");
    toggleSidebar;
  }

  // Function to handle sidebar toggling
  function toggleSidebar() {
    const closeButton = sidebar.querySelector(".close-button");
    console.log(sidebar.outerHTML);
    if (
      sidebar.style.width === "0px" ||
      sidebar.style.width === "" ||
      sidebar.style.display === "none"
    ) {
      sidebar.style.width = "250px";
      sidebar.style.display = "block";
      sidebar.classList.add("active");
      closeButton.classList.add("visible");

      const tocList = sidebar.querySelector(".gh-toc");
    } else {
      sidebar.style.width = "0px";
      sidebar.style.display = "none";
      sidebar.classList.remove("active");
      closeButton.classList.remove("visible");
    }
    console.log(sidebar.outerHTML);
  }

  console.log(menuButton);
  console.log(closeButton);

  //Event listener to toggle the sidebar
  menuButton.addEventListener("click", toggleSidebar);
  closeButton.addEventListener("click", toggleSidebar);

  //Event listener for clicks outside the sidebar
  document.addEventListener("click", function (event) {
    if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
      closeSidebar();
    }
  });

  // Event listener for window resizing
  //   window.addEventListener("resize", function () {
  //     if (window.innerWidth >= 1300) {
  //       sidebar.style.width = "";
  //       sidebar.style.height = "";
  //       sidebar.classList.remove("active");
  //     } else {
  //       // Optionally, you could add some code to handle the mobile view when resizing to a smaller window.
  //       // For example, reset the sidebar if you want:
  //       sidebar.style.width = "0px";
  //       sidebar.style.height = "0px";
  //       sidebar.classList.remove("active");
  //       if (closeButton) {
  //         closeButton.style.display = "none";
  //       }
  //     }
  //   });
  window.addEventListener("resize", function () {
    // Reset inline styles
    sidebar.style.width = "";
    sidebar.style.display = "";
    closeButton.style.display = "";

    if (window.innerWidth >= 1300) {
      // For large screens, manage the state of the sidebar as needed
      sidebar.classList.remove("active");
      // Add any additional logic if the sidebar should be shown or hidden by default on large screens
    } else {
      // For small screens, ensure the sidebar is in its default state (usually hidden)
      sidebar.classList.remove("active");
      sidebar.style.width = "0px";
      sidebar.style.display = "none";
      //   closeButton.style.display = "none";
    }
  });
});
