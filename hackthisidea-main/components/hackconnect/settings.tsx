"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import Layout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Bell, Shield, Globe, Moon, Smartphone, Mail, Key, Trash2, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Settings</h1>
          <p className="text-zinc-600 dark:text-zinc-300">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <NavItem
                    icon={User}
                    label="Profile"
                    active={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                  />
                  <NavItem
                    icon={Bell}
                    label="Notifications"
                    active={activeTab === "notifications"}
                    onClick={() => setActiveTab("notifications")}
                  />
                  <NavItem
                    icon={Globe}
                    label="Preferences"
                    active={activeTab === "preferences"}
                    onClick={() => setActiveTab("preferences")}
                  />
                  <NavItem
                    icon={Shield}
                    label="Security"
                    active={activeTab === "security"}
                    onClick={() => setActiveTab("security")}
                  />
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && <ProfileSettings />}

            {activeTab === "notifications" && <NotificationSettings />}

            {activeTab === "preferences" && <PreferenceSettings />}

            {activeTab === "security" && <SecuritySettings />}
          </div>
        </div>
      </div>
    </Layout>
  )
}

// Navigation Item Component
function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
        active
          ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </button>
  )
}

// Profile Settings Component
function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your personal information and public profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div>
            <Button size="sm" variant="outline">
              Change Avatar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <Input defaultValue="Alex" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <Input defaultValue="Johnson" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input defaultValue="alex@example.com" type="email" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <Textarea
            defaultValue="Full stack developer with 5 years of experience building web applications. Passionate about hackathons and building innovative solutions to real-world problems."
            rows={4}
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Brief description for your profile. URLs are hyperlinked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Input defaultValue="Full Stack Developer" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input defaultValue="New York, NY" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Availability</label>
          <Select defaultValue="weekends">
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="weekends">Weekends</SelectItem>
              <SelectItem value="evenings">Evenings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Social Links</h3>
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 dark:text-zinc-400">GitHub</label>
            <Input defaultValue="github.com/alexjohnson" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 dark:text-zinc-400">LinkedIn</label>
            <Input defaultValue="linkedin.com/in/alexjohnson" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 dark:text-zinc-400">Website</label>
            <Input defaultValue="alexjohnson.dev" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}

// Notification Settings Component
function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how you receive notifications and updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Email Notifications</h3>
          <div className="space-y-3">
            <NotificationOption
              title="Team Requests"
              description="Receive notifications when someone invites you to join their team"
              defaultChecked={true}
            />
            <NotificationOption
              title="Hackathon Reminders"
              description="Receive reminders about upcoming hackathons you've registered for"
              defaultChecked={true}
            />
            <NotificationOption
              title="Forum Replies"
              description="Receive notifications when someone replies to your forum posts"
              defaultChecked={true}
            />
            <NotificationOption
              title="Resource Updates"
              description="Receive notifications about new resources and guides"
              defaultChecked={false}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Push Notifications</h3>
          <div className="space-y-3">
            <NotificationOption
              title="Team Activity"
              description="Receive notifications about your team's activity"
              defaultChecked={true}
            />
            <NotificationOption
              title="Hackathon Updates"
              description="Receive updates about hackathons you're participating in"
              defaultChecked={true}
            />
            <NotificationOption
              title="Direct Messages"
              description="Receive notifications for new direct messages"
              defaultChecked={true}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Marketing Communications</h3>
          <div className="space-y-3">
            <NotificationOption
              title="Product Updates"
              description="Receive updates about new features and improvements"
              defaultChecked={false}
            />
            <NotificationOption
              title="Promotional Emails"
              description="Receive promotional emails and special offers"
              defaultChecked={false}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}

// Notification Option Component
function NotificationOption({
  title,
  description,
  defaultChecked,
}: { title: string; description: string; defaultChecked: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-medium text-zinc-900 dark:text-white">{title}</h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}

// Preference Settings Component
function PreferenceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your experience on HackThisIdea</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Appearance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Theme</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Choose your preferred theme</p>
              </div>
              <Select defaultValue="system">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <PreferenceOption
              icon={Moon}
              title="Reduce Animations"
              description="Reduce motion and animations throughout the interface"
              defaultChecked={false}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Language & Region</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Language</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Select your preferred language</p>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Time Zone</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Set your local time zone</p>
              </div>
              <Select defaultValue="america_new_york">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america_new_york">America/New York</SelectItem>
                  <SelectItem value="america_los_angeles">America/Los Angeles</SelectItem>
                  <SelectItem value="europe_london">Europe/London</SelectItem>
                  <SelectItem value="asia_tokyo">Asia/Tokyo</SelectItem>
                  <SelectItem value="australia_sydney">Australia/Sydney</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Privacy</h3>
          <div className="space-y-3">
            <PreferenceOption
              icon={Globe}
              title="Public Profile"
              description="Make your profile visible to other users"
              defaultChecked={true}
            />
            <PreferenceOption
              icon={Mail}
              title="Show Email"
              description="Display your email address on your public profile"
              defaultChecked={false}
            />
            <PreferenceOption
              icon={Smartphone}
              title="Activity Status"
              description="Show when you're active on the platform"
              defaultChecked={true}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}

// Preference Option Component
function PreferenceOption({
  icon: Icon,
  title,
  description,
  defaultChecked,
}: { icon: any; title: string; description: string; defaultChecked: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 mt-0.5 text-zinc-500 dark:text-zinc-400" />
        <div>
          <h4 className="text-sm font-medium text-zinc-900 dark:text-white">{title}</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}

// Security Settings Component
function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security and authentication options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Password</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input type="password" />
            </div>
            <Button size="sm">
              <Key className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
          <div className="space-y-3">
            <PreferenceOption
              icon={Shield}
              title="Enable Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              defaultChecked={false}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Sessions</h3>
          <div className="space-y-3">
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Current Session</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Chrome on Windows • New York, USA</p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                >
                  Active
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Started: Today at 10:45 AM</p>
            </div>
            <Button variant="outline" size="sm">
              Sign Out of All Other Sessions
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
          <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
            <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Delete Account</h4>
            <p className="text-xs text-red-600 dark:text-red-400 mb-4">
              Once you delete your account, there is no going back. This action cannot be undone.
            </p>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
