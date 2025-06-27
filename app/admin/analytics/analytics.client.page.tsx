'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, Route, Star, TrendingUp } from 'lucide-react';

// Type pour les données initiales reçues du serveur
type AnalyticsData = {
  totalRevenue: number;
  totalRides: number;
  totalDistanceKm: number;
  averageRating: number;
  chartData: { name: string, Revenus: number }[];
};

interface AnalyticsClientPageProps {
  initialData: AnalyticsData;
}

export default function AnalyticsClientPage({ initialData }: AnalyticsClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data] = useState(initialData); // On utilise un état pour de futures mises à jour

  const handlePeriodChange = (period: string) => {
    router.push(`/dashboard/analytics?period=${period}`);
  };

  return (
    <div className="space-y-6">
      {/* Header avec sélecteur de période */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytiques</h1>
          <p className="text-muted-foreground">
            Performances détaillées de votre activité
          </p>
        </div>
        <Select defaultValue={searchParams.get('period') || 'week'} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">{`Aujourd'hui`}</SelectItem>
            <SelectItem value="week">7 derniers jours</SelectItem>
            <SelectItem value="month">30 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cartes de statistiques agrégées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Revenus Totaux" 
          value={`${data.totalRevenue.toFixed(0)} CDF`} 
          icon={DollarSign} 
        />
        <StatCard 
          title="Courses Terminées" 
          value={data.totalRides.toString()} 
          icon={TrendingUp}
        />
        <StatCard 
          title="Distance Totale" 
          value={`${data.totalDistanceKm.toFixed(1)} km`}
          icon={Route}
        />
        <StatCard 
          title="Note Moyenne" 
          value={data.averageRating.toString()} 
          icon={Star}
        />
      </div>

      {/* Graphique principal */}
      <Card>
        <CardHeader>
          <CardTitle>Revenus par Jour</CardTitle>
          <CardDescription>
            Évolution des revenus sur la période sélectionnée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} CDF`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ccc', borderRadius: '8px' }}
                formatter={(value) => [`${(value as number).toFixed(0)} CDF`, 'Revenus']}
              />
              <Bar dataKey="Revenus" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Composant réutilisable pour les cartes de statistiques
function StatCard({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}