import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const PRICING_PLANS = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    period: "forever",
    features: [
      "5 hearts per day",
      "Basic courses",
      "Track your progress",
      "Join leaderboards",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Plus",
    description: "For dedicated learners",
    price: "$6.99",
    period: "/month",
    features: [
      "Unlimited hearts",
      "Unlimited course access",
      "Detailed progress stats",
      "No ads",
      "Priority support",
    ],
    cta: "Start Plus Trial",
    popular: true,
  },
  {
    name: "Pro",
    description: "For power users",
    price: "$12.99",
    period: "/month",
    features: [
      "Everything in Plus",
      "Unlimited streak repairs",
      "Exclusive Pro badges",
      "Monthly rewards",
      "Early access to new features",
    ],
    cta: "Start Pro Trial",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Start for free, upgrade when you need more
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-8 ${
              plan.popular
                ? "border-green-500 shadow-lg shadow-green-500/20"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-4 py-1 text-sm font-medium text-white">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-muted-foreground">{plan.description}</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>

            <ul className="mb-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? "secondary" : "secondaryOutline"}
              className="w-full"
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
