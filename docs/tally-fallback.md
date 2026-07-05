# Tally fallback form — configuration spec (NUT-104)

If the custom form isn't QA-passed by Jul 20, enrollment runs on this Tally form + payment links. Configure at tally.so (~10 min, free tier is enough at pilot volume).

## Form settings

- Language/direction: Arabic, RTL
- Title: «التسجيل في المخيم الصيفي»
- After submit: redirect to WhatsApp (`https://wa.me/<BUSINESS_NUMBER>?text=سجّلت في النموذج ✅`)
- Disable: response editing, Tally branding if on paid plan (optional)
- **Email notifications:** to founder only. No third-party integrations (no Sheets/Zapier — keeps child data inside Tally + WhatsApp only).

## Fields — EXACTLY these, nothing more (checklist §4)

1. الاسم الأول للطفل — short text, required
2. عمر الطفل — dropdown: ٧ / ٨ / ٩ / ١٠, required
3. اسم ولي الأمر — short text, required
4. جوال ولي الأمر (واتساب) — phone, required
5. Checkbox (required): «أوافق على مشاركة طفلي في جلسات المخيم، وعلى تسجيل الجلسات لأغراض السلامة، وعلى استخدام البيانات أعلاه للتواصل وإدارة المخيم فقط. لا تُشارك البيانات مع أي جهة أخرى، وتُحذف بعد انتهاء البرنامج بـ٩٠ يوماً.»
6. Checkbox (optional, default unchecked): «(اختياري) أسمح باستخدام لقطات قد يظهر فيها طفلي في منشورات المخيم التعريفية.»

## Do NOT add

Email, address, school, birthdate, photo uploads, child last name, or any "nice to have" field. Push back per safety checklist §4.

## Retention

Export responses weekly to the restricted Drive folder; delete from Tally after camp + 90 days.
