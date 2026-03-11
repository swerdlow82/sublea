interface Feature {
  icon: string;
  iconBgColor: string;
  iconTextColor: string;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
}

const FEATURES: Feature[] = [
  {
    icon: '✓',
    iconBgColor: 'bg-green-100',
    iconTextColor: 'text-green-700',
    title: '.edu Verified',
    description: 'Every listing is verified via their university email to prevent scams.',
  },
  {
    icon: '🏠',
    iconBgColor: 'bg-blue-100',
    iconTextColor: 'text-blue-700',
    title: 'Smart Matching',
    description: 'Filter by lifestyle, cleanliness, and habits to find the perfect fit.',
  },
  {
    icon: '💬',
    iconBgColor: 'bg-purple-100',
    iconTextColor: 'text-purple-700',
    title: 'Secure Chat',
    description: 'Communicate safely within the platform without sharing personal info.',
  },
  {
    icon: '🔒',
    iconBgColor: 'bg-gray-100',
    iconTextColor: 'text-gray-700',
    title: 'Privacy First',
    description: 'Your personal contact information stays private until you choose to share it.',
  },
];

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const iconClassName = feature.icon === '✓' ? 'font-bold' : '';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className={`w-12 h-12 ${feature.iconBgColor} dark:bg-opacity-20 rounded-full flex items-center justify-center text-2xl mb-4 ${feature.iconTextColor} dark:text-opacity-90 ${iconClassName}`}>
        {feature.icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
    </div>
  );
};

export const ValueProposition = () => {
  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Why Students Trust Sublea</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature, index) => {
          return <FeatureCard feature={feature} key={index} />; // double check later key={}
        })}
      </div>
    </section>
  );
};
