interface StepProps {
    stepNumber: number;
    title: string;
    description: string;
}

const Step = ({ stepNumber, title, description }: StepProps) => {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 border-2 border-green-600 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">
                {stepNumber}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
    );
};

interface HowItWorksStep {
    stepNumber: number;
    title: string;
    description: string;
}

const STEPS: readonly HowItWorksStep[] = [
    {
        stepNumber: 1,
        title: 'Sign Up',
        description: 'Create an account using your .edu email address.',
    },
    {
        stepNumber: 2,
        title: 'Browse or List',
        description: 'Search for housing near your campus or post your empty room.',
    },
    {
        stepNumber: 3,
        title: 'Connect',
        description: 'Message verified students and secure your sublet.',
    },
] as const;

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 scroll-mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {STEPS.map((step) => (
                    <Step
                        key={step.stepNumber} // double check later key={}
                        stepNumber={step.stepNumber}
                        title={step.title}
                        description={step.description}
                    />
                ))}
            </div>
        </section>
    );
};
