'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Car, 
  Star, 
  MapPin,
  Edit,
  MoreHorizontal,
  Download,
  Eye
} from 'lucide-react';

// Mock data
const drivers = [
  {
    id: 1,
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33 1 23 45 67 89',
    avatar: '',
    status: 'En ligne',
    rating: 4.9,
    totalTrips: 1247,
    vehicle: {
      model: 'Mercedes Classe E',
      plate: 'AB-123-CD',
      year: 2022,
    },
    joinDate: '2023-01-15',
    earnings: 15420,
    location: 'Paris 8ème',
  },
  {
    id: 2,
    name: 'Sophie Bernard',
    email: 'sophie.bernard@email.com',
    phone: '+33 1 98 76 54 32',
    avatar: '',
    status: 'Occupé',
    rating: 4.8,
    totalTrips: 1098,
    vehicle: {
      model: 'BMW Série 5',
      plate: 'EF-456-GH',
      year: 2021,
    },
    joinDate: '2023-02-20',
    earnings: 13680,
    location: 'Paris 16ème',
  },
  {
    id: 3,
    name: 'Michel Durand',
    email: 'michel.durand@email.com',
    phone: '+33 1 11 22 33 44',
    avatar: '',
    status: 'Hors ligne',
    rating: 4.7,
    totalTrips: 892,
    vehicle: {
      model: 'Audi A6',
      plate: 'IJ-789-KL',
      year: 2020,
    },
    joinDate: '2023-03-10',
    earnings: 11240,
    location: 'Paris 12ème',
  },
  {
    id: 4,
    name: 'Emma Petit',
    email: 'emma.petit@email.com',
    phone: '+33 1 55 66 77 88',
    avatar: '',
    status: 'En ligne',
    rating: 4.9,
    totalTrips: 756,
    vehicle: {
      model: 'Tesla Model S',
      plate: 'MN-012-PQ',
      year: 2023,
    },
    joinDate: '2023-04-05',
    earnings: 9850,
    location: 'Paris 7ème',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'En ligne':
      return <Badge className="bg-green-500 hover:bg-green-600">En ligne</Badge>;
    case 'Occupé':
      return <Badge className="bg-orange-500 hover:bg-orange-600">Occupé</Badge>;
    case 'Hors ligne':
      return <Badge variant="secondary">Hors ligne</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Chauffeurs</h1>
          <p className="text-muted-foreground">
            Gérez votre équipe de chauffeurs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Link href="/admin/drivers/add">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un chauffeur
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En ligne</p>
                <p className="text-xl font-bold">
                  {drivers.filter(d => d.status === 'En ligne').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Occupés</p>
                <p className="text-xl font-bold">
                  {drivers.filter(d => d.status === 'Occupé').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-500/10 rounded-lg">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hors ligne</p>
                <p className="text-xl font-bold">
                  {drivers.filter(d => d.status === 'Hors ligne').length}
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
                <p className="text-xl font-bold">{drivers.length}</p>
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
                placeholder="Rechercher par nom, email ou véhicule..."
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
                <SelectItem value="En ligne">En ligne</SelectItem>
                <SelectItem value="Occupé">Occupé</SelectItem>
                <SelectItem value="Hors ligne">Hors ligne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={driver.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{driver.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span className="text-sm text-muted-foreground">{driver.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(driver.status)}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{driver.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{driver.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{driver.location}</span>
                </div>
              </div>

              {/* Vehicle */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{driver.vehicle.model}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {driver.vehicle.plate} • {driver.vehicle.year}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Courses</p>
                  <p className="font-semibold">{driver.totalTrips}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenus</p>
                  <p className="font-semibold">€{driver.earnings.toLocaleString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Voir
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="h-3 w-3 mr-1" />
                  Appeler
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}