import { SVGProps } from "react";

const Star = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M12 .587l3.668 7.431L24 9.748l-6 5.851 1.416 8.264L12 18.896l-7.416 4.967L6 15.599 0 9.748l8.332-1.73z" />
  </svg>
);

export default Star;
