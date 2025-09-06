"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "authenticated") {
    return null; // Will redirect
  }

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
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">SynergySphere</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Advanced Team
            <span className="text-blue-600 block md:inline">
              {" "}
              Collaboration
            </span>{" "}
            Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            SynergySphere helps teams operate at their best — continuously
            improving, staying aligned, and working smarter every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Sign In to Continue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Everything you need to collaborate
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built to solve the pain points that slow teams down the most.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-xl my-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            Solving Real Team Challenges
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6">
              <h3 className="font-semibold mb-2">Scattered Information</h3>
              <p className="text-sm text-muted-foreground">
                Important files, chats, and decisions live in too many places.
              </p>
            </div>
            <div className="p-6">
              <h3 className="font-semibold mb-2">Unclear Progress</h3>
              <p className="text-sm text-muted-foreground">
                Without visibility into tasks, it's tough to know project
                status.
              </p>
            </div>
            <div className="p-6">
              <h3 className="font-semibold mb-2">Resource Confusion</h3>
              <p className="text-sm text-muted-foreground">
                Team members end up overworked, underutilized, or confused.
              </p>
            </div>
            <div className="p-6">
              <h3 className="font-semibold mb-2">Deadline Surprises</h3>
              <p className="text-sm text-muted-foreground">
                Notice we're behind when it's already too late.
              </p>
            </div>
            <div className="p-6">
              <h3 className="font-semibold mb-2">Communication Gaps</h3>
              <p className="text-sm text-muted-foreground">
                Updates get missed and people get left out of the loop.
              </p>
            </div>
            <div className="p-6">
              <h3 className="font-semibold mb-2">Reactive Management</h3>
              <p className="text-sm text-muted-foreground">
                Constantly reacting instead of staying ahead of issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            Ready to transform your team collaboration?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join teams who are already working smarter with SynergySphere.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="gap-2">
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Rocket className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">SynergySphere</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SynergySphere. Built for teams who want to work smarter.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
