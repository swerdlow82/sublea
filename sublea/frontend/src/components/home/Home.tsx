import { Value } from './Value';
import { ValueProposition } from './ValueProposition';
import { HowItWorks } from './HowItWorks';
import { FAQ } from './FAQ';

export const Home = () => {
  return (
    <div className="space-y-12 text-gray-900">
      <Value />
      <ValueProposition />
      <HowItWorks />
      <FAQ />
    </div>
  );
};
