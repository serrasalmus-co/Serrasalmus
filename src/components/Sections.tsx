import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const Sections: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormState({ name: '', email: '', message: '' });
    }, 4500);
  };

  const products = [
    {
      id: 'metales',
      title: 'Metals & Mining',
      description: 'Specialized brokerage and strategic intermediation of copper, aluminum, iron, and precious metals for global industries.',
      tags: ['Copper', 'Iron', 'Lithium', 'Aluminum']
    },
    {
      id: 'energia',
      title: 'Energy & Crude',
      description: 'International trading of hydrocarbons, petroleum derivatives, natural gas, and energy transition solutions.',
      tags: ['Crude Oil', 'LNG', 'Refined Fuels', 'Gasoil']
    },
    {
      id: 'agricultura',
      title: 'Agriculture',
      description: 'End-to-end management of large-scale agri-food supply chains: grains, oilseeds, and fertilizers.',
      tags: ['Soybeans', 'Corn', 'Wheat', 'Fertilizers']
    }
  ];

  return (
    <div className="relative z-10">
      {/* 0. HOME (HERO) */}
      <section
        id="home"
        className="seccion-menu min-h-screen flex flex-col justify-center items-center px-4 md:px-8 relative pt-10 bg-transparent select-none"
      >
        <div className="flex flex-col items-center text-center w-full max-w-7xl px-4 z-10">
          <div className="overflow-hidden py-2">
            <h1 className="hero-title tracking-tight animate-fade-in">
              Serrasalmus
            </h1>
          </div>
          <div className="overflow-hidden">
            <p className="hero-subtitle tracking-widest text-neutral-300">
              Consulting & Commodity International Broker
            </p>
          </div>

          <div className="mt-12 flex items-center gap-3 px-5 py-2 rounded-full bg-black/60 backdrop-blur-md border border-[#ff5b24]/30 text-xs mono-label text-neutral-300 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88]" />
            <span>Hover and move your cursor to disperse and ignite the bioluminescent swarm</span>
          </div>
        </div>
      </section>

      {/* 1. ABOUT US */}
      <section
        id="nosotros"
        className="seccion-menu glass-section px-6 md:px-16 py-32 borde-limpio"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="md:col-span-4 flex flex-col">
            <span className="display-text text-[#ff5b24]">01</span>
            <span className="mono-label mt-2 text-white font-bold tracking-widest">
              ABOUT US
            </span>
          </div>
          <div className="md:col-span-8 space-y-8">
            <p className="text-3xl md:text-5xl font-light leading-snug text-neutral-100 font-serif">
              Serrasalmus is a global firm specializing in strategic consulting and international commodity brokerage.
            </p>
            <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed max-w-3xl">
              We connect markets, optimize supply chains, and foster high-level alliances to ensure operational success in the most demanding global trade transactions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-neutral-800">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="mono-label text-[#ff5b24]">COVERAGE</span>
                <p className="text-2xl font-serif mt-2 text-white">Global & Regional</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="mono-label text-[#ff5b24]">FOCUS</span>
                <p className="text-2xl font-serif mt-2 text-white">Strategic</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="mono-label text-[#ff5b24]">EXECUTION</span>
                <p className="text-2xl font-serif mt-2 text-white">Precision & Trust</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCTS */}
      <section
        id="productos"
        className="seccion-menu glass-section px-6 md:px-16 py-32 borde-limpio"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-16">
            <div className="md:col-span-4 flex flex-col">
              <span className="display-text text-[#ff5b24]">02</span>
              <span className="mono-label mt-2 text-white font-bold tracking-widest">
                PRODUCTS
              </span>
            </div>
            <div className="md:col-span-8 flex items-end pb-2">
              <p className="text-xl text-neutral-300 font-light">
                Our primary operational divisions across global commodity markets.
              </p>
            </div>
          </div>

          <div className="w-full border-t border-[#262626]">
            {products.map((prod) => {
              const isExpanded = activeProduct === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => setActiveProduct(isExpanded ? null : prod.id)}
                  className="producto-row flex flex-col py-8 px-4 md:px-8 cursor-pointer border-b border-[#262626] group transition-all"
                >
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-3xl md:text-5xl font-light font-serif tracking-tight text-white group-hover:text-[#ff5b24] transition-colors">
                      {prod.title}
                    </h3>
                    <div className="arrow-icon transition-transform duration-500 text-neutral-400">
                      <ArrowRight className="w-8 h-8 group-hover:text-[#ff5b24]" />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      isExpanded ? 'max-h-60 mt-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-neutral-300 text-lg max-w-2xl font-light leading-relaxed">
                      {prod.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {prod.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs mono-label bg-[#ff5b24]/10 text-[#ff5b24] rounded-full border border-[#ff5b24]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CONTACT */}
      <section
        id="contacto"
        className="seccion-menu glass-section px-6 md:px-16 py-32 borde-limpio"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 flex flex-col">
            <span className="display-text text-[#ff5b24]">03</span>
            <span className="mono-label mt-2 text-white font-bold tracking-widest">
              CONTACT
            </span>
            <p className="mt-6 text-neutral-400 font-light text-base leading-relaxed">
              Initiate a direct dialogue with our specialized brokerage and consulting advisors.
            </p>
          </div>

          <div className="md:col-span-8">
            {formSubmitted ? (
              <div className="bg-neutral-900/80 border border-[#ff5b24]/40 p-10 rounded-2xl flex flex-col items-center text-center space-y-4 animate-fade-in shadow-2xl">
                <CheckCircle2 className="w-16 h-16 text-[#ff5b24]" />
                <h3 className="text-3xl font-serif text-white">Message Sent Successfully</h3>
                <p className="text-neutral-300 font-light max-w-md">
                  Thank you for reaching out to Serrasalmus. A specialized advisor will respond to your inquiry shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-12 w-full">
                <div className="flex flex-col group">
                  <label className="mono-label mb-3 group-focus-within:text-[#ff5b24] transition-colors">
                    01. Your Name or Company
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="bg-transparent border-b border-[#262626] pb-4 text-2xl md:text-4xl text-neutral-300 focus:outline-none transition-colors placeholder:text-neutral-700 font-light rounded-none"
                    placeholder="Full name or legal entity"
                  />
                </div>

                <div className="flex flex-col group">
                  <label className="mono-label mb-3 group-focus-within:text-[#ff5b24] transition-colors">
                    02. Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="bg-transparent border-b border-[#262626] pb-4 text-2xl md:text-4xl text-neutral-300 focus:outline-none transition-colors placeholder:text-neutral-700 font-light rounded-none"
                    placeholder="name@company.com"
                  />
                </div>

                <div className="flex flex-col group">
                  <label className="mono-label mb-3 group-focus-within:text-[#ff5b24] transition-colors">
                    03. Inquiry Details
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="bg-transparent border-b border-[#262626] pb-4 text-2xl md:text-4xl text-neutral-300 focus:outline-none transition-colors placeholder:text-neutral-700 font-light resize-none rounded-none"
                    placeholder="Which commodity or strategic project can we assist you with?"
                  ></textarea>
                </div>

                <div className="flex justify-start pt-6">
                  <button
                    type="submit"
                    className="group flex items-center justify-between gap-8 border border-[#333] px-10 py-6 hover:bg-[#ff5b24] hover:border-[#ff5b24] transition-all duration-300 cursor-pointer rounded-lg shadow-lg"
                  >
                    <span className="mono-label text-white group-hover:text-white tracking-widest font-bold text-sm transition-colors">
                      SEND MESSAGE
                    </span>
                    <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-16 py-10 borde-limpio glass-section flex flex-col md:flex-row justify-between items-center mono-label text-neutral-400 text-xs relative z-20">
        <p>© 2026 SERRASALMUS. Consulting & Commodity Broker.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#home" className="hover:text-[#ff5b24] transition-colors">LinkedIn</a>
          <a href="#home" className="hover:text-[#ff5b24] transition-colors">Legal Notice</a>
          <a href="#home" className="hover:text-[#ff5b24] transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};
