import React, { useState } from 'react';
import { sizeChartInches, sizeChartCm } from '../data/sizeChart';

// --- Data & Logic ---

// This function finds the closest match in the chart.
const findBraSize = (under, over, chart, unit) => {
    if (!under || !over) return null;

    // Find the closest valid underband measurement from our chart
    const validUnderbands = [...new Set(chart.map(item => item.underband))];
    const closestUnderband = validUnderbands.reduce((prev, curr) =>
        (Math.abs(curr - under) < Math.abs(prev - under) ? curr : prev)
    );

    // Filter the chart for that underband and find the closest overbust
    const possibleFits = chart.filter(item => item.underband === closestUnderband);
    if (possibleFits.length === 0) return null;

    const closestFit = possibleFits.reduce((prev, curr) =>
        (Math.abs(curr.overbust - over) < Math.abs(prev.overbust - over) ? curr : prev)
    );

    // To be a valid match, the user's measurement should be reasonably close.
    // We use a different tolerance for inches vs. cm.
    const tolerance = unit === 'in' ? 1.0 : 2.5;
    if (Math.abs(closestFit.overbust - over) > tolerance) {
        return null;
    }

    return closestFit.size;
};


// --- UI Components ---

const SelectionCard = ({ text, subtext, onClick }) => (
    <div
        onClick={onClick}
        className="border-2 rounded-lg p-6 text-center cursor-pointer transition-all duration-300 border-gray-200 hover:border-brand-accent/50 hover:bg-brand-accent/5"
    >
        <h3 className="text-lg font-semibold text-brand-text">{text}</h3>
        {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
    </div>
);

const InputField = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-accent focus:border-brand-accent"
        />
    </div>
);

const UnitToggle = ({ unit, setUnit }) => (
    <div className="flex justify-center items-center my-6">
        <button
            onClick={() => setUnit('in')}
            className={`px-4 py-2 rounded-l-lg transition-colors ${unit === 'in' ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700'}`}
        >
            Inches
        </button>
        <button
            onClick={() => setUnit('cm')}
            className={`px-4 py-2 rounded-r-lg transition-colors ${unit === 'cm' ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700'}`}
        >
            Centimeters
        </button>
    </div>
);


// --- Quiz Step Components ---

const HubStep = ({ setPath, setStep }) => (
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
                subtext="Use measurements to find your size."
                onClick={() => { setPath('size'); setStep('size_calculator'); }}
            />
            <SelectionCard
                text="The Full Fitting"
                subtext="Start from scratch for size & style."
                onClick={() => { setPath('full'); setStep('size_calculator'); }}
            />
        </div>
    </div>
);

const SizeCalculatorStep = ({ setStep, setCalculatedSize }) => {
    const [underbust, setUnderbust] = useState('');
    const [overbust, setOverbust] = useState('');
    const [unit, setUnit] = useState('in'); // 'in' or 'cm'

    const handleFindSize = () => {
        const chart = unit === 'in' ? sizeChartInches : sizeChartCm;
        const size = findBraSize(parseFloat(underbust), parseFloat(overbust), chart, unit);
        setCalculatedSize(size);
        setStep('size_result');
    };

    return (
        <div className="text-center">
            <h2 className="font-serif text-4xl mb-4">Bra Size Calculator</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">Enter your measurements to find your recommended starting size.</p>

            <UnitToggle unit={unit} setUnit={setUnit} />

            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <InputField
                        label={`Underband (${unit})`}
                        value={underbust}
                        onChange={setUnderbust}
                        placeholder={unit === 'in' ? 'e.g., 34' : 'e.g., 86.5'}
                    />
                    <InputField
                        label={`Overbust (${unit})`}
                        value={overbust}
                        onChange={setOverbust}
                        placeholder={unit === 'in' ? 'e.g., 39.5' : 'e.g., 100.5'}
                    />
                </div>
                <button
                    onClick={handleFindSize}
                    className="w-full bg-brand-accent text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={!underbust || !overbust}
                >
                    Find My Size
                </button>
            </div>

            <div className="mt-8">
                <p className="text-gray-600 mb-4">Not sure how to measure?</p>
                <img
                    src="https://placehold.co/600x400/FAFAF9/8B9F8A?text=Measurement+Guide+Image"
                    alt="A diagram showing where to measure the underband and overbust for bra fitting"
                    className="max-w-lg mx-auto rounded-lg"
                />
            </div>
            <button onClick={() => setStep('hub')} className="mt-8 text-sm text-gray-500 hover:text-brand-text">← Back to Start</button>
        </div>
    );
};

