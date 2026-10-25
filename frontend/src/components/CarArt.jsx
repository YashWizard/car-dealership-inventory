export default function CarArt({ className = "" }) {
  return (
    <svg
      viewBox="0 0 640 260"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="325" cy="222" rx="245" ry="14" fill="#071c25" opacity=".15" />
      <path
        d="M68 171L112 142L170 70H376L458 132L554 153L583 183V211H61V182Z"
        fill="currentColor"
      />
      <path d="M186 85H262V137H143Z" fill="#c7e9e8" />
      <path d="M279 85H367L432 137H279Z" fill="#a2d4d5" />
      <path d="M75 170H122L106 189H65Z" fill="#eefbda" />
      <path d="M542 163H568L581 184H548Z" fill="#f4ae84" />
      <path d="M147 156H480" stroke="#ffffff" strokeOpacity=".22" strokeWidth="3" />
      <path d="M284 150H310" stroke="#c2dddd" strokeWidth="4" strokeLinecap="round" />
      <circle cx="173" cy="207" r="43" fill="#10232b" />
      <circle cx="173" cy="207" r="25" fill="#8caeb4" />
      <circle cx="173" cy="207" r="12" fill="#dbe9e7" />
      <circle cx="475" cy="207" r="43" fill="#10232b" />
      <circle cx="475" cy="207" r="25" fill="#8caeb4" />
      <circle cx="475" cy="207" r="12" fill="#dbe9e7" />
    </svg>
  );
}
