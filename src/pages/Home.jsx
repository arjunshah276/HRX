import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import { 
  Hammer, 
  Calculator, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Wrench,
  MapPin,
  DollarSign
} from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const templates = [
    {
      id: 'deck-refresh',
      title: 'Deck Refresh',
      description: 'Revitalize your existing deck with new stain, repairs, and upgrades',
      icon: <Hammer className="w-8 h-8 text-blue-600" />,
      estimatedTime: '1-2 days',
      priceRange: '$500 - $2000'
    },
    {
      id: 'firepit',
      title: 'Outdoor Firepit',
      description: 'Build a cozy firepit area with seating and basic landscaping',
      icon: <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">🔥</div>,
      estimatedTime: '2-3 days',
      priceRange: '$800 - $3000'
    },
    {
      id: 'lawn-mowing',
      title: 'Lawn Mowing',
      description: 'Professional lawn care with customizable scheduling',
      icon: <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">🌱</div>,
      estimatedTime: '2-4 hours',
      priceRange: '$50 - $200'
    },
    {
      id: 'garden-bed',
      title: 'Garden Bed',
      description: 'Create beautiful garden beds with plants and flowers',
      icon: <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm">🌸</div>,
      estimatedTime: '1 day',
      priceRange: '$200 - $1000'
    },
    {
      id: 'pressure-washing',
      title: 'Pressure Washing',
      description: 'Deep clean driveways, decks, and exterior surfaces',
      icon: <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm">💧</div>,
      estimatedTime: '3-6 hours',
      priceRange: '$150 - $500'
    }
  ]

  const features = [
    {
      icon: <Calculator className="w-12 h-12 text-blue-600" />,
      title: 'Instant Estimates',
      description: 'Get accurate cost estimates with our intelligent template system'
    },
    {
      icon: <Users className="w-12 h-12 text-green-600" />,
      title: 'Verified Contractors',
      description: 'Work with pre-screened, professional contractors in your area'
    },
    {
      icon: <DollarSign className="w-12 h-12 text-purple-600" />,
      title: 'Transparent Pricing',
      description: 'No hidden fees. See exactly what you pay for materials and labor'
    },
    {
      icon: <MapPin className="w-12 h-12 text-red-600" />,
      title: 'Local Service',
      description: 'Supporting local contractors and serving your community'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      project: 'Deck Refresh',
      rating: 5,
      comment: 'Amazing service! My deck looks brand new and the process was so smooth.',
      location: 'Vancouver, BC'
    },
    {
      name: 'Mike Chen',
      project: 'Firepit Installation',
      rating: 5,
      comment: 'The firepit exceeded our expectations. Perfect for family gatherings!',
      location: 'Richmond, BC'
    },
    {
      name: 'Jennifer Smith',
      project: 'Garden Bed',
      rating: 5,
      comment: 'Beautiful garden bed installation. The plants are thriving!',
      location: 'Burnaby, BC'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Home with 
              <span className="text-yellow-400"> Template-Based </span>
              Renovations
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Skip the guesswork. Get instant estimates, connect with verified contractors, 
              and turn your renovation dreams into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link 
                  to="/new-project"
                  className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                >
                  Start Your Project <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/signup"
                    className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                  >
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="#templates"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors"
                  >
                    View Templates
                  </Link>
                </>
              )}
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-blue-200">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">4.8★</div>
                <div className="text-blue-200">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">98%</div>
                <div className="text-blue-200">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've simplified home renovation by connecting you with the right professionals 
              and providing transparent, template-based pricing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-transform">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Project Templates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our curated templates designed for common home improvement projects. 
              Get instant estimates and connect with local professionals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 group">
                <div className="flex items-center gap-3 mb-4">
                  {template.icon}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {template.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {template.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>⏱️ {template.estimatedTime}</span>
                  <span>💰 {template.priceRange}</span>
                </div>
                {user ? (
                  <Link 
                    to="/new-project"
                    state={{ selectedTemplate: template.id }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-700"
                  >
                    Start Project <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link 
                    to="/signup"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Get Estimate <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple 4-step process gets your project from idea to completion
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Choose Template', description: 'Select from our proven project templates', icon: <Calculator className="w-8 h-8" /> },
              { step: '2', title: 'Customize Details', description: 'Input your specific requirements and upload photos', icon: <Wrench className="w-8 h-8" /> },
              { step: '3', title: 'Get Matched', description: 'We connect you with verified local contractors', icon: <Users className="w-8 h-8" /> },
              { step: '4', title: 'Project Complete', description: 'Enjoy your beautifully renovated space', icon: <CheckCircle className="w-8 h-8" /> }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-blue-200 z-0"></div>
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <div className="text-blue-600 mb-2 flex justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from real customers who transformed their homes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.project} • {testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of satisfied customers who chose our platform for their home renovation needs
          </p>
          {user ? (
            <Link 
              to="/new-project"
              className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors inline-flex items-center gap-2"
            >
              Start Your Project Now <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup"
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors inline-flex items-center gap-2"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HomeReno Templates</h3>
              <p className="text-gray-400">
                Simplifying home renovation through template-based solutions and verified professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Deck Refresh</a></li>
                <li><a href="#" className="hover:text-white">Firepit Installation</a></li>
                <li><a href="#" className="hover:text-white">Lawn Care</a></li>
                <li><a href="#" className="hover:text-white">Garden Beds</a></li>
                <li><a href="#" className="hover:text-white">Pressure Washing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Contractor Portal</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HomeReno Templates. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
