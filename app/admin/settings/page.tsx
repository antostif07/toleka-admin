'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  MapPin,
  Clock,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newBooking: true,
    driverStatus: true,
    paymentReceived: false,
    systemAlerts: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez votre plateforme de réservation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {`Informations de l'entreprise`}
            </CardTitle>
            <CardDescription>
              Configurez les informations de base de votre entreprise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">{`Nom de l'entreprise`}</Label>
              <Input id="company-name" defaultValue="TaxiBooking Pro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email de contact</Label>
              <Input id="company-email" type="email" defaultValue="contact@taxibooking.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Téléphone</Label>
              <Input id="company-phone" defaultValue="+33 1 23 45 67 89" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Adresse</Label>
              <Textarea 
                id="company-address" 
                defaultValue="123 Avenue des Champs-Élysées, 75008 Paris, France"
                rows={3}
              />
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </CardContent>
        </Card>

        {/* Booking Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Paramètres de réservation
            </CardTitle>
            <CardDescription>
              Configurez les règles de réservation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="advance-booking">{`Réservation à l'avance (heures)`}</Label>
              <Select defaultValue="24">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 heure</SelectItem>
                  <SelectItem value="6">6 heures</SelectItem>
                  <SelectItem value="12">12 heures</SelectItem>
                  <SelectItem value="24">24 heures</SelectItem>
                  <SelectItem value="48">48 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancellation-time">{`Délai d'annulation (minutes)`}</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="base-fare">Tarif de base (€)</Label>
              <Input id="base-fare" type="number" step="0.01" defaultValue="3.50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="per-km">Prix par kilomètre (€)</Label>
              <Input id="per-km" type="number" step="0.01" defaultValue="1.25" />
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Nouvelles réservations</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications pour les nouvelles réservations
                </p>
              </div>
              <Switch 
                checked={notifications.newBooking}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, newBooking: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Statut des chauffeurs</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications quand un chauffeur change de statut
                </p>
              </div>
              <Switch 
                checked={notifications.driverStatus}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, driverStatus: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Paiements reçus</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications pour les paiements reçus
                </p>
              </div>
              <Switch 
                checked={notifications.paymentReceived}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, paymentReceived: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertes système</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications importantes du système
                </p>
              </div>
              <Switch 
                checked={notifications.systemAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, systemAlerts: checked }))
                }
              />
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              {`Paramètres de sécurité et d'accès`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Authentification à deux facteurs</Label>
                <p className="text-sm text-muted-foreground">
                  Sécurité supplémentaire pour votre compte
                </p>
              </div>
              <Switch />
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Mettre à jour le mot de passe
            </Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Paiements
            </CardTitle>
            <CardDescription>
              Configuration des méthodes de paiement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Méthodes de paiement acceptées</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Carte bancaire</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Espèces</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label>PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label>Apple Pay</Label>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="commission">Commission plateforme (%)</Label>
              <Input id="commission" type="number" step="0.1" defaultValue="8.5" />
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </CardContent>
        </Card>

        {/* Zone Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Zones de service
            </CardTitle>
            <CardDescription>
              Configurez vos zones de couverture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="main-city">Ville principale</Label>
              <Input id="main-city" defaultValue="Paris" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-radius">Rayon de service (km)</Label>
              <Input id="service-radius" type="number" defaultValue="25" />
            </div>
            <div className="space-y-2">
              <Label>Zones spéciales</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Aéroports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Gares</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label>Zones rurales</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label>Service de nuit</Label>
                </div>
              </div>
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}