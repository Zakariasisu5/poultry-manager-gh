
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuthContext } from "@/hooks/useAuthContext";
import { ArrowRight, CheckCircle, Egg, User, Mail, Phone, Check, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LandingPage = () => {
  const { session } = useAuthContext();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("monthly");

  // If user is already logged in, redirect to dashboard
  if (session) {
    navigate('/');
    return null;
  }

  const features = [
    {
      title: "Flock Management",
      description: "Track and manage your poultry inventory with detailed bird information.",
      icon: <Egg className="h-6 w-6 text-accent" />
    },
    {
      title: "Egg Production Tracking",
      description: "Monitor egg yields and analyze production trends over time.",
      icon: <Egg className="h-6 w-6 text-accent" />
    },
    {
      title: "Health Monitoring",
      description: "Keep records of vaccinations, medications, and health inspections.",
      icon: <CheckCircle className="h-6 w-6 text-accent" />
    },
    {
      title: "Expense Management",
      description: "Track feed, equipment, and other operational expenses.",
      icon: <CheckCircle className="h-6 w-6 text-accent" />
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small-Scale Farmer",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      content: "PoultryPro has transformed how I manage my farm. The egg production tracking has helped me identify patterns and optimize my operations. Highly recommended!"
    },
    {
      name: "Michael Chen",
      role: "Commercial Farm Manager",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "We've increased our efficiency by 30% since implementing PoultryPro. The health monitoring features alone are worth the investment."
    },
    {
      name: "Elena Rodriguez",
      role: "Organic Poultry Farmer",
      image: "https://randomuser.me/api/portraits/women/42.jpg",
      content: "PoultryPro has made it so simple to track our expenses and manage our flock. Customer service is excellent whenever I have questions."
    }
  ];

  const faqs = [
    {
      question: "How secure is my farm data on PoultryPro?",
      answer: "Your data is fully encrypted and backed up regularly. We use industry-standard security protocols to ensure your information is always protected and recoverable."
    },
    {
      question: "Can I use PoultryPro on multiple devices?",
      answer: "Yes! PoultryPro is accessible on any device with a web browser, allowing you to manage your farm from your desktop, tablet, or smartphone."
    },
    {
      question: "Is there a limit to how many birds I can track?",
      answer: "The number of birds you can track depends on your subscription plan. The Basic plan allows up to 1,000 birds, while Professional and Enterprise plans offer increased capacity."
    },
    {
      question: "How often is the software updated?",
      answer: "We release updates monthly with new features and improvements based on user feedback. All updates are included in your subscription at no additional cost."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a 14-day free trial with full access to all features so you can experience the benefits before committing to a subscription."
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      monthlyPrice: 29,
      annualPrice: 290,
      description: "Perfect for small farms just getting started",
      features: [
        "Up to 1,000 birds",
        "Basic reporting",
        "Egg production tracking",
        "Feed management",
        "Email support"
      ]
    },
    {
      name: "Professional",
      monthlyPrice: 79,
      annualPrice: 790,
      description: "Ideal for growing poultry operations",
      features: [
        "Up to 5,000 birds",
        "Advanced analytics",
        "Health monitoring",
        "Expense tracking",
        "Priority support",
        "Data export"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      monthlyPrice: 199,
      annualPrice: 1990,
      description: "For large commercial operations",
      features: [
        "Unlimited birds",
        "Custom reporting",
        "API access",
        "Multiple user accounts",
        "Dedicated support",
        "Advanced forecasting",
        "24/7 technical assistance"
      ]
    }
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
        {/* Navigation */}
        <header className="container px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b6344b98-df7c-4ed3-b4ae-675281440523.png" 
                alt="PoultryPro Logo" 
                className="h-12 w-12" 
              />
              <span className="text-2xl font-bold tracking-tight">PoultryPro</span>
            </div>
            <Button
              variant="ghost"
              className="px-4"
              onClick={() => navigate('/auth')}
            >
              <User className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
          <img 
            src="/lovable-uploads/b6344b98-df7c-4ed3-b4ae-675281440523.png" 
            alt="PoultryPro" 
            className="h-32 w-32 mb-8" 
          />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Modern Poultry Farm Management
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12">
            Streamline your poultry operations, track egg production, and manage your farm with our all-in-one solution.
          </p>
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 transition-all duration-300"
              onClick={() => navigate('/auth')}
            >
              <span>Get Started</span>
              <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Features Designed for Modern Poultry Farmers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col p-6 bg-card rounded-lg shadow-sm border hover-scale"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container px-4 sm:px-6 lg:px-8 py-20" id="pricing">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
            Pricing Plans
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your farm's needs. All plans include our core features with regular updates and data backup.
          </p>
          
          <div className="flex justify-center mb-8">
            <Tabs 
              defaultValue="monthly" 
              value={selectedBillingCycle}
              onValueChange={setSelectedBillingCycle}
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                <TabsTrigger value="annual">Annual Billing <span className="ml-1 text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5">Save 20%</span></TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border ${plan.highlighted ? 'border-primary shadow-lg' : 'border-border'}`}>
                <CardContent className="pt-6">
                  {plan.highlighted && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="mt-3 mb-1">
                      <span className="text-4xl font-bold">
                        ${selectedBillingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                      </span>
                      <span className="text-muted-foreground">
                        /{selectedBillingCycle === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      {plan.description}
                    </p>
                    <Button 
                      className={`w-full mb-6 ${plan.highlighted ? '' : 'bg-card hover:bg-accent text-primary border border-primary hover:text-accent-foreground'}`}
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() => navigate('/auth')}
                    >
                      Get Started
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container px-4 sm:px-6 lg:px-8 py-20 bg-secondary/20">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
            What Our Customers Say
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied poultry farmers who have transformed their operations with PoultryPro.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full mb-4 object-cover"
                    />
                    <p className="italic mb-4">"{testimonial.content}"</p>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-lg">
              <span className="font-semibold">Award-Winning Software</span> - Recognized as the Best Farm Management Solution 2023
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container px-4 sm:px-6 lg:px-8 py-20" id="faq">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Find answers to common questions about PoultryPro.
          </p>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{faq.question}</h4>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="container px-4 sm:px-6 lg:px-8 py-20 bg-card" id="contact">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
            Contact Us
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help you.
          </p>
          
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href="mailto:zakariasisu5@gmail.com" className="font-medium hover:underline">
                        zakariasisu5@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a href="tel:+233555212491" className="font-medium hover:underline">
                        +233 555 212 491
                      </a>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full" onClick={() => navigate('/auth')}>
                      Get Started Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonial/CTA Section */}
        <section className="container px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-card border rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Ready to Transform Your Poultry Farm Management?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join thousands of poultry farmers who have improved efficiency and increased productivity with PoultryPro.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="px-8"
            >
              Sign Up for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12">
          <div className="container px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/b6344b98-df7c-4ed3-b4ae-675281440523.png" 
                alt="PoultryPro Logo" 
                className="h-8 w-8" 
              />
              <span className="text-lg font-semibold">PoultryPro</span>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PoultryPro. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default LandingPage;
