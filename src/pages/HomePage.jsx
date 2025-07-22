import React, { useState } from 'react';
import { BraSilhouetteIcon, MenuIcon, CloseIcon } from '../components/Icons'; // We will create this file next

export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Bra Shapes', href: '#' },
        { name: 'Bra Styles', href: '#' },
        { name: 'How to Measure', href: '#' },
        { name: 'About', href: '#' },
    ];

    return (
        <div className="bg-brand-background min-h-screen font-sans text-brand-text">
            {/* Header */}
            <header className="relative py-5 px-8 md:px-12 lg:px-20 border-b border-gray-200/80">
                <div className="flex items-center justify-between">
                    <a href="#" className="text-2xl font-bold text-brand-text">ShapeFit</a>
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} className="text-sm font-medium hover:text-brand-accent transition-colors">
                                {link.name}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hidden lg:inline-block bg-brand-accent text-white font-bold text-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
                            Find Your Fit
                        </a>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden z-50">
                            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-0 left-0 w-full h-screen bg-brand-background z-40 flex flex-col items-center justify-center">
                        <nav className="flex flex-col items-center gap-8">
                            {navLinks.map(link => (
                                <a key={link.name} href={link.href} className="text-xl" onClick={() => setIsMenuOpen(false)}>
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                        <a href="#" className="mt-12 bg-brand-accent text-white font-bold text-lg px-12 py-4 rounded-lg">
                            Find Your Fit
                        </a>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <main className="relative overflow-hidden">
                <div className="w-full min-h-[calc(100vh-81px)] flex items-center justify-center px-4">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-brand-accent/10 rounded-full -translate-y-1/4 translate-x-1/4" />
                    <div className="relative text-center max-w-4xl py-20">
                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-brand-text">
                            Finally, a bra that fits you.
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Our fit quiz goes beyond the tape measure to find the perfect style for your unique shape.
                        </p>
                        <div className="mt-12 flex justify-center items-center gap-x-6 md:gap-x-10">
                            <BraSilhouetteIcon />
                            <BraSilhouetteIcon />
                            <BraSilhouetteIcon />
                            <BraSilhouetteIcon />
                        </div>
                        <div className="mt-12">
                            <a href="#" className="bg-brand-accent text-white font-bold text-lg px-12 py-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-brand-accent/20">
                                Start the Fit Quiz
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
