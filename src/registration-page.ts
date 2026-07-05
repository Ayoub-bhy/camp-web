// Registration page wiring (NUT-104). No storage, no network calls from us:
// validated data becomes a prefilled WhatsApp message to the business number.
import { WHATSAPP_NUMBER } from "./config";
import {
  buildRegistrationMessage,
  validate,
  type FieldError,
  type Registration,
} from "./lib/registration";
import { track } from "./lib/track";

const form = document.querySelector<HTMLFormElement>("#reg-form");

// NUT-144: InitiateCheckout once, on first interaction with the form.
// Payload is whitelist-filtered — form VALUES never enter events.
let started = false;
form?.addEventListener("focusin", () => {
  if (!started) {
    started = true;
    track("InitiateCheckout", {});
  }
});

function readForm(f: HTMLFormElement): Registration {
  const data = new FormData(f);
  return {
    childFirstName: String(data.get("childFirstName") ?? ""),
    childAge: Number(data.get("childAge") ?? 0),
    parentName: String(data.get("parentName") ?? ""),
    parentPhone: String(data.get("parentPhone") ?? ""),
    consent: data.get("consent") === "on",
    mediaOptIn: data.get("mediaOptIn") === "on",
  };
}

function showErrors(errors: FieldError[]): void {
  document.querySelectorAll<HTMLElement>(".err").forEach((el) => {
    el.classList.toggle("show", errors.includes(el.dataset.err as FieldError));
  });
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const reg = readForm(form);
  const errors = validate(reg);
  showErrors(errors);
  if (errors.length > 0) return;
  track("CompleteRegistration", {}); // no form values — §4 guardrail
  const msg = buildRegistrationMessage(reg);
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank",
    "noopener",
  );
});
