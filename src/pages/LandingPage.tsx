
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuthContext } from "@/hooks/useAuthContext";
import { ArrowRight, CheckCircle, Egg, User } from "lucide-react";

const LandingPage = () => {
  const { session } = useAuthContext();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
        {/* Navigation */}
        <header className="container px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Egg className="h-8 w-8 text-primary" />
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
              <Egg className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">PoultryPro</span>
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
