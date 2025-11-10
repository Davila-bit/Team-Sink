import { Link } from 'react-router-dom';
import {
  HomeModernIcon,
  HeartIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      icon: HomeModernIcon,
      title: 'Housing Assistance',
      description: 'Find affordable housing and emergency shelter resources in your area.',
    },
    {
      icon: HeartIcon,
      title: 'Food & Healthcare',
      description: 'Access food banks, meal programs, and healthcare services.',
    },
    {
      icon: AcademicCapIcon,
      title: 'Education Support',
      description: 'Discover financial aid and educational resources for students.',
    },
    {
      icon: UserGroupIcon,
      title: 'Community Support',
      description: 'Connect with local organizations and support groups.',
    },
  ];

  return (
    <div className="min-h-screen bg-latte-base">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-latte-blue to-latte-lavender text-white" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to Relief Net
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connecting families with resources and support when they need it most
            </p>
            <nav className="flex flex-col sm:flex-row gap-4 justify-center" aria-label="Primary actions">
              <Link to="/register" className="bg-white text-latte-blue px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-latte-blue">
                Get Started
              </Link>
              <Link to="/login" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-latte-blue">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Problem Statement */}
      <main role="main">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="mission-heading">
          <div className="text-center mb-12">
            <h2 id="mission-heading" className="text-3xl font-bold text-latte-text mb-4">
              Supporting ALICE Families
            </h2>
            <p className="text-lg text-latte-subtext1 max-w-3xl mx-auto">
              Many families earn just above the poverty line but still struggle to afford basic needs.
              Relief Net helps you find resources you're eligible for, all in one place.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12" role="list">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow" role="listitem">
                <feature.icon className="h-12 w-12 text-latte-blue mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-latte-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-latte-subtext1">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white py-16" aria-labelledby="how-it-works-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="how-it-works-heading" className="text-3xl font-bold text-latte-text mb-4">
                How It Works
              </h2>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none">
              <li className="text-center">
                <div className="bg-latte-blue text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4" aria-hidden="true">
                  1
                </div>
                <h3 className="text-xl font-semibold text-latte-text mb-2">
                  <span className="sr-only">Step 1: </span>Create Your Profile
                </h3>
                <p className="text-latte-subtext1">
                  Tell us about your situation - location, household size, and income.
                </p>
              </li>

              <li className="text-center">
                <div className="bg-latte-blue text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4" aria-hidden="true">
                  2
                </div>
                <h3 className="text-xl font-semibold text-latte-text mb-2">
                  <span className="sr-only">Step 2: </span>Find Resources
                </h3>
                <p className="text-latte-subtext1">
                  See only resources you're eligible for - no wasted time.
                </p>
              </li>

              <li className="text-center">
                <div className="bg-latte-blue text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4" aria-hidden="true">
                  3
                </div>
                <h3 className="text-xl font-semibold text-latte-text mb-2">
                  <span className="sr-only">Step 3: </span>Get Help
                </h3>
                <p className="text-latte-subtext1">
                  Connect with organizations and access the support you need.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="cta-heading">
          <div className="bg-latte-blue text-white rounded-2xl p-12 text-center">
            <h2 id="cta-heading" className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join Relief Net today and find the resources you need.
            </p>
            <Link
              to="/register"
              className="bg-white text-latte-blue px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity inline-block focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-latte-blue"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-latte-surface0" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-latte-subtext1">
            &copy; 2025 Relief Net. Providing assistance to those in need.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
