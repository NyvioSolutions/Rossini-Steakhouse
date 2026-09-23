import test from "node:test";
import assert from "node:assert/strict";
import {
  getAvailableTimes,
  validateReservation,
  buildReservationUrl,
  getRestaurantNow,
} from "../reservation.mjs";

const now = { date: "2026-09-20", time: "12:00" };
const valid = {
  name: "Cliente de teste",
  date: "2026-09-22",
  time: "12:00",
  people: "2",
};

test("converts the clock to the restaurant timezone", () => {
  assert.deepEqual(getRestaurantNow(new Date("2026-09-21T01:30:00Z")), {
    date: "2026-09-20",
    time: "22:30",
  });
});
test("Monday and impossible calendar dates have no slots", () => {
  assert.deepEqual(getAvailableTimes("2026-09-21", now), []);
  assert.deepEqual(getAvailableTimes("2027-02-30", now), []);
});
test("Sunday has lunch only; elapsed times cannot be booked", () => {
  const slots = getAvailableTimes("2026-09-20", now);
  assert.equal(slots[0], "12:15");
  assert.equal(slots.at(-1), "14:45");
  assert(slots.every((slot) => slot < "15:00"));
});
test("Tuesday has both services, but no closing-time slot", () => {
  const slots = getAvailableTimes("2026-09-22", now);
  assert.equal(slots.length, 34);
  assert(slots.includes("11:15") && slots.includes("18:15"));
  assert(!slots.includes("15:00") && !slots.includes("23:00"));
});
test("validation accepts a request and rejects forged time and party size", () => {
  assert.deepEqual(validateReservation(valid, now), {});
  const errors = validateReservation(
    { ...valid, time: "03:00", people: "1000" },
    now,
  );
  assert(errors.time && errors.people);
});
test("missing fields get four field-specific recovery messages without requesting a phone", () => {
  assert.deepEqual(Object.keys(validateReservation({}, now)).sort(), [
    "date",
    "name",
    "people",
    "time",
  ]);
  assert.deepEqual(validateReservation(valid, now), {});
});
test("WhatsApp URL preserves entered text without injecting query parameters", () => {
  const url = new URL(buildReservationUrl({ ...valid, name: "João & Ana #1" }));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/559833033769");
  assert.equal([...url.searchParams].length, 1);
  assert(url.searchParams.get("text").includes("João & Ana #1"));
  assert(url.searchParams.get("text").includes("22/09/2026"));
});

test("reservation message does not request or include a phone number", () => {
  const message = new URL(buildReservationUrl(valid)).searchParams.get("text");
  assert(!message.includes("Telefone"));
  assert(!message.includes("undefined"));
  assert(message.includes("Nome: Cliente de teste"));
});
