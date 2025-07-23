import * as React from "react";

export default function Footer(): React.JSX.Element {
  return (
    <footer className="px-40 py-40 gap-10 text-sm text-[#929292]">
      <p className="font-bold text-2xl ml-5 mb-2">ZSTRAL</p>
      <div className="flex-1 h-[1px] bg-[#ffffffb3]" />
      <p className="text-center mt-4">© {new Date().getFullYear()} Rafael Fernández.</p>
    </footer>
  );
}