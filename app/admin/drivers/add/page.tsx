'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Upload, 
  User, 
  Car,
  Calendar,
  FileText,
  CreditCard,
  Save,
  X
} from 'lucide-react';

export default function AddDriverPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData,] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: 'Paris',
    postalCode: '',
    
    // Documents
    licenseNumber: '',
    licenseExpiry: '',
    taxiLicense: '',
    taxiLicenseExpiry: '',
    
    // Véhicule
    vehicleModel: '',
    vehiclePlate: '',
    vehicleYear: '',
    vehicleColor: '',
    vehicleSeats: '4',
    vehicleType: 'standard',
    
    // Paramètres
    isActive: true,
    canAcceptCash: true,
    canAcceptCard: true,
    workingHours: 'flexible',
    preferredZones: [] as string[],
    
    // Bancaire
    bankName: '',
    iban: '',
    bic: '',
  });

  // const [_, setUploadedFiles] = useState({
  //   profilePhoto: null,
  //   licensePhoto: null,
  //   taxiLicensePhoto: null,
  //   vehiclePhoto: null,
  // });

  // const handleInputChange = (field: string, value: any) => {
  //   setFormData(prev => ({ ...prev, [field]: value }));
  // };

  // const handleFileUpload = (field: string, file: File) => {
  //   setUploadedFiles(prev => ({ ...prev, [field]: file }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation de l'envoi
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/drivers');
    }, 2000);
  };

  const vehicleTypes = [
    { value: 'standard', label: 'Standard', description: 'Véhicule classique' },
    { value: 'premium', label: 'Premium', description: 'Véhicule haut de gamme' },
    { value: 'van', label: 'Van', description: '7-8 places' },
    { value: 'electric', label: 'Électrique', description: 'Véhicule écologique' },
  ];

  const workingHoursOptions = [
    { value: 'flexible', label: 'Flexible' },
    { value: 'day', label: 'Jour (6h-18h)' },
    { value: 'night', label: 'Nuit (18h-6h)' },
    { value: 'weekend', label: 'Week-end uniquement' },
  ];

  const parisZones = [
    'Paris Centre', 'Paris Nord', 'Paris Sud', 'Paris Est', 'Paris Ouest',
    'Aéroports', 'Gares', 'Banlieue proche', 'Banlieue éloignée'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ajouter un Chauffeur</h1>
          <p className="text-muted-foreground">
            Enregistrez un nouveau chauffeur dans le système
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations personnelles */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations Personnelles
              </CardTitle>
              <CardDescription>
                Informations de base du chauffeur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    // onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    // onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    // onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    // onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date de naissance</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  // onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  // onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    // onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    // onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo de profil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Photo de Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Glissez une photo ou cliquez pour parcourir
                </p>
                <Button variant="outline" size="sm">
                  Choisir un fichier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents et licences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents et Licences
            </CardTitle>
            <CardDescription>
              Informations sur les permis et licences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Numéro de permis *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  // onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">Expiration du permis *</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  // onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxiLicense">Licence taxi *</Label>
                <Input
                  id="taxiLicense"
                  value={formData.taxiLicense}
                  // onChange={(e) => handleInputChange('taxiLicense', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxiLicenseExpiry">Expiration licence taxi *</Label>
                <Input
                  id="taxiLicenseExpiry"
                  type="date"
                  value={formData.taxiLicenseExpiry}
                  // onChange={(e) => handleInputChange('taxiLicenseExpiry', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations véhicule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Véhicule
            </CardTitle>
            <CardDescription>
              Informations sur le véhicule du chauffeur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Modèle *</Label>
                <Input
                  id="vehicleModel"
                  placeholder="ex: Mercedes Classe E"
                  value={formData.vehicleModel}
                  // onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehiclePlate">{`Plaque d'immatriculation *`}</Label>
                <Input
                  id="vehiclePlate"
                  placeholder="ex: AB-123-CD"
                  value={formData.vehiclePlate}
                  // onChange={(e) => handleInputChange('vehiclePlate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleYear">Année</Label>
                <Input
                  id="vehicleYear"
                  type="number"
                  min="2000"
                  max="2024"
                  value={formData.vehicleYear}
                  // onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleColor">Couleur</Label>
                <Input
                  id="vehicleColor"
                  value={formData.vehicleColor}
                  // onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleSeats">Nombre de places</Label>
                <Select value={formData.vehicleSeats} 
                // onValueChange={(value) => handleInputChange('vehicleSeats', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 places</SelectItem>
                    <SelectItem value="5">5 places</SelectItem>
                    <SelectItem value="7">7 places</SelectItem>
                    <SelectItem value="8">8 places</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type de véhicule</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vehicleTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.vehicleType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    // onClick={() => handleInputChange('vehicleType', type.value)}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de travail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Paramètres de Travail
            </CardTitle>
            <CardDescription>
              Configuration des préférences de travail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Horaires de travail</Label>
              <Select value={formData.workingHours} 
              // onValueChange={(value) => handleInputChange('workingHours', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {workingHoursOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Zones préférées</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {parisZones.map((zone: string) => (
                  <div
                    key={zone}
                    className={`p-2 text-sm border rounded cursor-pointer transition-colors ${
                      formData.preferredZones.includes(zone)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    // onClick={() => {
                    //   const zones = formData.preferredZones.includes(zone)
                    //     ? formData.preferredZones.filter(z => z !== zone)
                    //     : [...formData.preferredZones, zone];
                    //   handleInputChange('preferredZones', zones);
                    // }}
                  >
                    {zone}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label>Actif</Label>
                  <p className="text-xs text-muted-foreground">Peut recevoir des courses</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  // onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label>Espèces</Label>
                  <p className="text-xs text-muted-foreground">Accepte les paiements cash</p>
                </div>
                <Switch
                  checked={formData.canAcceptCash}
                  // onCheckedChange={(checked) => handleInputChange('canAcceptCash', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label>Carte</Label>
                  <p className="text-xs text-muted-foreground">Accepte les cartes bancaires</p>
                </div>
                <Switch
                  checked={formData.canAcceptCard}
                  // onCheckedChange={(checked) => handleInputChange('canAcceptCard', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations bancaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informations Bancaires
            </CardTitle>
            <CardDescription>
              Pour les virements de commission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Nom de la banque</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                // onChange={(e) => handleInputChange('bankName', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  placeholder="FR76 1234 5678 9012 3456 7890 123"
                  value={formData.iban}
                  // onChange={(e) => handleInputChange('iban', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bic">BIC/SWIFT</Label>
                <Input
                  id="bic"
                  placeholder="BNPAFRPP"
                  value={formData.bic}
                  // onChange={(e) => handleInputChange('bic', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Enregistrement...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer le chauffeur
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}