import { Value } from './Value';
import { ValueProposition } from './ValueProposition';
import { HowItWorks } from './HowItWorks';
import { FAQ } from './FAQ';

export const Home = () => {
  return (
    <div className="space-y-12 text-gray-900 dark:text-gray-100">
      <Value />
      <ValueProposition />
      <HowItWorks />
      <FAQ />
    </div>
  );
};
