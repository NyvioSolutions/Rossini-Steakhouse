import { initMotion } from "./motion.js";
import {
  getRestaurantNow,
  getAvailableTimes,
  validateReservation,
  buildReservationUrl,
} from "./reservation.mjs";

// Keep in sync with the collapse breakpoint in style.css.
const DESKTOP_NAV = "(min-width: 1024px)";

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
  matchMedia(DESKTOP_NAV).addEventListener("change", (event) => {
    if (event.matches) close();
  });
}

/** Marks the navigation link of the section crossing the middle of the viewport. */
function initSectionHighlight() {
  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll('#navigation a[href^="#"]')];
  const sections = document.querySelectorAll("main > section[id]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) =>
          link.getAttribute("href") === `#${entry.target.id}`
            ? link.setAttribute("aria-current", "true")
            : link.removeAttribute("aria-current"),
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

function initReservation() {
  const form = document.querySelector("#reservation-form");
  const fields = [...form.querySelectorAll("input, select, textarea")];
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
      "Solicitação pronta. Envie a mensagem no WhatsApp e aguarde a confirmação da equipe. Se a conversa não abriu, use o link abaixo.";
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
initSectionHighlight();
initReservation();
initMotion();
document.querySelector("#year").textContent = new Date().getFullYear();
