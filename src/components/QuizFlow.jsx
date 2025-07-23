import React, { useState } from 'react';
import { BraSilhouetteIcon } from './Icons'; // remove if unused

// Reusable component for selection cards
const SelectionCard = ({ text, subtext, onClick, isSelected = false }) => (
  <div
    onClick={onClick}
    className={`border-2 rounded-lg p-6 text-center cursor-pointer transition-all duration-300
      ${isSelected ? 'border-brand-accent bg-brand-accent/10 ring-2 ring-brand-accent' : 'border-gray-200 hover:border-brand-accent/50'}`}
  >
    <h3 className="text-lg font-semibold text-brand-text">{text}</h3>
    {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
  </div>
);

// Main Quiz Component
export default function QuizFlow() {
  const [step, setStep] = useState('hub');          // hub, size_1, shape_1, results, etc.
  const [path, setPath] = useState(null);           // 'style', 'size', 'full'
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const renderStep = () => {
    switch (step) {
      case 'hub':
        return (
          <div className="text-center">
            <h2 className="font-serif text-4xl mb-4">How can we help you find your fit?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">Choose a path below to get personalized recommendations.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectionCard
                text="Find My Style"
                subtext="I know my size, help me with style."
                onClick={() => { setPath('style'); setStep('shape_1'); }}
              />
              <SelectionCard
                text="Check My Size"
                subtext="Let's evaluate your current bra fit."
                onClick={() => { setPath('size'); setStep('size_1'); }}
              />
              <SelectionCard
                text="The Full Fitting"
                subtext="Start from scratch for size & style."
                onClick={() => { setPath('full'); setStep('size_1'); }}
              />
            </div>
          </div>
        );

      case 'size_1':
        return (
          <div className="text-center">
            <h2 className="font-serif text-4xl mb-4">Let's check your band fit.</h2>
            <p className="text-gray-600 mb-8">How does the band of your current bra feel?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectionCard text="Too Tight" onClick={() => { handleAnswer('bandFit', 'tight'); setStep(path === 'size' ? 'size_results' : 'shape_1'); }} />
              <SelectionCard text="Just Right" onClick={() => { handleAnswer('bandFit', 'good'); setStep(path === 'size' ? 'size_results' : 'shape_1'); }} />
              <SelectionCard text="Too Loose" onClick={() => { handleAnswer('bandFit', 'loose'); setStep(path === 'size' ? 'size_results' : 'shape_1'); }} />
            </div>
            <button onClick={() => setStep('hub')} className="mt-8 text-sm text-gray-500 hover:text-brand-text">← Back</button>
          </div>
        );

      case 'shape_1':
        return (
          <div className="text-center">
            <h2 className="font-serif text-4xl mb-4">Which shape best describes you?</h2>
            <p className="text-gray-600 mb-8">This helps us recommend styles that prevent gaping or spilling.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <SelectionCard text="Round"      onClick={() => { handleAnswer('shape', 'round');      setStep('results'); }} />
              <SelectionCard text="Teardrop"   onClick={() => { handleAnswer('shape', 'teardrop');   setStep('results'); }} />
              <SelectionCard text="Bell"       onClick={() => { handleAnswer('shape', 'bell');       setStep('results'); }} />
              <SelectionCard text="East-West"  onClick={() => { handleAnswer('shape', 'east-west');  setStep('results'); }} />
              <SelectionCard text="Side Set"   onClick={() => { handleAnswer('shape', 'side-set');   setStep('results'); }} />
              <SelectionCard text="Slender"    onClick={() => { handleAnswer('shape', 'slender');    setStep('results'); }} />
            </div>
            <button
              onClick={() => setStep(path === 'style' ? 'hub' : 'size_1')}
              className="mt-8 text-sm text-gray-500 hover:text-brand-text"
            >
              ← Back
            </button>
          </div>
        );

      case 'size_results':
        return (
          <div className="text-center">
            <h2 className="font-serif text-4xl mb-4">Your Size Recommendation</h2>
            <p className="text-gray-600 mb-8">Based on your answers, we suggest trying a <strong>34D</strong>.</p>
            <div className="bg-brand-accent/10 p-6 rounded-lg">
              <p className="text-brand-text mb-4">Ready to find the perfect styles for your new size?</p>
              <button
                onClick={() => setStep('shape_1')}
                className="bg-brand-accent text-white font-bold text-lg px-12 py-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                Continue to Style Finder
              </button>
            </div>
            <button onClick={() => setStep('hub')} className="mt-8 text-sm text-gray-500 hover:text-brand-text">Start Over</button>
          </div>
        );

      case 'results':
        return (
          <div className="text-center">
            <h2 className="font-serif text-4xl mb-4">Your Personalised Recommendations</h2>
            <p className="text-gray-600 mb-2">You chose the <strong>{path}</strong> path.</p>
            <p className="text-gray-600 mb-8">Your answers: {JSON.stringify(answers)}</p>
            <div className="border-t pt-8">
              <h3 className="text-2xl font-semibold mb-4">We recommend trying a <strong>Plunge Bra</strong>.</h3>
              <p>This style is great for your shape because it helps to...</p>
            </div>
            <button onClick={() => setStep('hub')} className="mt-8 text-sm text-gray-500 hover:text-brand-text">Start Over</button>
          </div>
        );

      default:
        return <div>Quiz Error. <button onClick={() => setStep('hub')}>Restart</button></div>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-16 transition-opacity duration-500">
      {renderStep()}
    </div>
  );
}