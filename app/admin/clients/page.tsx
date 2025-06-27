'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  TrendingUp,
  Eye,
  Star,
} from 'lucide-react';

// Mock data
const clients = [
  {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 1 23 45 67 89',
    avatar: '',
    joinDate: '2023-01-15',
    totalTrips: 47,
    totalSpent: 1247.50,
    rating: 4.8,
    status: 'Actif',
    lastTrip: '2024-01-15',
    favoriteLocations: ['Aéroport CDG', 'Gare du Nord'],
  },
  {
    id: 2,
    name: 'Pierre Lambert',
    email: 'pierre.lambert@email.com',
    phone: '+33 1 98 76 54 32',
    avatar: '',
    joinDate: '2023-02-20',
    totalTrips: 32,
    totalSpent: 890.25,
    rating: 4.6,
    status: 'Actif',
    lastTrip: '2024-01-12',
    favoriteLocations: ['République', 'Châtelet'],
  },
  {
    id: 3,
    name: 'Alice Moreau',
    email: 'alice.moreau@email.com',
    phone: '+33 1 11 22 33 44',
    avatar: '',
    joinDate: '2023-03-10',
    totalTrips: 28,
    totalSpent: 756.00,
    rating: 4.9,
    status: 'Actif',
    lastTrip: '2024-01-10',
    favoriteLocations: ['Tour Eiffel', 'Louvre'],
  },
  {
    id: 4,
    name: 'Thomas Martin',
    email: 'thomas.martin@email.com',
    phone: '+33 1 55 66 77 88',
    avatar: '',
    joinDate: '2023-04-05',
    totalTrips: 15,
    totalSpent: 420.75,
    rating: 4.2,
    status: 'Inactif',
    lastTrip: '2023-12-20',
    favoriteLocations: ['Montmartre', 'Bastille'],
  },
  {
    id: 5,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+33 1 99 88 77 66',
    avatar: '',
    joinDate: '2023-05-12',
    totalTrips: 63,
    totalSpent: 1680.90,
    rating: 4.7,
    status: 'Actif',
    lastTrip: '2024-01-14',
    favoriteLocations: ['Opéra', 'Champs-Élysées'],
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Actif':
      return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
    case 'Inactif':
      return <Badge variant="secondary">Inactif</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);
  const totalTrips = clients.reduce((sum, client) => sum + client.totalTrips, 0);
  const activeClients = clients.filter(client => client.status === 'Actif').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground">
          Gérez votre base de clients
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-xl font-bold">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clients Actifs</p>
                <p className="text-xl font-bold">{activeClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-xl font-bold">{totalTrips}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenus Total</p>
                <p className="text-xl font-bold">€{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
          <CardDescription>
            {filteredClients.length} client(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Total Dépensé</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Dernière Course</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Depuis {new Date(client.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {client.email}
                        </div>
                        <div className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell className="font-medium">{client.totalTrips}</TableCell>
                    <TableCell className="font-medium">€{client.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        <span className="text-sm">{client.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(client.lastTrip).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Meilleurs Clients</CardTitle>
          <CardDescription>
            Clients avec le plus de courses ce mois-ci
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((client, index) => (
                <div key={client.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback className="bg-muted">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.totalTrips} courses • {client.favoriteLocations.join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">€{client.totalSpent.toFixed(2)}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {client.rating}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}