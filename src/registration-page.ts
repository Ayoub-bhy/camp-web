// Registration page wiring (NUT-104 v2). No storage, no network calls from us:
// validated data becomes a prefilled WhatsApp message to the business number.
// v2 (founder spec Jul 5): child pseudonymized as code + nickname; real name
// encrypted with the camp public key or omitted entirely (fail-safe).
import { CAMP_PUBLIC_KEY_JWK, WHATSAPP_NUMBER } from "./config";
import { encryptChildName, generateChildCode, pickNickname } from "./lib/identity";
import {
  buildRegistrationMessage,
  validate,
  type ChildIdentity,
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

function showConfirmation(id: ChildIdentity): void {
  const box = document.querySelector<HTMLElement>("#nickname-confirm");
  if (!box) return;
  box.innerHTML = `🎉 لقب طفلك في المخيم: <strong>${id.nickname}</strong><br />رمز التسجيل: <strong dir="ltr">${id.code}</strong> — احتفظي بهما.`;
  box.classList.add("show");
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  void (async () => {
    const reg = readForm(form);
    const errors = validate(reg);
    showErrors(errors);
    if (errors.length > 0) return;

    // Pseudonymize: code + nickname; name encrypted or dropped (never plaintext).
    const code = generateChildCode();
    const id: ChildIdentity = { code, nickname: pickNickname(code) };
    if (CAMP_PUBLIC_KEY_JWK) {
      try {
        id.encryptedName = await encryptChildName(reg.childFirstName, CAMP_PUBLIC_KEY_JWK);
      } catch {
        /* fail-safe: send without name rather than with plaintext */
      }
    }

    track("CompleteRegistration", {}); // no form values — §4 guardrail
    showConfirmation(id);
    const msg = buildRegistrationMessage(reg, id);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener",
    );
  })();
});
