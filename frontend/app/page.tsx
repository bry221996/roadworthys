'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { materialsAPI, Material } from '@/lib/api';
import MaterialCard from '@/components/MaterialCard';

export default function Home() {
  const { user, loading } = useAuth();
  const { addItem } = useCart();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [materialsError, setMaterialsError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMaterials();
    }
  }, [user]);

  const fetchMaterials = async () => {
    try {
      setMaterialsLoading(true);
      const response = await materialsAPI.list();
      setMaterials(response.materials);
    } catch (error: any) {
      setMaterialsError(error.message || 'Failed to load materials');
      console.error('Failed to fetch materials:', error);
    } finally {
      setMaterialsLoading(false);
    }
  };

  const handleAddToCart = (material: Material) => {
    addItem(material);
  };

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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Materials Shop
            </h1>
            <p className="text-gray-600 mt-1">
              Browse and order materials for your vehicle maintenance
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="font-semibold text-gray-900">{user.name}</p>
          </div>
        </div>

        {materialsError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {materialsError}
          </div>
        )}

        {materialsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="h-[400px]">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : materials.length === 0 ? (
          <Card className="py-12">
            <CardContent>
              <div className="text-center space-y-3">
                <div className="text-5xl">📦</div>
                <h3 className="text-xl font-semibold text-gray-900">No materials available</h3>
                <p className="text-gray-600">Check back later for available materials</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{materials.length}</span> materials
              </p>
              <div className="flex gap-2">
                {/* TODO: Add filters and sorting */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {materials.map((material) => (
                <MaterialCard
                  key={material.uuid}
                  material={material}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
