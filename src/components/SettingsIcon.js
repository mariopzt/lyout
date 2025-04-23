import React from 'react';

// Icono de Home (Material/Bootstrap style)
export default function SettingsIcon({ size = 24, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9.5L12 3l9 6.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
      <rect x="9" y="14" width="6" height="7" rx="1" />
    </svg>
  );
}
