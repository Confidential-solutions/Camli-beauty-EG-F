/* Payment brand marks. Brand colors are fixed by each network's guidelines, so they live here, not in theme tokens. */
const card = "h-7 w-11 rounded-md bg-background shadow-sm ring-1 ring-border";

export function VisaLogo() {
  return (
    <svg viewBox="0 0 48 32" className={card} role="img" aria-label="Visa">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <text x="24" y="21" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="13" fill="#1A1F71">VISA</text>
    </svg>
  );
}

export function MastercardLogo() {
  return (
    <svg viewBox="0 0 48 32" className={card} role="img" aria-label="Mastercard">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <circle cx="19" cy="16" r="9" fill="#EB001B" />
      <circle cx="29" cy="16" r="9" fill="#F79E1B" />
      <path d="M24 8.5a9 9 0 0 1 0 15 9 9 0 0 1 0-15z" fill="#FF5F00" />
    </svg>
  );
}

export function MeezaLogo() {
  return (
    <svg viewBox="0 0 48 32" className={card} role="img" aria-label="Meeza">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <path d="M8 22V10l5 7 5-7v12" fill="none" stroke="#00A651" strokeWidth="2.6" strokeLinejoin="round" />
      <text x="33" y="20.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#0B2D72">eeza</text>
    </svg>
  );
}

export function CodLogo() {
  return (
    <svg viewBox="0 0 48 32" className={card} role="img" aria-label="Cash on delivery">
      <rect width="48" height="32" rx="4" fill="#fff" />
      <rect x="10" y="9" width="28" height="14" rx="2" fill="#2E7D32" />
      <circle cx="24" cy="16" r="4" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="14" cy="16" r="1.3" fill="#fff" />
      <circle cx="34" cy="16" r="1.3" fill="#fff" />
    </svg>
  );
}

export function PaymentLogos() {
  return (
    <div className="flex items-center justify-center gap-2">
      <VisaLogo />
      <MastercardLogo />
      <MeezaLogo />
      <CodLogo />
    </div>
  );
}
