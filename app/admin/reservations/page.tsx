'use client';

import { useEffect, useState } from 'react';
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
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

type Reservation = {
  id: string;
  client: string;
  phone: string;
  driver: string;
  pickup: string;
  destination: string;
  date: string; // Note: Si vous utilisez des Timestamps Firestore, il faudra convertir .toDate().toLocaleDateString()
  time: string;
  status: 'En cours' | 'Terminé' | 'Planifié' | 'Annulé';
  amount: number;
  distance: string;
};

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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Créer une requête sur la collection 'rides'
    const q = query(collection(db, 'rides'));

    // onSnapshot établit l'écouteur en temps réel
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ridesData: Reservation[] = [];
      querySnapshot.forEach((doc) => {
        // Ajouter l'ID du document aux données
        ridesData.push({ id: doc.id, ...doc.data() } as Reservation);
      });
      setReservations(ridesData);
    });

    // La fonction de nettoyage de useEffect
    // Elle se déclenchera à la sortie du composant pour stopper l'écouteur
    // et éviter les fuites de mémoire.
    return () => unsubscribe();
  }, []);
  
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