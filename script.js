const accordion = document.querySelector(".accordion");
const accordionHeader = document.querySelector(".accordion-header");
const selectedOption = document.getElementById("selected-option");
const accordionContent = document.querySelector(".accordion-content");
const radioButtons = document.querySelectorAll(".accordion-radio");
const textInput = document.querySelector(".text-input");

// Toggle accordion open/close
accordionHeader.addEventListener("click", () => {
  accordion.classList.toggle("open");
});

radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    // Add blinking effect
    const label = radio.nextElementSibling;
    label.style.animation = "blink 0.3s ease 2";

    // Collapse the accordion only if it's not the last option
    if (radio.id !== "item3") {
      // Replace 'item3' with the ID of the last option
      setTimeout(() => {
        selectedOption.textContent = radio.nextElementSibling.textContent;
        accordion.classList.remove("open");
        label.style.animation = ""; // Reset animation
      }, 600); // 2 blinks * 0.3s = 600ms
    } else {
      // Reset animation for the last option
      setTimeout(() => {
        label.style.animation = "";
      }, 600);
    }
  });
});
// Update selected option when typing in the text input
textInput.addEventListener("input", () => {
  if (textInput.value.trim() !== "") {
    selectedOption.textContent = `Other: ${textInput.value}`;
  } else {
    selectedOption.textContent = "Other (Specify)";
  }
});
