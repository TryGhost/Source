function revealPwywControls(e) {
  const plan = e.target.id.split("-")[1];
  const card = document.querySelector(`.gh-plan-card.${plan}`);
  card.querySelector(".gh-signup-label-wrapper-inline").classList.remove("hidden");
  card.querySelector(".gh-signup-default").classList.add("hidden");

  const customAmountInput = document.getElementById(`signup-${plan}-custom-amount`);
  customAmountInput.addEventListener("blur", validateCustomAmount);
}

function validateCustomAmount(e) {
  const plan = e.target.getAttribute("data-plan");
  const card = document.querySelector(`.gh-plan-card.${plan}`);
  const errorField = card.querySelector(".gh-signup-error");
  const chooseButton = card.querySelector(".gh-signup-choose");
  errorField.innerHTML = "";
  const valueStr = e.target.value;
  const value = Number(valueStr);
  if (e.target.value == "") {
    errorField.innerHTML = "Please enter an amount";
    chooseButton.setAttribute("disabled", true);
  } else if (isNaN(value)) {
    errorField.innerHTML = "Invalid amount";
    chooseButton.setAttribute("disabled", true);
  } else if (value < Number(e.target.min)) {
    errorField.innerHTML = `Must be greater than $${e.target.min}`;
    chooseButton.setAttribute("disabled", true);
  } else {
    chooseButton.removeAttribute("disabled");
  }
}

function signup() {
  const pwywRevealButtons = document.querySelectorAll(".gh-pwyw button");
  for (const button of pwywRevealButtons) {
    button.addEventListener("click", revealPwywControls);
  }
}
