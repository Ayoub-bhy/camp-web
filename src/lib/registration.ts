/**
 * Registration (NUT-104). Data minimization per safety checklist §4:
 * child first name, age, parent name, parent phone — NOTHING else.
 * No storage on our side: the validated registration is handed to the
 * WhatsApp Business chat (sales-assisted model; data lives with the provider).
 */

export interface Registration {
  childFirstName: string;
  childAge: number;
  parentName: string;
  parentPhone: string;
  /** §3 consent: participation + recording + data — one screen, required. */
  consent: boolean;
  /** §3 media use: separate opt-in, DEFAULT OFF. */
  mediaOptIn: boolean;
}

export type FieldError =
  | "childFirstName"
  | "childAge"
  | "parentName"
  | "parentPhone"
  | "consent";

/** KSA (+9665...) and Jordan (+9627...) mobile numbers, with or without +, 00, or local 0 prefix. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-()]/g, "").replace(/^\+/, "").replace(/^00/, "");
  if (/^9665\d{8}$/.test(digits)) return `+${digits}`;
  if (/^05\d{8}$/.test(digits)) return `+966${digits.slice(1)}`;
  if (/^9627[789]\d{7}$/.test(digits)) return `+${digits}`;
  if (/^07[789]\d{7}$/.test(digits)) return `+962${digits.slice(1)}`;
  return null;
}

export function validate(r: Registration): FieldError[] {
  const errors: FieldError[] = [];
  if (r.childFirstName.trim().length < 2) errors.push("childFirstName");
  if (!Number.isInteger(r.childAge) || r.childAge < 7 || r.childAge > 10) errors.push("childAge");
  if (r.parentName.trim().length < 2) errors.push("parentName");
  if (!normalizePhone(r.parentPhone)) errors.push("parentPhone");
  if (!r.consent) errors.push("consent");
  return errors;
}

/** Pseudonymized identity generated at submit time (NUT-104 v2). */
export interface ChildIdentity {
  code: string;
  nickname: string;
  /** RSA-OAEP blob of the real first name; absent until camp public key configured. */
  encryptedName?: string;
}

/**
 * Structured Arabic WhatsApp message — v2 (founder spec Jul 5).
 * NEVER contains the child's plaintext name: child code + camp nickname
 * identify the child; the real name travels only as an encrypted blob
 * (decryptable solely by the founder's offline private key).
 */
export function buildRegistrationMessage(r: Registration, id: ChildIdentity): string {
  const phone = normalizePhone(r.parentPhone) ?? r.parentPhone;
  const lines = [
    "تسجيل جديد في المخيم الصيفي ✅",
    `رمز الطفل: ${id.code}`,
    `لقب المخيم: ${id.nickname}`,
    `العمر: ${r.childAge}`,
    `اسم ولي الأمر: ${r.parentName.trim()}`,
    `جوال ولي الأمر: ${phone}`,
    `الموافقة (مشاركة + تسجيل + بيانات): نعم`,
    `الموافقة على الاستخدام الإعلامي: ${r.mediaOptIn ? "نعم" : "لا"}`,
  ];
  if (id.encryptedName) lines.push(`الاسم (مشفّر، للمؤسس فقط): ${id.encryptedName}`);
  return lines.join("\n");
}
