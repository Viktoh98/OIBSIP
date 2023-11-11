"use strict";
(function registerAction() {
  const forms = document.querySelectorAll(".register__form");
  const toggleLinks = document.querySelectorAll(".toggle");

  for (const link of toggleLinks) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      for (const form of forms) {
        form.classList.toggle("active");
      }
    });
  }
})();
