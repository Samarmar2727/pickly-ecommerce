'use client';

import React from 'react';

interface SectionHeadingProps {
  title: string;
  icon?: React.ReactNode;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, icon }) => {
  return (
    <h2 className="text-3xl sm:text-4xl font-bold text-[#A47864] text-center mb-10 relative inline-block after:content-[''] after:block after:w-16 after:h-1 after:mx-auto after:mt-2 after:bg-[#A47864] animate-fade-in">
      {icon && <span className="mr-2 inline-block">{icon}</span>}
      {title}
    </h2>
  );
};

export default SectionHeading;
