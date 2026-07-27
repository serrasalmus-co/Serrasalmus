import React from 'react';

export interface SectionItem {
  id: string;
  label: string;
}

interface NavbarProps {
  sections: SectionItem[];
  currentIndex: number;
  onSelectSection: (index: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sections,
  currentIndex,
  onSelectSection,
}) => {
  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + sections.length) % sections.length;
    onSelectSection(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % sections.length;
    onSelectSection(nextIdx);
  };

  const currentSection = sections[currentIndex] || sections[0];

  return (
    <nav className="fixed top-0 left-0 w-full p-6 flex justify-center items-center z-50 pointer-events-none mix-blend-difference">
      <div className="flex items-center mono-label text-white text-lg pointer-events-auto bg-neutral-900/40 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-2xl transition-all duration-300 hover:border-[#ff5b24]/40">
        <button
          onClick={handlePrev}
          aria-label="Previous section"
          className="hover:text-[#ff5b24] transition-colors px-3 cursor-pointer text-xl font-bold select-none active:scale-95"
        >
          &lt;
        </button>
        
        <span
          key={currentSection.id}
          className="text-center tracking-[0.2em] transition-all duration-300 text-lg font-bold px-4 text-white hover:text-[#ff5b24] cursor-pointer"
          onClick={() => onSelectSection(currentIndex)}
        >
          {currentSection.label}
        </span>
        
        <button
          onClick={handleNext}
          aria-label="Next section"
          className="hover:text-[#ff5b24] transition-colors px-3 cursor-pointer text-xl font-bold select-none active:scale-95"
        >
          &gt;
        </button>
      </div>
    </nav>
  );
};
