import test from "node:test";
import assert from "node:assert/strict";
import {
  getAvailableTimes,
  getDateIssue,
  isHoliday,
  validateReservation,
  buildReservationUrl,
  getRestaurantNow,
  PARTY_SIZES,
} from "../reservation.mjs";

// Sunday, 20/09/2026, noon in São Luís.
const now = { date: "2026-09-20", time: "12:00" };
const valid = {
  name: "Cliente de teste",
  date: "2026-09-22",
  time: "12:00",
  people: "12",
  notes: "",
};

test("converts the clock to the restaurant timezone", () => {
  assert.deepEqual(getRestaurantNow(new Date("2026-09-21T01:30:00Z")), {
    date: "2026-09-20",
    time: "22:30",
  });
});

test("Monday, Sunday and impossible dates take no reservations", () => {
  assert.deepEqual(getAvailableTimes("2026-09-21", now), []);
  assert.deepEqual(getAvailableTimes("2026-09-27", now), []);
  assert.deepEqual(getAvailableTimes("2027-02-30", now), []);
  assert.match(getDateIssue("2026-09-21", now), /segundas/);
  assert.match(getDateIssue("2026-09-27", now), /domingos/);
});

test("national, state and city holidays take no reservations", () => {
  assert(isHoliday("2026-11-20"), "Consciência Negra");
  assert(isHoliday("2026-07-28"), "Adesão do Maranhão");
  assert(isHoliday("2026-09-08"), "Aniversário de São Luís");
  assert(isHoliday("2026-04-03"), "Sexta-feira da Paixão 2026");
  assert(isHoliday("2027-03-26"), "Sexta-feira da Paixão 2027");
  assert(!isHoliday("2026-09-22"));
  assert.deepEqual(getAvailableTimes("2026-11-20", now), []);
  assert.match(getDateIssue("2026-11-20", now), /feriados/);
});

test("Tuesday has both services, but no closing-time slot", () => {
  const slots = getAvailableTimes("2026-09-22", now);
  assert.equal(slots.length, 34);
  assert.equal(slots[0], "11:15");
  assert.equal(slots.at(-1), "22:45");
  assert(slots.includes("14:45") && slots.includes("18:15"));
  assert(!slots.includes("15:00") && !slots.includes("23:00"));
});

test("elapsed times cannot be booked today", () => {
  const tuesdayNoon = { date: "2026-09-22", time: "12:00" };
  const slots = getAvailableTimes("2026-09-22", tuesdayNoon);
  assert.equal(slots[0], "12:15");
  assert(!slots.includes("12:00"));
  const lateNight = { date: "2026-09-22", time: "22:50" };
  assert.deepEqual(getAvailableTimes("2026-09-22", lateNight), []);
  assert.match(
    validateReservation({ ...valid, time: "" }, lateNight).date,
    /Não há mais horários/,
  );
});

test("reservations are for groups above eight people", () => {
  assert.equal(PARTY_SIZES[0], "9");
  assert.equal(PARTY_SIZES.at(-1), "Mais de 20");
  assert.deepEqual(validateReservation(valid, now), {});
  assert(validateReservation({ ...valid, people: "8" }, now).people);
  assert(validateReservation({ ...valid, people: "1000" }, now).people);
});

test("validation rejects forged times and oversized notes", () => {
  const errors = validateReservation(
    { ...valid, time: "03:00", notes: "x".repeat(301) },
    now,
  );
  assert(errors.time && errors.notes);
  assert.deepEqual(
    validateReservation({ ...valid, notes: "Aniversário" }, now),
    {},
  );
});

test("missing fields get field-specific recovery messages", () => {
  assert.deepEqual(Object.keys(validateReservation({}, now)).sort(), [
    "date",
    "name",
    "people",
    "time",
  ]);
});

test("WhatsApp URL targets the reservation line with one text parameter", () => {
  const url = new URL(
    buildReservationUrl({ ...valid, name: "João & Ana #1", notes: "Mesa?x=1" }),
  );
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/559881310790");
  assert.equal([...url.searchParams].length, 1);
  const text = url.searchParams.get("text");
  assert(text.includes("João & Ana #1"));
  assert(text.includes("Dia: 22/09/2026 (terça-feira)"));
  assert(text.includes("Nº de pessoas: 12"));
  assert(text.includes("Observações: Mesa?x=1"));
});

test("reservation message follows the house template without gaps", () => {
  const message = new URL(buildReservationUrl(valid)).searchParams.get("text");
  assert(message.startsWith("Quero reservar."));
  assert(message.includes("Observações: nenhuma"));
  assert(!message.includes("undefined"));
  assert(!message.includes("Telefone"));
});
