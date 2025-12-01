import React from "react";

type Props = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
};

export default function Doodle({
  src,
  className = "",
  style = {},
  alt = "doodle",
}: Props) {
  // src expects '/doodles/name.svg' in public folder
  return (
    <img
      src={src}
      alt={alt}
      className={`pointer-events-none select-none ${className}`}
      style={style}
    />
  );
}
