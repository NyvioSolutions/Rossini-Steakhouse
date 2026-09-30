// Reservation rules published by the restaurant in its official WhatsApp link
// (rossinisteakhouse.com.br → "Reservas"): groups above 8 people, no
// reservations on Sundays or holidays. Keep in sync with index.html.
export const RESERVATION_PHONE = "559881310790";
export const MIN_PARTY_SIZE = 9;
export const MAX_NOTES_LENGTH = 300;
export const PARTY_SIZES = [
  ...Array.from({ length: 20 - MIN_PARTY_SIZE + 1 }, (_, index) =>
    String(MIN_PARTY_SIZE + index),
  ),
  "Mais de 20",
];

// Minutes after midnight; the last slot starts 15 minutes before closing.
const SERVICES = {
  lunch: [675, 900], // 11h15 às 15h
  dinner: [1095, 1380], // 18h15 às 23h
};
// Tuesday to Saturday only: Monday is closed and Sunday takes no reservations.
const RESERVATION_DAYS = new Set([2, 3, 4, 5, 6]);
const WEEKDAYS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];
// National, Maranhão (28/07) and São Luís (29/06, 08/09, 08/12) fixed holidays.
const FIXED_HOLIDAYS = new Set([
  "01-01",
  "04-21",
  "05-01",
  "06-29",
  "07-28",
  "09-07",
  "09-08",
  "10-12",
  "11-02",
  "11-15",
  "11-20",
  "12-08",
  "12-25",
]);

export function getRestaurantNow(clock = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(clock);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  };
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return null;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
    ? null
    : date;
}

/** Good Friday (Sexta-feira da Paixão), two days before Western Easter. */
function goodFriday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  const easter = new Date(Date.UTC(year, month - 1, day, 12));
  easter.setUTCDate(easter.getUTCDate() - 2);
  return easter.toISOString().slice(0, 10);
}

export function isHoliday(value) {
  const date = parseDate(value);
  if (!date) return false;
  return (
    FIXED_HOLIDAYS.has(value.slice(5)) ||
    value === goodFriday(date.getUTCFullYear())
  );
}

/** Why a date cannot take reservations, or an empty string when it can. */
export function getDateIssue(value, now = getRestaurantNow()) {
  const date = parseDate(value);
  if (!date) return "Escolha uma data válida.";
  if (value < now.date) return "Escolha hoje ou uma data futura.";
  const weekday = date.getUTCDay();
  if (weekday === 1) return "Fechado às segundas-feiras. Escolha outro dia.";
  if (!RESERVATION_DAYS.has(weekday))
    return "Não fazemos reservas aos domingos. Escolha de terça a sábado.";
  if (isHoliday(value))
    return "Não fazemos reservas em feriados. Escolha outra data.";
  return "";
}

export function getAvailableTimes(value, now = getRestaurantNow()) {
  const date = parseDate(value);
  if (!date || value < now.date || !RESERVATION_DAYS.has(date.getUTCDay()))
    return [];
  if (isHoliday(value)) return [];
  return Object.values(SERVICES)
    .flatMap(([start, end]) => {
      const slots = [];
      for (let minute = start; minute < end; minute += 15) {
        slots.push(
          `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`,
        );
      }
      return slots;
    })
    .filter((time) => value !== now.date || time > now.time);
}

export function validateReservation(values, now = getRestaurantNow()) {
  const errors = {};
  const name = (values.name ?? "").trim();
  if (name.length < 2 || name.length > 100)
    errors.name = "Informe seu nome, com 2 a 100 caracteres.";
  const dateIssue = getDateIssue(values.date, now);
  if (dateIssue) errors.date = dateIssue;
  else if (!getAvailableTimes(values.date, now).length)
    errors.date = "Não há mais horários hoje. Escolha outra data.";
  if (!getAvailableTimes(values.date, now).includes(values.time))
    errors.time = "Escolha um horário disponível para a data.";
  if (!PARTY_SIZES.includes(values.people))
    errors.people = `Selecione o número de pessoas: a casa reserva para grupos a partir de ${MIN_PARTY_SIZE}.`;
  if ((values.notes ?? "").trim().length > MAX_NOTES_LENGTH)
    errors.notes = `Use até ${MAX_NOTES_LENGTH} caracteres.`;
  return errors;
}

export function buildReservationUrl(values) {
  const date = parseDate(values.date);
  const day = values.date.split("-").reverse().join("/");
  const notes = (values.notes ?? "").trim();
  const message = [
    "Quero reservar.",
    `Nome: ${values.name.trim()}`,
    `Nº de pessoas: ${values.people}`,
    `Dia: ${day}${date ? ` (${WEEKDAYS[date.getUTCDay()]})` : ""}`,
    `Horário: ${values.time}`,
    `Observações: ${notes || "nenhuma"}`,
    "",
    "Solicitação enviada pelo site. Aguardo a confirmação da equipe.",
  ].join("\n");
  return `https://wa.me/${RESERVATION_PHONE}?text=${encodeURIComponent(message)}`;
}
