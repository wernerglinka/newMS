const hamburger = (function hamburger() {
  "use strict"

  const init = () => {
    const hamburger = document.querySelector(".js-hamburger");
    const overlay = document.querySelector(".js-overlay");
    const mainMenu = document.querySelector(".js-main-menu");


    hamburger.addEventListener("click", function() {
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        overlay.classList.remove("isActive");
        mainMenu.classList.remove("isActive");
      } else {
        this.classList.add("active");
        overlay.classList.add("isActive");
        mainMenu.classList.add("isActive");
      }
    });
  };
  
  
  return { init }
  
}());

export default hamburger;