const SizeResultStep = ({ calculatedSize, path, setStep }) => (
    <div className="text-center">
        {calculatedSize ? (
            <>
                <h2 className="font-serif text-4xl mb-4">Your Recommended Size</h2>
                <p className="text-gray-600 mb-8">Based on your measurements, we suggest starting with size:</p>
                <div className="text-6xl font-bold text-brand-accent mb-8">{calculatedSize}</div>

                {path !== 'size' && (
                    <div className="bg-brand-accent/10 p-6 rounded-lg">
                        <p className="text-brand-text mb-4">Great! Now let's find the perfect styles for your shape.</p>
                        <button
                            onClick={() => setStep('shape_1')}
                            className="bg-brand-accent text-white font-bold text-lg px-12 py-4 rounded-lg hover:opacity-90"
                        >
                            Continue to Style Finder
                        </button>
                    </div>
                )}
            </>
        ) : (
            <>
                <h2 className="font-serif text-4xl mb-4">Size Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">We couldn't find a matching size for the measurements provided. Please double-check your numbers and try again.</p>
                <button
                    onClick={() => setStep('size_calculator')}
                    className="bg-brand-accent text-white font-bold text-lg px-12 py-4 rounded-lg hover:opacity-90"
                >
                    Re-enter Measurements
                </button>
            </>
        )}
        <button onClick={() => setStep('size_calculator')} className="block mx-auto mt-8 text-sm text-gray-500 hover:text-brand-text">Start Over</button>
    </div>
);

const ShapeStep = ({ handleAnswer, setStep, path }) => (
    <div className="text-center">
        <h2 className="font-serif text-4xl mb-4">Which shape best describes you?</h2>
        <p className="text-gray-600 mb-8">This helps us recommend styles that prevent gaping or spilling.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <SelectionCard text="Round" onClick={() => { handleAnswer('shape', 'round'); setStep('results'); }} />
            <SelectionCard text="Teardrop" onClick={() => { handleAnswer('shape', 'teardrop'); setStep('results'); }} />
            <SelectionCard text="Bell" onClick={() => { handleAnswer('shape', 'bell'); setStep('results'); }} />
            <SelectionCard text="East-West" onClick={() => { handleAnswer('shape', 'east-west'); setStep('results'); }} />
            <SelectionCard text="Side Set" onClick={() => { handleAnswer('shape', 'side-set'); setStep('results'); }} />
            <SelectionCard text="Slender" onClick={() => { handleAnswer('shape', 'slender'); setStep('results'); }} />
        </div>
        <button
            onClick={() => setStep(path === 'style' ? 'hub' : 'size_calculator')}
            className="mt-8 text-sm text-gray-500 hover:text-brand-text"
        >
            ← Back
        </button>
    </div>
);

const ResultsStep = ({ answers, path, setStep }) => (
    <div className="text-center">
        <h2 className="font-serif text-4xl mb-4">Your Personalised Recommendations</h2>
        <p className="text-gray-600 mb-8">Based on your answers, here are the styles we think you'll love.</p>
        <div className="border-t pt-8 max-w-md mx-auto text-left">
            <h3 className="text-2xl font-semibold mb-4 text-center">We recommend trying a <strong>Plunge Bra</strong>.</h3>
            <p className="text-gray-700">This style is great for your <strong>{answers.shape}</strong> shape because it offers less coverage on top, preventing gaping, and the low center gore is perfect for bringing your breasts together for a flattering silhouette.</p>
        </div>
        <button onClick={() => setStep('size_calculator')} className="mt-8 text-sm text-gray-500 hover:text-brand-text">Start Over</button>
    </div>
);


// --- Main Quiz Component ---

export default function QuizFlow() {
    const [step, setStep] = useState('hub');
    const [path, setPath] = useState(null);
    const [answers, setAnswers] = useState({});
    const [calculatedSize, setCalculatedSize] = useState(null);

    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const renderStep = () => {
        switch (step) {
            case 'hub':
                return <HubStep setPath={setPath} setStep={setStep} />;
            case 'size_calculator':
                return <SizeCalculatorStep setStep={setStep} setCalculatedSize={setCalculatedSize} />;
            case 'size_result':
                return <SizeResultStep calculatedSize={calculatedSize} path={path} setStep={setStep} />;
            case 'shape_1':
                return <ShapeStep handleAnswer={handleAnswer} setStep={setStep} path={path} />;
            case 'results':
                return <ResultsStep answers={answers} path={path} setStep={setStep} />;
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