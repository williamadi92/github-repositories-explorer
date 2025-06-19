import { SVGProps } from "react";

const ChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 9l-7 7-7-7" />
  </svg>
);

export default ChevronDown;
