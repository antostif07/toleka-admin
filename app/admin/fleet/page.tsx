'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Car, 
  Search, 
  Plus,
  MapPin,
  Fuel,
  Calendar,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

// Mock data
const vehicles = [
  {
    id: 1,
    model: 'Mercedes Classe E',
    plate: 'AB-123-CD',
    year: 2022,
    driver: 'Jean Martin',
    status: 'En service',
    location: 'Paris 8ème',
    mileage: 45000,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10',
    fuelLevel: 85,
    condition: 'Excellent',
    type: 'Premium',
  },
  {
    id: 2,
    model: 'BMW Série 5',
    plate: 'EF-456-GH',
    year: 2021,
    driver: 'Sophie Bernard',
    status: 'En maintenance',
    location: 'Garage Central',
    mileage: 62000,
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-04-05',
    fuelLevel: 0,
    condition: 'Bon',
    type: 'Premium',
  },
  {
    id: 3,
    model: 'Tesla Model S',
    plate: 'MN-012-PQ',
    year: 2023,
    driver: 'Emma Petit',
    status: 'En service',
    location: 'Paris 7ème',
    mileage: 15000,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-07-15',
    fuelLevel: 92,
    condition: 'Excellent',
    type: 'Électrique',
  },
  {
    id: 4,
    model: 'Audi A6',
    plate: 'IJ-789-KL',
    year: 2020,
    driver: 'Michel Durand',
    status: 'Hors service',
    location: 'Parking',
    mileage: 78000,
    lastMaintenance: '2023-12-20',
    nextMaintenance: '2024-03-20',
    fuelLevel: 45,
    condition: 'Moyen',
    type: 'Standard',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'En service':
      return <Badge className="bg-green-500 hover:bg-green-600">En service</Badge>;
    case 'En maintenance':
      return <Badge className="bg-orange-500 hover:bg-orange-600">En maintenance</Badge>;
    case 'Hors service':
      return <Badge variant="secondary">Hors service</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getConditionBadge = (condition: string) => {
  switch (condition) {
    case 'Excellent':
      return <Badge variant="outline" className="text-green-500 border-green-500">Excellent</Badge>;
    case 'Bon':
      return <Badge variant="outline" className="text-blue-500 border-blue-500">Bon</Badge>;
    case 'Moyen':
      return <Badge variant="outline" className="text-orange-500 border-orange-500">Moyen</Badge>;
    default:
      return <Badge variant="outline">{condition}</Badge>;
  }
};

export default function FleetPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion de Flotte</h1>
          <p className="text-muted-foreground">
            Surveillez et gérez votre parc de véhicules
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un véhicule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En service</p>
                <p className="text-xl font-bold">
                  {vehicles.filter(v => v.status === 'En service').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Wrench className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En maintenance</p>
                <p className="text-xl font-bold">
                  {vehicles.filter(v => v.status === 'En maintenance').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hors service</p>
                <p className="text-xl font-bold">
                  {vehicles.filter(v => v.status === 'Hors service').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Car className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{vehicles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par modèle, plaque ou chauffeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="En service">En service</SelectItem>
                <SelectItem value="En maintenance">En maintenance</SelectItem>
                <SelectItem value="Hors service">Hors service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{vehicle.model}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.plate} • {vehicle.year}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(vehicle.status)}
                  {getConditionBadge(vehicle.condition)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Driver & Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{vehicle.driver}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{vehicle.location}</span>
                </div>
              </div>

              {/* Mileage */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Kilométrage</span>
                  <span className="text-sm">{vehicle.mileage.toLocaleString()} km</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${Math.min((vehicle.mileage / 100000) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Fuel Level */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {vehicle.type === 'Électrique' ? 'Batterie' : 'Carburant'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        vehicle.fuelLevel > 50 ? 'bg-green-500' : 
                        vehicle.fuelLevel > 25 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{vehicle.fuelLevel}%</span>
                </div>
              </div>

              {/* Maintenance */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Dernière maintenance: {new Date(vehicle.lastMaintenance).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Prochaine: {new Date(vehicle.nextMaintenance).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Détails
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Wrench className="h-3 w-3 mr-1" />
                  Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}