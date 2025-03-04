document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("p6xkHYLq4HxRFd-29"); // Replace with your EmailJS User ID

  const accordion = document.querySelector(".accordion");
  const accordionHeader = document.querySelector(".accordion-header");
  const selectedOption = document.getElementById("selected-option");
  const radioButtons = document.querySelectorAll(".accordion-radio");
  const textInput = document.querySelector(".text-input");

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
          formData[`focusArea`] = radio.nextElementSibling.textContent;
          console.log("Current Form Data:", formData);
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
      formData[`focusArea`] = `Other: ${textInput.value}`;
      console.log("Current Form Data:", formData);
    } else {
      selectedOption.textContent = "Other (Specify)";
    }
  });

  let formData = {}; // Object to store user answers
  let currentIndex = 0;
  const contents = document.querySelectorAll(".content");

  function showQuestion(index, direction) {
    if (index < 0 || index >= contents.length) return;

    const currentQuestion = contents[currentIndex];
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
        console.log("Current Form Data:", formData);
      } else {
        formData[`focusArea`] = selectedRadio.nextElementSibling.textContent;
        console.log("Current Form Data:", formData);
      }
    }
  }

  function sendEmail() {
    saveAnswer();
    console.log("Final Form Data Sent:", formData); // Log final data before sending
    emailjs
      .send("service_6arzvgv", "template_h8go894", formData)
      .then(() => {
        alert("Form submitted successfully!");
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
      });
  }

  document.querySelectorAll(".next-button").forEach((button) => {
    button.addEventListener("click", () => {
      saveAnswer();
      if (currentIndex < contents.length - 1) {
        showQuestion(currentIndex + 1, "next");
      } else {
        sendEmail();
      }
    });
  });

  document.querySelectorAll(".back-button").forEach((button) => {
    button.addEventListener("click", () => {
      showQuestion(currentIndex - 1, "prev");
    });
  });
  document.querySelector(".back-page").addEventListener("click", () => {
    showQuestion(currentIndex - 1, "prev");
  });
  document.querySelector(".next-page").addEventListener("click", () => {
    showQuestion(currentIndex + 1, "next");
  });

  contents.forEach((content, index) => {
    content.style.display = index === 0 ? "flex" : "none";
  });
});
