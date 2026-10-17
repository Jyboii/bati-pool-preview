type StepIllustrationProps = { step: 1 | 2 | 3 };

export default function StepIllustration({ step }: StepIllustrationProps) {
  return (
    <div className="step-illustration" aria-hidden="true">
      <svg viewBox="0 0 320 190" role="presentation" focusable="false">
        <rect width="320" height="190" fill="#edf6f8" />
        <path d="M0 45H320M0 95H320M0 145H320M55 0V190M110 0V190M165 0V190M220 0V190M275 0V190" stroke="#dcebef" strokeWidth="1" />
        {step === 1 && (
          <>
            <rect x="57" y="22" width="162" height="145" rx="5" fill="#c7e0e9" transform="rotate(-5 57 22)" />
            <rect x="67" y="17" width="162" height="145" rx="5" fill="#fff" stroke="#8cb4c3" strokeWidth="2" />
            <path d="M87 49H171M87 59H154" stroke="#1b4254" strokeWidth="4" strokeLinecap="round" />
            <rect x="88" y="82" width="13" height="13" rx="2" fill="#dff3f9" stroke="#008ccf" strokeWidth="2" />
            <path d="m91 88 3 3 5-6" fill="none" stroke="#008ccf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M112 88H194M88 115H192M88 132H165" stroke="#a7bec7" strokeWidth="3" strokeLinecap="round" />
            <path d="m235 101 26-35 11 8-26 35-18 9Z" fill="#008ccf" stroke="#1b4254" strokeWidth="2" strokeLinejoin="round" />
            <path d="m235 101 11 8-18 9Z" fill="#fff" stroke="#1b4254" strokeWidth="2" strokeLinejoin="round" />
            <path d="m261 66 6-8c2-3 5-3 8-1l5 4c3 2 3 5 1 8l-9 11Z" fill="#1b4254" />
          </>
        )}
        {step === 2 && (
          <>
            <rect x="102" y="18" width="116" height="153" rx="18" fill="#c7e0e9" transform="rotate(5 102 18)" />
            <rect x="103" y="13" width="114" height="153" rx="17" fill="#173a4b" />
            <rect x="110" y="26" width="100" height="122" rx="8" fill="#fff" />
            <path d="M147 19h26" stroke="#a7c7d2" strokeWidth="3" strokeLinecap="round" />
            <circle cx="160" cy="157" r="3" fill="#a7c7d2" />
            <circle cx="160" cy="70" r="25" fill="#dff3f9" />
            <path d="M150 60c1-2 3-3 5-2l4 4-3 5c2 5 5 8 10 10l5-3 4 4c1 2 0 4-2 5-3 2-7 1-10 0-8-4-15-11-19-19-1-3-2-7 0-10l6-4Z" fill="#008ccf" />
            <path d="M130 112h60M139 122h42" stroke="#a7bec7" strokeWidth="3" strokeLinecap="round" />
            <path d="M40 45h55a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H68l-12 11V89H40a8 8 0 0 1-8-8V53a8 8 0 0 1 8-8Z" fill="#fff" stroke="#8cb4c3" strokeWidth="2" />
            <path d="M50 62h35M50 72h25" stroke="#008ccf" strokeWidth="3" strokeLinecap="round" />
            <path d="M234 80h46a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8h-10v11l-12-11h-24a8 8 0 0 1-8-8V88a8 8 0 0 1 8-8Z" fill="#d8eef6" stroke="#8cb4c3" strokeWidth="2" />
            <path d="M243 96h30M243 105h22" stroke="#008ccf" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {step === 3 && (
          <>
            <rect x="38" y="31" width="242" height="132" rx="4" fill="#c7e0e9" transform="rotate(-3 38 31)" />
            <rect x="42" y="24" width="238" height="132" rx="4" fill="#fff" stroke="#8cb4c3" strokeWidth="2" />
            <path d="M58 44h78M58 51h51" stroke="#a7bec7" strokeWidth="3" strokeLinecap="round" />
            <rect x="90" y="65" width="135" height="65" rx="27" fill="#dff3f9" stroke="#008ccf" strokeWidth="3" />
            <path d="M112 81c20-10 67-11 92 0M108 104c22 11 68 12 99 0" fill="none" stroke="#8ccfe8" strokeWidth="2" strokeLinecap="round" />
            <path d="M90 137h135M90 133v8M225 133v8M78 65v65M74 65h8M74 130h8" stroke="#1b4254" strokeWidth="1.5" />
            <path d="m148 137-5-3v6Zm20 0 5-3v6Z" fill="#1b4254" />
            <path d="m49 163 24-38 9 6-23 38-14 9Z" fill="#008ccf" stroke="#1b4254" strokeWidth="2" strokeLinejoin="round" />
            <path d="m49 163 10 6-14 9Z" fill="#fff" stroke="#1b4254" strokeWidth="2" />
            <circle cx="254" cy="51" r="19" fill="#008ccf" />
            <path d="m245 51 6 6 12-13" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
    </div>
  );
}
