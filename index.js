import "./pages/home/home.js";
import "./pages/why/why.js";
import "./pages/vision/vision.js";
import "./pages/history/history.js";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const exploreBtn = document.querySelector(".explore-btn");
  const navItems = document.querySelector(".nav-items");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      // Add scroll state classes
      header.classList.add("scrolled");
      exploreBtn.classList.add("scrolled");
      navItems.classList.add("scrolled");
    } else {
      // Remove scroll state classes
      header.classList.remove("scrolled");
      exploreBtn.classList.remove("scrolled");
      navItems.classList.remove("scrolled");
    }
  });
});
