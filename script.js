document.addEventListener("DOMContentLoaded", () => {
  let nextButton = document.getElementById("next");
  let prevButton = document.getElementById("prev");
  let carousel = document.querySelector(".carousel");
  let listHTML = document.querySelector(".carousel .list");
  let seeMoreButtons = document.querySelectorAll(".seeMore");
  let backButton = document.getElementById("back");
  const cardElements = document.querySelectorAll(".cards .card");
  const themeToggleButton = document.getElementById("theme-toggle");
  const body = document.getElementById("body");

  nextButton.onclick = function () {
    showSlider("next");
  };
  prevButton.onclick = function () {
    showSlider("prev");
  };
  let unAcceppClick;
  const showSlider = (type) => {
    nextButton.style.pointerEvents = "none";
    prevButton.style.pointerEvents = "none";

    carousel.classList.remove("next", "prev");
    let items = document.querySelectorAll(".carousel .list .item");
    if (type === "next") {
      listHTML.appendChild(items[0]);
      carousel.classList.add("next");

      
    } else {
      listHTML.prepend(items[items.length - 1]);
      carousel.classList.add("prev");
    }
    clearTimeout(unAcceppClick);
    unAcceppClick = setTimeout(() => {
      nextButton.style.pointerEvents = "auto";
      prevButton.style.pointerEvents = "auto";
    }, 1000);
  };

  seeMoreButtons.forEach((button) => {
    button.onclick = function () {
      backButton.style.visibility = "visible";
      carousel.classList.remove("next", "prev");
      carousel.classList.add("showDetail");
    };
  });
  backButton.onclick = function () {
    carousel.classList.remove("showDetail");
    backButton.style.visibility = "hidden";
  };

  function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("dark");
    }
  }

  applySavedTheme();

  themeToggleButton.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.removeItem("theme");
    }
  });

  const moveToSlide = (targetId) => {
    const items = document.querySelectorAll(".carousel .list .item");
    let currentIndex = Array.from(items).findIndex((item) =>
      item.classList.contains("active-slide")
    );
    if (currentIndex === -1) {
      currentIndex = 1;
    }

    const targetIndex = Array.from(items).findIndex(
      (item) => item.id === targetId
    );

    if (targetIndex === -1 || targetIndex === currentIndex) {
      return;
    }

    const steps = targetIndex - currentIndex;

    if (steps > 0) {
      for (let i = 0; i < steps; i++) {
        showSlider("next");
      }
    } else {
      for (let i = 0; i < Math.abs(steps); i++) {
        showSlider("prev");
      }
    }
  };

  cardElements.forEach((card) => {
    card.addEventListener("click", () => {
      const targetId = card.getAttribute("data-target");
      moveToSlide(targetId);
    });
  });

  const updateActiveCard = () => {
    const currentItem = document.querySelector(
      ".carousel .list .item:nth-child(2)"
    );
    if (currentItem) {
      const currentItemId = currentItem.id;
      document.querySelectorAll(".cards .card").forEach((card) => {
        card.classList.remove("active");
      });
      const activeCard = document.querySelector(
        `.cards .card[data-target="${currentItemId}"]`
      );
      if (activeCard) {
        activeCard.classList.add("active");
      }
    }
  };

  updateActiveCard();

  const observer = new MutationObserver(updateActiveCard);
  observer.observe(listHTML, { childList: true });
});
