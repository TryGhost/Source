const SUCCESS_DIALOG_HTML = `
<div class="gh-signup-popup-illustration">
  <img class="illustration-envelope" src="/content/images/envelope.png" />
</div> 
<p>
  You're on the list! Check your email for a confirmation link.
</p>
<div>
  <a href="/">Go back home</a>, or check out <a href="/#/portal/recommendations">some other publications</a> I think you might enjoy.
</div>`;

function toggleNewslettersAccordion(e) {
  e.preventDefault();
  const newslettersList = document.querySelector(".gh-newsletter-subscription-list");
  if (newslettersList.style.maxHeight) {
    newslettersList.style.maxHeight = null;
    newslettersList.setAttribute("aria-hidden", true);
    e.target.setAttribute("aria-expanded", false);
  } else {
    newslettersList.style.maxHeight = newslettersList.scrollHeight + "px";
    newslettersList.setAttribute("aria-hidden", false);
    e.target.setAttribute("aria-expanded", true);
  }
}

function revealPwywControls(e) {
  e.preventDefault();
  const plan = e.target.id.split("-")[1];
  const card = document.querySelector(`.gh-plan-card.${plan}`);
  card.querySelector(".gh-signup-label-wrapper-inline").classList.remove("hidden");
  card.querySelector(".gh-signup-default").classList.add("hidden");

  const customAmountInput = document.getElementById(`signup-${plan}-custom-amount`);
  customAmountInput.addEventListener("input", onSelectChange);
}

function onSelectChange(e) {
  e.preventDefault();
  const planId = e.target.value;
  const interval = e.target.getAttribute("data-interval");
  const stripeInterval = interval === "annual" ? "yearly" : interval;
  const chooseButton = document.getElementById(`choose-${interval}`);
  chooseButton.setAttribute("data-portal", `signup/${planId}/${stripeInterval}`);
}

function onChooseClick(e) {
  if (e.target.classList.contains("disabled")) {
    e.preventDefault();
  } else {
    e.target.querySelector(".gh-signup-loader").classList.remove("hidden");
  }
}

function onFormClassChanged() {
  const form = document.querySelector("form.gh-signup-form");
  const messageContainer = document.querySelector("dialog.gh-signup-popup .gh-signup-popup-message");
  if (form.classList.contains("success")) {
    messageContainer.innerHTML = SUCCESS_DIALOG_HTML;
    document.querySelector("dialog.gh-signup-popup").showModal();
  } else if (form.classList.contains("error")) {
    messageContainer.innerHTML = `<p>Something went wrong:</p>`;
    document.querySelector("dialog.gh-signup-popup").showModal();
  }
}

function closePopup() {
  const dialog = document.querySelector("dialog.gh-signup-popup");
  const messageContainer = document.querySelector("dialog.gh-signup-popup .gh-signup-popup-message");
  messageContainer.innerHTML = "";
  dialog.close();
}

function validate() {
  const buttons = document.querySelectorAll(".gh-button");
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  if (name !== "" && email !== "" && /^\S+@\S+$/.test(email)) {
    // Valid
    for (const button of buttons) {
      button.classList.remove("disabled");
      button.removeAttribute("disabled");
    }
  } else {
    // Invalid
    for (const button of buttons) {
      button.classList.add("disabled");
      button.setAttribute("disabled", true);
    }
  }
}

function signup() {
  const newsletterSubscriptionButton = document.getElementById("newsletter-accordion-button");
  const pwywRevealButtons = document.querySelectorAll(".gh-pwyw button");
  const form = document.querySelector("form.gh-signup-form");
  const chooseButtons = document.querySelectorAll(".gh-signup-choose");
  const validateFields = [document.getElementById("signup-name"), document.getElementById("signup-email")];
  const dialogCloseButton = document.querySelector("button.gh-signup-popup-close");

  newsletterSubscriptionButton.addEventListener("click", toggleNewslettersAccordion);
  for (const button of pwywRevealButtons) {
    button.addEventListener("click", revealPwywControls);
  }
  for (const chooseButton of chooseButtons) {
    chooseButton.addEventListener("click", onChooseClick);
  }
  for (const field of validateFields) {
    field.addEventListener("keyup", debounce(validate, 100));
  }

  // Form state
  onClassChange(form, onFormClassChanged);
  dialogCloseButton.addEventListener("click", closePopup);
}
