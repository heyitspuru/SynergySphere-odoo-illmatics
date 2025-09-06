"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Activity,
  CheckSquare,
  MessageSquare,
  Rocket,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Activity className="h-8 w-8 text-blue-600" />,
      title: "Project Management",
      description:
        "Create and manage projects with ease. Track progress, set deadlines, and keep everything organized.",
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-green-600" />,
      title: "Task Management",
      description:
        "Assign tasks, set priorities, and track completion. Keep your team aligned and productive.",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Team Collaboration",
      description:
        "Collaborate seamlessly with your team members. Add members, assign roles, and work together.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-orange-600" />,
      title: "Communication",
      description:
        "Stay connected with project-specific discussions and real-time updates on progress.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              SynergySphere
            </span>
          </div>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Advanced Team
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Collaboration{" "}
            </span>
            Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Streamline your team's workflow with intelligent project management,
            seamless communication, and powerful collaboration tools. Built for
            teams that want to achieve more together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Collaborating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need for team success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful features designed to help teams collaborate more
              effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
              >
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform how your team works?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already using SynergySphere to achieve
            better results together.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 dark:bg-black">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Rocket className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">
              SynergySphere
            </span>
          </div>
          <p className="text-gray-400">
            © 2024 SynergySphere. Advanced Team Collaboration Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
