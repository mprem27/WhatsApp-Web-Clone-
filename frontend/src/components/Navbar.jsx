import React from "react";
import { Assets } from "../assets/Assets";

function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-50 h-12 w-full bg-[#FFF3E8]/90 px-5 backdrop-blur-md">
      <div className="flex h-full items-center justify-start">
        <div className="flex items-center gap-2.5">
          <img
            src={Assets.logo}
            alt="WhatsApp Web Clone"
            className="h-7 w-7 object-contain grayscale"
          />

          <h1 className="text-lg font-bold tracking-wide text-gray-900">
            WhatsApp Web Clone
          </h1>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
