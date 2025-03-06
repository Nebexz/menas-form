document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("p6xkHYLq4HxRFd-29"); // Replace with your EmailJS User ID

  const accordion = document.querySelector(".accordion");
  const accordionHeader = document.querySelector(".accordion-header");
  const selectedOption = document.getElementById("selected-option");
  const radioButtons = document.querySelectorAll(".accordion-radio");
  const textInput = document.querySelector(".text-input");
  const backPage = document.querySelector(".back-page");
  const nextPage = document.querySelector(".next-page");
  const progressCircle = document.querySelector(".progress-circle");
  const progressText = document.querySelector(".progress-text");

  const formPages = document.querySelectorAll(".content");
  const nextButtons = document.querySelectorAll(".next-button");
  const backButtons = document.querySelectorAll(".back-button");
  const submitButton = document.querySelector(".submit");
  const inputs = document.querySelectorAll("input, textarea");
  let currentPage = 0;
  let progress = 0;
  const stepInput = 25; // Progress when user starts entering content
  const stepNext = 8.33; // Additional progress when clicking "Next"

  let inputFilled = [false, false, false]; // Track if user has entered content

  function updateProgress() {
    // Base progress from navigation
    let totalProgress = currentPage * 33.33;

    // Add input progress only for the current page
    if (inputFilled[currentPage]) {
      totalProgress += stepInput; // Add 25% if input is filled on the current page
    }

    // Ensure progress does not exceed 100% or go below 0%
    progress = Math.min(100, Math.max(0, totalProgress));

    // Update the UI
    progressCircle.style.strokeDasharray = `${progress}, 100`;
    progressText.textContent = `${Math.round(progress)}%`;
  }

  // Detect input changes for regular inputs
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      let pageIndex = Math.floor(index / (inputs.length / 3)); // Determine which page this input belongs to

      if (!inputFilled[pageIndex]) {
        inputFilled[pageIndex] = true; // Mark this question as started
        updateProgress();
      }
    });
  });

  // Detect radio button selection
  radioButtons.forEach((radio, index) => {
    radio.addEventListener("change", function () {
      // Determine which page this radio button belongs to
      let pageIndex = Array.from(formPages).findIndex((page) =>
        page.contains(radio)
      );

      if (!inputFilled[pageIndex]) {
        inputFilled[pageIndex] = true; // Mark this question as started
        updateProgress();
      }

      // If the last radio button is selected, activate its associated text input
      if (radio.value === "last-option" && radio.checked) {
        const textInput = document.querySelector("#dynamic-text-input"); // Replace with the actual ID of the dynamic text input
        textInput.style.display = "block"; // Show the text input

        // Track changes in the dynamic text input
        textInput.addEventListener("input", function () {
          if (!inputFilled[pageIndex]) {
            inputFilled[pageIndex] = true; // Mark this question as started
            updateProgress();
          }
        });
      }
    });
  });

  // Handle Next button click
  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (currentPage < formPages.length - 1) {
        currentPage++;
        progress += stepNext; // Add 8.33% when clicking "Next"
        updateProgress();
      }
    });
  });

  // Handle Back button click
  backButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (currentPage > 0) {
        progress -= stepNext; // Decrease by 8.33% when going back
        currentPage--;
        updateProgress();
      }
    });
  });

  submitButton.addEventListener("click", () => {
    if (currentPage > 0) {
      progress = Math.min(100, Math.max(0, 100));

      progressCircle.style.strokeDasharray = "283, 283";
      progressText.textContent = `${Math.round(progress)}%`;
    }
  });

  updateProgress();
  // Toggle accordion open/close
  accordionHeader.addEventListener("click", () => {
    accordion.classList.toggle("open");
  });

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
      const label = radio.nextElementSibling;
      label.style.animation = "blink 0.3s ease 2";

      if (radio.id !== "item3") {
        setTimeout(() => {
          selectedOption.textContent = radio.nextElementSibling.textContent;
          accordion.classList.remove("open");
          label.style.animation = "";
        }, 600);
      } else {
        setTimeout(() => {
          label.style.animation = "";
        }, 600);
      }
    });
  });

  textInput.addEventListener("input", () => {
    if (textInput.value.trim() !== "") {
      selectedOption.textContent = `Other: ${textInput.value}`;
    } else {
      selectedOption.textContent = "Other (Specify)";
    }
  });

  let formData = {}; // Object to store user answers
  let currentIndex = 0;
  const contents = document.querySelectorAll(".content");

  function showQuestion(index, direction) {
    if (index < 0 || index >= contents.length) return;

    saveAnswer(); // Save before validation

    const currentQuestion = contents[currentIndex];

    // Ensure there's an answer for the current question before proceeding
    let isAnswered = false;

    // Check email input
    const emailInput = currentQuestion.querySelector("input[type='email']");
    if (emailInput && emailInput.value.trim() !== "") {
      isAnswered = true;
    }

    // Check selected radio button
    const selectedRadio = currentQuestion.querySelector(
      "input[type='radio']:checked"
    );
    if (selectedRadio) {
      isAnswered = true;
    }

    // Check text inputs and textarea
    const textInputs = currentQuestion.querySelectorAll("textarea");
    textInputs.forEach((input) => {
      if (input.value.trim() !== "") {
        isAnswered = true;
      }
    });

    if (!isAnswered) {
      alert("Please answer the question before proceeding.");
      return;
    }

    // Proceed with animation and transition
    const nextQuestion = contents[index];

    nextQuestion.style.display = "flex";
    nextQuestion.style.opacity = "1";
    nextQuestion.style.transition = "none";
    nextQuestion.style.transform =
      direction === "next" ? "translateY(100%)" : "translateY(-100%)";

    void nextQuestion.offsetWidth;

    currentQuestion.style.transition = "transform 0.5s ease, opacity 0.5s ease";
    nextQuestion.style.transition = "transform 0.5s ease, opacity 0.5s ease";

    currentQuestion.style.transform =
      direction === "next" ? "translateY(-100%)" : "translateY(100%)";
    currentQuestion.style.opacity = "0";

    nextQuestion.style.transform = "translateY(0)";
    nextQuestion.style.opacity = "1";

    setTimeout(() => {
      currentQuestion.style.display = "none";
      currentQuestion.style.transition = "";
      nextQuestion.style.transition = "";
      currentIndex = index;
      updateProgress();
    }, 500);
  }

  function saveAnswer() {
    const currentQuestion = contents[currentIndex];

    const emailInput = currentQuestion.querySelector("input[type='email']");
    if (emailInput) {
      formData.email = emailInput.value.trim();
    }

    const selectedRadio = currentQuestion.querySelector(
      "input[type='radio']:checked"
    );
    if (selectedRadio) {
      if (selectedRadio.id === "item3") {
        formData[`focusArea`] = textInput.value.trim();
      } else {
        formData[`focusArea`] = selectedRadio.nextElementSibling.textContent;
      }
    }

    const textInputs = currentQuestion.querySelectorAll("textarea");
    textInputs.forEach((input) => {
      formData[`comments`] = input.value.trim().replace(/\n/g, "<br>");
    });
  }

  function sendEmail() {
    saveAnswer();

    emailjs
      .send("service_6arzvgv", "template_h8go894", formData)
      .then(() => {
        alert("Form submitted successfully!");
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
      });
  }

  document.querySelectorAll(".next-button, .next-page").forEach((button) => {
    button.addEventListener("click", () => {
      saveAnswer();
      if (currentIndex < contents.length - 1) {
        showQuestion(currentIndex + 1, "next");
      } else {
        sendEmail();
      }
    });
  });

  document.querySelectorAll(".back-button, .back-page").forEach((button) => {
    button.addEventListener("click", () => {
      showQuestion(currentIndex - 1, "prev");
    });
  });

  contents.forEach((content, index) => {
    content.style.display = index === 0 ? "flex" : "none";
  });

  updateProgress();
});
