const RESTAURANT_PHONE = "559833033769";
const PARTY_SIZES = new Set([
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Mais de 10",
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

export function getAvailableTimes(value, now = getRestaurantNow()) {
  const date = parseDate(value);
  if (!date || value < now.date || date.getUTCDay() === 1) return [];
  const periods = [[675, 900]];
  if (date.getUTCDay() !== 0) periods.push([1095, 1380]);
  return periods
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
  const date = parseDate(values.date);
  if (!date) errors.date = "Escolha uma data válida.";
  else if (values.date < now.date)
    errors.date = "Escolha hoje ou uma data futura.";
  else if (date.getUTCDay() === 1)
    errors.date = "Fechado às segundas-feiras. Escolha outro dia.";
  else if (!getAvailableTimes(values.date, now).length)
    errors.date = "Não há mais horários hoje. Escolha outra data.";
  if (!getAvailableTimes(values.date, now).includes(values.time))
    errors.time = "Escolha um horário disponível para a data.";
  if (!PARTY_SIZES.has(values.people))
    errors.people = "Selecione o número de pessoas.";
  return errors;
}

export function buildReservationUrl(values) {
  const date = values.date.split("-").reverse().join("/");
  const message = [
    "Olá, Rossini! Gostaria de solicitar uma reserva.",
    "",
    `Nome: ${values.name.trim()}`,
    `Data: ${date}`,
    `Horário: ${values.time}`,
    `Pessoas: ${values.people}`,
    "",
    "Aguardo a confirmação da disponibilidade.",
  ].join("\n");
  return `https://wa.me/${RESTAURANT_PHONE}?text=${encodeURIComponent(message)}`;
}
