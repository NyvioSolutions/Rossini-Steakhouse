import {
  getRestaurantNow,
  getAvailableTimes,
  validateReservation,
  buildReservationUrl,
} from "./reservation.mjs";

function initNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#navigation");
  const icon = toggle.querySelector("use");
  const close = () => {
    navigation.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    icon.setAttribute("href", "#icon-menu");
  };
  document.documentElement.classList.add("navigation-ready");
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    const open = navigation.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    icon.setAttribute("href", open ? "#icon-close" : "#icon-menu");
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      close();
      toggle.focus();
    }
  });
  navigation.addEventListener("focusout", (event) => {
    if (
      !navigation.contains(event.relatedTarget) &&
      event.relatedTarget !== toggle
    )
      close();
  });
  matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
    if (event.matches) close();
  });
}

function initReservation() {
  const form = document.querySelector("#reservation-form");
  const fields = [...form.querySelectorAll("input, select")];
  const date = form.elements.date;
  const time = form.elements.time;
  const result = form.querySelector(".form-result");
  const submit = form.querySelector('[type="submit"]');
  let submitting = false;
  const values = () =>
    Object.fromEntries(fields.map((field) => [field.name, field.value.trim()]));
  const setError = (field, message = "") => {
    field.setAttribute("aria-invalid", String(Boolean(message)));
    document.querySelector(`#${field.id}-error`).textContent = message;
  };
  const refreshTimes = () => {
    date.min = getRestaurantNow().date;
    const previous = time.value;
    const times = getAvailableTimes(date.value);
    const label = !date.value
      ? "Escolha a data primeiro"
      : times.length
        ? "Selecione o horário"
        : "Escolha outra data";
    time.replaceChildren(new Option(label, ""));
    times.forEach((slot) => time.add(new Option(slot, slot)));
    time.disabled = !times.length;
    if (times.includes(previous)) time.value = previous;
    else result.hidden = true;
  };
  const validateField = (field) =>
    setError(field, validateReservation(values())[field.name]);
  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      result.hidden = true;
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });
  date.addEventListener("change", () => {
    refreshTimes();
    validateField(date);
    setError(time);
    result.hidden = true;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitting) return;
    const data = values();
    const errors = validateReservation(data);
    fields.forEach((field) => setError(field, errors[field.name]));
    if (Object.keys(errors).length) {
      fields.find((field) => errors[field.name] && !field.disabled)?.focus();
      return;
    }
    submitting = true;
    submit.disabled = true;
    const url = buildReservationUrl(data);
    form.querySelector("#reservation-link").href = url;
    result.hidden = false;
    form.querySelector("#form-status").textContent =
      "Solicitação preparada. Envie a mensagem no WhatsApp e aguarde a confirmação da equipe. Se a janela não abriu, use o link abaixo.";
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      submitting = false;
      submit.disabled = false;
    }, 1200);
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshTimes();
  });
  refreshTimes();
  form.hidden = false;
}

initNavigation();
initReservation();
document.querySelector("#year").textContent = new Date().getFullYear();
