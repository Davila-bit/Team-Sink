import { Link } from 'react-router-dom';
import {
  HomeModernIcon,
  HeartIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import ThemeToggle from '../components/ThemeToggle';
import LogoMark from '../components/LogoMark';

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

  const steps = [
    {
      title: 'Create Your Profile',
      description: 'Share your location, household size, and situation so we can tailor results.',
    },
    {
      title: 'Find Resources',
      description: 'See only the housing, food, healthcare, and education programs you qualify for.',
    },
    {
      title: 'Get Help',
      description: 'Connect with organizations quickly and bookmark the options you need.',
    },
  ];

  return (
    <div className="min-h-screen bg-latte-base dark:bg-mocha-base text-latte-text dark:text-mocha-text flex flex-col">
      <header className="relative overflow-hidden" role="banner">
        <div className="absolute inset-0 bg-gradient-to-br from-latte-blue to-latte-lavender dark:from-mocha-blue dark:to-mocha-mauve" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.25),transparent_45%)] dark:bg-[radial-gradient(circle_at_25%_20%,rgba(0,0,0,0.25),transparent_45%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-transparent" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-white drop-shadow-sm">
              <LogoMark className="h-10 w-10 rounded-xl shadow-sm backdrop-blur bg-white/15" />
              Relief Net
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="border border-white/60 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-latte-blue"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-latte-blue px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-latte-blue"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.6)] tracking-tight">
              Find help free of cost.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-[0_10px_28px_rgba(0,0,0,0.5)]">
              Relief Net matches your household to housing, food, healthcare, and education resources you&apos;re eligible for so you can get help faster.
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
      <main role="main" className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="mission-heading">
          <div className="bg-white dark:bg-mocha-surface0 border border-latte-surface0 dark:border-mocha-surface1 rounded-3xl shadow-lg p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 id="mission-heading" className="text-3xl font-bold text-latte-text dark:text-mocha-text mb-4">
                Support that keeps pace with your needs
              </h2>
              <p className="text-lg text-latte-subtext1 dark:text-mocha-subtext1 max-w-3xl mx-auto">
                Relief Net is built for ALICE households—earning above the poverty line, but still stretched thin. We surface resources you&apos;re eligible for in one place.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12" role="list">
              {features.map((feature, index) => (
                <div key={index} className="card text-center hover:shadow-lg transition-shadow" role="listitem">
                  <feature.icon className="h-12 w-12 text-latte-blue dark:text-mocha-blue mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-latte-text dark:text-mocha-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-latte-subtext1 dark:text-mocha-subtext1">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-latte-mantle dark:bg-mocha-mantle py-16" aria-labelledby="how-it-works-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="how-it-works-heading" className="text-3xl font-bold text-latte-text dark:text-mocha-text mb-3">
                How It Works
              </h2>
              <p className="text-latte-subtext1 dark:text-mocha-subtext1">
                Three quick steps to see resources tailored to your household.
              </p>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none">
              {steps.map((step, index) => (
                <li key={step.title} className="text-center bg-white dark:bg-mocha-surface0 border border-latte-surface0 dark:border-mocha-surface1 rounded-2xl shadow-md p-8">
                  <div className="bg-latte-blue dark:bg-mocha-blue text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4" aria-hidden="true">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-latte-text dark:text-mocha-text mb-2">
                    <span className="sr-only">Step {index + 1}: </span>{step.title}
                  </h3>
                  <p className="text-latte-subtext1 dark:text-mocha-subtext1">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="cta-heading">
          <div className="bg-latte-blue dark:bg-mocha-blue text-white rounded-3xl p-12 text-center shadow-xl">
            <h2 id="cta-heading" className="text-3xl font-bold mb-4 drop-shadow-sm">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Create your profile in minutes and see verified resources matched to you.
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
      <footer className="bg-latte-mantle dark:bg-mocha-mantle border-t border-latte-surface0 dark:border-mocha-surface0" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-latte-subtext1 dark:text-mocha-subtext1">
            &copy; 2025 Relief Net. Providing assistance to those in need.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
