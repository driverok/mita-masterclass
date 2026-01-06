'use client'

interface PricingTier {
  name: string
  price: string
  features: string[]
  recommended?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Basic',
    price: '$9',
    features: [
      'Up to 10 issues',
      'Basic filtering',
      'Email support',
      'Single user',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    features: [
      'Unlimited issues',
      'Advanced filtering',
      'Priority support',
      'Up to 5 users',
      'Sprint planning',
    ],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    features: [
      'Everything in Pro',
      'Unlimited users',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
]

export function PricingSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Choose the perfect plan for your team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`card relative ${
                tier.recommended
                  ? 'ring-2 ring-primary-600 shadow-lg'
                  : ''
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary-600 text-white shadow-md">
                    Recommended
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={
                  tier.recommended
                    ? 'btn-primary w-full'
                    : 'btn-secondary w-full'
                }
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
