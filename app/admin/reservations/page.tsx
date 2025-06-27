'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Download, Eye, Phone, MapPin, Clock } from 'lucide-react';

// Mock data
const reservations = [
  {
    id: 'BK-001',
    client: 'Marie Dubois',
    phone: '+33 1 23 45 67 89',
    driver: 'Jean Martin',
    pickup: '123 Rue de la Paix, Paris',
    destination: 'Aéroport Charles de Gaulle',
    date: '2024-01-15',
    time: '10:30',
    status: 'En cours',
    amount: 45.00,
    distance: '35 km',
  },
  {
    id: 'BK-002',
    client: 'Pierre Lambert',
    phone: '+33 1 98 76 54 32',
    driver: 'Sophie Bernard',
    pickup: '456 Avenue des Champs-Élysées',
    destination: 'Gare du Nord',
    date: '2024-01-15',
    time: '09:15',
    status: 'Terminé',
    amount: 28.00,
    distance: '12 km',
  },
  {
    id: 'BK-003',
    client: 'Alice Moreau',
    phone: '+33 1 11 22 33 44',
    driver: 'Michel Durand',
    pickup: '789 Boulevard Saint-Germain',
    destination: '321 Rue de Rivoli',
    date: '2024-01-15',
    time: '14:00',
    status: 'Planifié',
    amount: 32.00,
    distance: '8 km',
  },
  {
    id: 'BK-004',
    client: 'Thomas Martin',
    phone: '+33 1 55 66 77 88',
    driver: 'Emma Petit',
    pickup: 'Gare de Lyon',
    destination: 'Tour Eiffel',
    date: '2024-01-14',
    time: '16:45',
    status: 'Annulé',
    amount: 25.00,
    distance: '15 km',
  },
  {
    id: 'BK-005',
    client: 'Sarah Johnson',
    phone: '+33 1 99 88 77 66',
    driver: 'Pierre Dubois',
    pickup: 'Musée du Louvre',
    destination: 'Montmartre',
    date: '2024-01-14',
    time: '11:20',
    status: 'Terminé',
    amount: 38.00,
    distance: '22 km',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'En cours':
      return <Badge className="bg-blue-500 hover:bg-blue-600">En cours</Badge>;
    case 'Terminé':
      return <Badge variant="secondary">Terminé</Badge>;
    case 'Planifié':
      return <Badge variant="outline">Planifié</Badge>;
    case 'Annulé':
      return <Badge variant="destructive">Annulé</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ReservationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Réservations</h1>
        <p className="text-muted-foreground">
          Gérez toutes les réservations de taxi
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Recherchez et filtrez les réservations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ID, client ou chauffeur..."
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
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
                <SelectItem value="Planifié">Planifié</SelectItem>
                <SelectItem value="Annulé">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Réservations</CardTitle>
          <CardDescription>
            {filteredReservations.length} réservation(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Chauffeur</TableHead>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Date/Heure</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reservation.client}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {reservation.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{reservation.driver}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 text-green-500" />
                          <span className="text-xs">{reservation.pickup}</span>
                        </div>
                        <div className="text-sm flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 text-red-500" />
                          <span className="text-xs">{reservation.destination}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {reservation.distance}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{reservation.date}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {reservation.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                    <TableCell className="font-medium">€{reservation.amount.toFixed(2)}</TableCell>
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
    </div>
  );
}