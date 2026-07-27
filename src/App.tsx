import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { FishCanvas } from './components/FishCanvas';
import { Navbar, SectionItem } from './components/Navbar';
import { Sections } from './components/Sections';

const SECTIONS: SectionItem[] = [
  { id: 'home', label: 'S' },
  { id: 'nosotros', label: 'About Us' },
  { id: 'productos', label: 'Products' },
  { id: 'contacto', label: 'Contact' },
];

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lenisRef, setLenisRef] = useState<Lenis | null>(null);

  // 1. Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    setLenisRef(lenis);

    const onScroll = () => {
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const currentScroll = window.scrollY;
      const progress = Math.min(1, Math.max(0, currentScroll / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('scroll', onScroll);
      lenis.destroy();
    };
  }, []);

  // 2. IntersectionObserver for active section detection
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      threshold: 0.4,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const idx = SECTIONS.findIndex((s) => s.id === id);
          if (idx !== -1) {
            setCurrentIndex(idx);
          }
        }
      });
    }, observerOptions);

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 3. Navigate to Section when selected from Navbar
  const handleSelectSection = (index: number) => {
    setCurrentIndex(index);
    const targetSection = SECTIONS[index];
    if (targetSection) {
      const el = document.getElementById(targetSection.id);
      if (el) {
        if (lenisRef) {
          lenisRef.scrollTo(el, { offset: 0, duration: 1.4 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden">
      {/* Aesthetic HUD Border Overlay */}
      <div className="hud-border hidden md:block" />

      {/* 3D Particle Bioluminescent Fish Canvas */}
      <FishCanvas scrollProgress={scrollProgress} />

      {/* Minimalist Top Nav */}
      <Navbar
        sections={SECTIONS}
        currentIndex={currentIndex}
        onSelectSection={handleSelectSection}
      />

      {/* Page Sections */}
      <Sections />
    </main>
  );
}
