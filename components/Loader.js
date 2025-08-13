// components/Loader.js

import Image from 'next/image';

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-primary-dark z-[100] flex justify-center items-center">
      <div className="relative">
        <Image src="/galaxy-logo.png" alt="GALAXY Logo" width={120} height={120} className="animate-pulse" />
        <div className="absolute inset-0 border-4 border-accent-purple rounded-full animate-spin"></div>
      </div>
    </div>
  );
}