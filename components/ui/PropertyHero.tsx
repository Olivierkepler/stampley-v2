import React from 'react';
import Image from 'next/image';

const PropertyHero = () => {
  return (
    <section className="relative w-full max-w-xl mx-auto p-4">
      {/* Main Container */}
      <div 
        className="relative overflow-hidden aspect-[4/5] md:aspect-[1/1.1] bg-slate-900 shadow-2xl transition-transform duration-700 ease-out hover:scale-[1.01]"
        style={{
          borderRadius: '48px',
          // This mask creates the inward curve at the top left
          WebkitMaskImage: 'radial-gradient(circle at 0 0, transparent 60px, black 61px)',
          maskImage: 'radial-gradient(circle at 0 0, transparent 60px, black 61px)',
        }}
      >
        {/* Background Image */}
        <Image
          sizes="(max-width: 768px) 100vw, 50vw"
          src="/images/diabets.jpg"
          alt="Cityscape through open doors"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Text Content */}
        <div className="absolute top-12 right-8 left-1/4 text-right">
          <h1 className="text-white text-xl md:text-3xl font-bold leading-tight drop-shadow-lg">
            Browse thousands of properties to buy, sell, <br className="hidden md:block" />
            or rent with trusted agents.
          </h1>
        </div>
      </div>
    </section>
  );
};

export default PropertyHero;