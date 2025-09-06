"use client"

import { useState, useEffect } from "react"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Users, Lightbulb, Calendar, Trophy, CheckCircle, ExternalLink, Star, Rocket, ArrowUpRight, Globe, Sparkles, BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"
import LandingLoading from "./loading"

// Define the feature type
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  featured?: boolean;
}

// Define the step type
interface Step {
  title: string;
  description: string;
}

// Define the testimonial type
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  featured?: boolean;
}

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set loading to false after the loading component completes
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  // Features data
  const features: Feature[] = [
    {
      icon: <Users className="w-12 h-12 text-violet-600 dark:text-violet-400" />,
      title: "Team Builder",
      description: "Find teammates with complementary skills and shared interests who match your vibe and vision."
    },
    {
      icon: <BrainCircuit className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
      title: "AI Idea Generator",
      description: "Generate innovative project ideas tailored to hackathon themes using our advanced AI technology.",
      featured: true
    },
    {
      icon: <Calendar className="w-12 h-12 text-violet-600 dark:text-violet-400" />,
      title: "Event Tracker",
      description: "Discover upcoming hackathons worldwide, register for events, and manage your schedule all in one place."
    },
    {
      icon: <Trophy className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
      title: "Project Showcase",
      description: "Showcase your hackathon projects to get feedback, recognition, and connect with potential employers."
    },
    {
      icon: <Code className="w-12 h-12 text-violet-600 dark:text-violet-400" />,
      title: "Resource Hub",
      description: "Access curated libraries, APIs, templates and learning resources to accelerate your development."
    },
    {
      icon: <Globe className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
      title: "Global Community",
      description: "Join a thriving community of hackers, mentors and tech enthusiasts from around the world."
    }
  ];

  // Steps data
  const steps: Step[] = [
    {
      title: "Create Your Profile",
      description: "Sign up and build your hacker profile showcasing your skills, interests, and past projects."
    },
    {
      title: "Find Your Dream Team",
      description: "Connect with teammates who complement your skills and share your passion for innovation."
    },
    {
      title: "Build & Win Together",
      description: "Collaborate seamlessly, leverage our resources, and create winning hackathon projects."
    }
  ];

  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      quote: "HackThisIdea helped me find the perfect team for my first hackathon. We ended up winning first place and are now turning our project into a startup!",
      name: "Alex Chen",
      role: "CS Student, Stanford University",
      avatar: "/default-avatar.svg",
      featured: true
    },
    {
      quote: "The AI idea generator is incredible! When our team was stuck, it suggested a concept that was both innovative and feasible within the hackathon timeframe.",
      name: "Sarah Johnson",
      role: "Frontend Developer",
      avatar: "/default-avatar.svg"
    },
    {
      quote: "As a hackathon organizer, I recommend HackThisIdea to all participants. It helps create balanced teams and leads to more impressive projects overall.",
      name: "Michael Wong",
      role: "Hackathon Organizer, TechCrunch",
      avatar: "/default-avatar.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {isLoading && <LandingLoading />}
      
      {/* Navigation with glass morphism */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-lg bg-white/70 dark:bg-zinc-950/70 border-zinc-200 dark:border-zinc-800">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10">
              <Image
                src="/hackconnect-logo.svg"
                alt="HackThisIdea Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">HackThisIdea</span>
          </div>
          <nav className="items-center hidden gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium transition-all text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:scale-105"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium transition-all text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:scale-105"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium transition-all text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:scale-105"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="transition-all hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:scale-105">
                Log In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="transition-all shadow-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg hover:scale-105">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with animated background and 3D elements */}
      <section className={`relative py-24 overflow-hidden md:py-32 ${!isLoading ? 'animate-fade-in' : 'opacity-0'}`}>
        {/* Modern gradient background with animated elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,theme(colors.violet.100),transparent_50%),radial-gradient(ellipse_at_bottom_left,theme(colors.indigo.100),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,theme(colors.violet.950),transparent_50%),radial-gradient(ellipse_at_bottom_left,theme(colors.indigo.950),transparent_50%)]"></div>
        
        {/* Animated floating elements */}
        <div className="absolute hidden md:block w-64 h-64 bg-violet-200/30 dark:bg-violet-800/10 rounded-full blur-3xl animate-float top-12 left-12 mix-blend-multiply dark:mix-blend-overlay"></div>
        <div className="absolute hidden md:block w-64 h-64 bg-indigo-200/30 dark:bg-indigo-800/10 rounded-full blur-3xl animate-float-delayed bottom-24 right-12 mix-blend-multiply dark:mix-blend-overlay"></div>
        
        <div className="container relative px-4 mx-auto">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div className={`text-center lg:text-left ${!isLoading ? 'animate-slide-up' : ''}`}>
              <Badge className="mb-4 font-medium text-violet-800 bg-violet-100 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800 animate-fade-in [animation-delay:200ms]">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Launching April 2025
              </Badge>
              <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-transparent md:text-7xl bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 animate-fade-in-up [animation-delay:400ms]">
                Build. Innovate.<br />Win Hackathons.
              </h1>
              <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed mx-auto lg:mx-0 max-w-3xl animate-fade-in-up [animation-delay:600ms]">
                Find the perfect teammates, generate breakthrough ideas, and create award-winning projects with the ultimate hackathon companion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up [animation-delay:800ms]">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full transition-all shadow-lg sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:shadow-violet-500/20 hover:scale-105">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg" className="w-full transition-all sm:w-auto hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:scale-105">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className={`mx-auto lg:mx-0 max-w-lg ${!isLoading ? 'animate-scale-up [animation-delay:400ms]' : 'opacity-0'}`}>
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/hackathon-illustration.svg"
                  alt="Hackathon Illustration"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
            
          {/* Stats section with enhanced cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in-up [animation-delay:1000ms]">
            <div className="p-6 border bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all hover:scale-105">
              <div className="mb-1 text-4xl font-bold text-violet-600 dark:text-violet-400">10,000+</div>
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Hackathon participants</div>
            </div>
            <div className="p-6 border bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all hover:scale-105">
              <div className="mb-1 text-4xl font-bold text-indigo-600 dark:text-indigo-400">2,500+</div>
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Teams formed</div>
            </div>
            <div className="p-6 border bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all hover:scale-105">
              <div className="mb-1 text-4xl font-bold text-purple-600 dark:text-purple-400">500+</div>
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Projects launched</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-24 bg-zinc-50 dark:bg-zinc-900/50 ${!isLoading ? 'animate-fade-in [animation-delay:200ms]' : 'opacity-0'}`}>
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">All the tools for hackathon success</h2>
            <p className="mx-auto text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Everything you need to form the perfect team, create amazing projects, and present your work to the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title} 
                {...feature} 
                className={`${!isLoading ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-24 ${!isLoading ? 'animate-fade-in [animation-delay:400ms]' : 'opacity-0'}`}>
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">How HackThisIdea works</h2>
            <p className="mx-auto text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl">
              A simple process designed to maximize your hackathon success from start to finish.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <StepCard 
                key={step.title} 
                {...step} 
                number={index + 1} 
                className={`${!isLoading ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-24 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 ${!isLoading ? 'animate-fade-in [animation-delay:600ms]' : 'opacity-0'}`}>
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">What hackers are saying</h2>
            <p className="mx-auto text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl">
              Don't just take our word for it – here's what participants have to say about HackThisIdea.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.name} 
                {...testimonial} 
                className={`${!isLoading ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={`py-24 bg-gradient-to-r from-violet-600 to-indigo-600 ${!isLoading ? 'animate-fade-in [animation-delay:800ms]' : 'opacity-0'}`}>
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">Ready to elevate your hackathon experience?</h2>
            <p className="mb-8 text-xl text-violet-200">
              Join thousands of hackers who are building amazing projects and winning competitions together.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="transition-all bg-white hover:bg-violet-100 hover:scale-105 dark:bg-violet-950 dark:text-white dark:hover:bg-violet-900 text-violet-600">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className={`bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 ${!isLoading ? 'animate-fade-in [animation-delay:1000ms]' : 'opacity-0'}`}>
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8">
                  <Image
                    src="/hackconnect-logo.svg"
                    alt="HackThisIdea Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                </div>
                <span className="text-lg font-bold text-white">HackConnect</span>
              </div>
              <p className="mb-4 text-sm text-zinc-400">
                Connecting talented hackers, generating innovative ideas, and building amazing projects.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Team Builder</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Idea Generator</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Event Tracker</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-zinc-800 text-center">
            <p className="text-sm">© 2025 HackThisIdea. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  featured = false,
  className,
  style
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  featured?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Card className={cn(
      "transition-all hover:shadow-md hover:scale-105",
      featured ? "border-indigo-200 dark:border-indigo-800" : "border-zinc-200 dark:border-zinc-800",
      className
    )}
    style={style}
    >
      <CardContent className="p-6">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
        <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
        {featured && (
          <div className="mt-4">
            <Badge className="text-indigo-700 border-indigo-200 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
              <Sparkles className="w-3 h-3 mr-1" />
              Popular Feature
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StepCard({ 
  number, 
  title, 
  description,
  className,
  style
}: { 
  number: number; 
  title: string; 
  description: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div 
      className={cn(
        "p-8 text-center border rounded-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all hover:scale-105",
        className
      )}
      style={style}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 mb-6 text-xl font-bold text-white rounded-full bg-gradient-to-br from-violet-600 to-indigo-600">{number}</div>
      <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  )
}

function TestimonialCard({ 
  quote, 
  name, 
  role, 
  avatar,
  featured = false,
  className,
  style
}: { 
  quote: string; 
  name: string; 
  role: string; 
  avatar: string;
  featured?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md hover:scale-105",
        featured ? "border-violet-200 dark:border-violet-800" : "border-zinc-200 dark:border-zinc-800",
        className
      )}
      style={style}
    >
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <div className="overflow-hidden border-2 rounded-full border-violet-200 dark:border-violet-800">
              <img src={avatar} alt={name} className="w-12 h-12 object-cover" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{name}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{role}</p>
          </div>
        </div>
        <p className="text-zinc-600 dark:text-zinc-300 italic">"{quote}"</p>
        {featured && (
          <div className="mt-4">
            <Badge className="text-indigo-700 border-indigo-200 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
              <Trophy className="w-3 h-3 mr-1" />
              Hackathon Winner
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
