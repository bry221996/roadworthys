'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              Welcome to Roadworthys
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your comprehensive vehicle roadworthiness management system.
              Track materials, manage inspections, and ensure compliance all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔧</span>
                  Materials Management
                </CardTitle>
                <CardDescription>
                  Track and manage all your vehicle materials and parts inventory
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  Inspections
                </CardTitle>
                <CardDescription>
                  Schedule and complete comprehensive vehicle inspections
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Reports
                </CardTitle>
                <CardDescription>
                  Generate detailed reports and maintain compliance records
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="pt-8">
            <p className="text-gray-600 mb-4">Get started today</p>
            <div className="text-sm text-gray-500">
              Login or register using the buttons in the navigation bar above
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Here's your dashboard overview
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl">🔧</span>
                Materials
              </CardTitle>
              <CardDescription>View and manage materials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">--</p>
              <p className="text-sm text-muted-foreground mt-1">Total materials</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl">✓</span>
                Inspections
              </CardTitle>
              <CardDescription>Recent inspections</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">--</p>
              <p className="text-sm text-muted-foreground mt-1">Completed this month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl">⏰</span>
                Pending Tasks
              </CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">--</p>
              <p className="text-sm text-muted-foreground mt-1">Tasks pending</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl">📊</span>
                Reports
              </CardTitle>
              <CardDescription>Generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">--</p>
              <p className="text-sm text-muted-foreground mt-1">Reports available</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl">🚗</span>
                Vehicles
              </CardTitle>
              <CardDescription>Active vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">--</p>
              <p className="text-sm text-muted-foreground mt-1">Vehicles registered</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
