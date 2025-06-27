'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Car, 
  Users, 
  DollarSign, 
  Clock,
  MapPin,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Mock data
const stats = [
  {
    title: 'Réservations Aujourd\'hui',
    value: '127',
    change: '+12%',
    trend: 'up',
    icon: Calendar,
    color: 'text-blue-500',
  },
  {
    title: 'Chauffeurs Actifs',
    value: '34',
    change: '+2',
    trend: 'up',
    icon: Car,
    color: 'text-green-500',
  },
  {
    title: 'Nouveaux Clients',
    value: '18',
    change: '+8%',
    trend: 'up',
    icon: Users,
    color: 'text-purple-500',
  },
  {
    title: 'Revenus du Jour',
    value: '€2,847',
    change: '-3%',
    trend: 'down',
    icon: DollarSign,
    color: 'text-yellow-500',
  },
];

const recentBookings = [
  {
    id: '#BK-001',
    client: 'Marie Dubois',
    driver: 'Jean Martin',
    pickup: '123 Rue de la Paix',
    destination: 'Aéroport CDG',
    status: 'En cours',
    time: '10:30',
    amount: '€45.00',
  },
  {
    id: '#BK-002',
    client: 'Pierre Lambert',
    driver: 'Sophie Bernard',
    pickup: '456 Avenue des Champs',
    destination: 'Gare du Nord',
    status: 'Terminé',
    time: '09:15',
    amount: '€28.00',
  },
  {
    id: '#BK-003',
    client: 'Alice Moreau',
    driver: 'Michel Durand',
    pickup: '789 Boulevard Saint-Germain',
    destination: '321 Rue de Rivoli',
    status: 'Planifié',
    time: '14:00',
    amount: '€32.00',
  },
];

const topDrivers = [
  {
    name: 'Jean Martin',
    trips: 48,
    rating: 4.9,
    earnings: '€1,240',
  },
  {
    name: 'Sophie Bernard',
    trips: 42,
    rating: 4.8,
    earnings: '€1,120',
  },
  {
    name: 'Michel Durand',
    trips: 39,
    rating: 4.7,
    earnings: '€980',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <p className="text-muted-foreground">
          {`Vue d'ensemble de votre activité taxi aujourd'hui`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  <TrendIcon className="h-4 w-4" />
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Réservations Récentes</CardTitle>
            <CardDescription>
              Les dernières réservations de taxi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{booking.id}</span>
                      <Badge variant={
                        booking.status === 'En cours' ? 'default' :
                        booking.status === 'Terminé' ? 'secondary' : 'outline'
                      }>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.client} • {booking.driver}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {booking.pickup} → {booking.destination}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-medium">{booking.amount}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {booking.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Drivers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Chauffeurs</CardTitle>
            <CardDescription>
              Meilleurs chauffeurs ce mois-ci
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDrivers.map((driver, index) => (
                <div key={driver.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {driver.trips} courses
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{driver.earnings}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {driver.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}