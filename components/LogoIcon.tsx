interface LogoIconProps {
  className?: string;
}

export default function LogoIcon({ className = "w-8 h-8" }: LogoIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#4F46E5",stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#6366F1",stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="48" fill="url(#logoGrad1)"/>
      
      <rect x="30" y="20" width="40" height="50" rx="4" fill="#FFFFFF" opacity="0.95"/>
      
      <rect x="35" y="30" width="30" height="2" fill="#C7D2FE" rx="1"/>
      <rect x="35" y="38" width="25" height="2" fill="#C7D2FE" rx="1"/>
      <rect x="35" y="46" width="20" height="2" fill="#C7D2FE" rx="1"/>
      
      <circle cx="40" cy="55" r="8" fill="#10B981"/>
      
      <path d="M 37 55 L 40 58 L 43 52" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

