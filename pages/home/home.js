document.addEventListener("DOMContentLoaded", () => {
  // Scroll progress and content animation
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");

  // Responsive height adjustment
  const adjustHeroHeight = () => {
    const viewportHeight = window.innerHeight;
    hero.style.minHeight = `${viewportHeight}px`;
    hero.style.height = `${viewportHeight}px`;
  };

  // Initial setup
  adjustHeroHeight();
  window.addEventListener("resize", adjustHeroHeight);

  // Scroll-triggered animations
  const animateOnScroll = () => {
    const scrollProgress = window.pageYOffset / window.innerHeight;

    // Update scroll progress variable for CSS animations
    heroContent.style.setProperty("--scroll-progress", scrollProgress);
  };

  // Add scroll event listener for animations
  window.addEventListener("scroll", animateOnScroll);
});
