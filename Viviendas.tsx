import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Building2, Phone, MapPin, Users, CheckCircle2, XCircle, AlertTriangle, Home, UserPlus, UserCheck } from 'lucide-react';
import { mockViviendas, mockResidentes, type Vivienda, type Residente } from '../data/mockData';
import { toast } from 'sonner';

type DialogState =
  | { type: 'none' }
  | { type: 'form' }
  | { type: 'confirmation'; data: Omit<Vivienda, 'id' | 'estadoPago'> }
  | { type: 'approval'; data: Omit<Vivienda, 'id' | 'estadoPago'> }
  | { type: 'exists'; data: Omit<Vivienda, 'id' | 'estadoPago'> }
  | { type: 'success'; data: Vivienda }
  | { type: 'rejected'; data: Omit<Vivienda, 'id' | 'estadoPago'> };

export const Viviendas: React.FC = () => {
  const [viviendas, setViviendas] = useState<Vivienda[]>(mockViviendas);
  const [residentes, setResidentes] = useState<Residente[]>(mockResidentes);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResidente, setSearchResidente] = useState('');
  const [dialogState, setDialogState] = useState<DialogState>({ type: 'none' });
  const [isResidenteDialogOpen, setIsResidenteDialogOpen] = useState(false);

  const filteredViviendas = viviendas.filter(
    (v) =>
      v.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.residente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResidentes = residentes.filter(
    (r) =>
      r.nombreCompleto.toLowerCase().includes(searchResidente.toLowerCase()) ||
      r.telefono.includes(searchResidente) ||
      r.direccion.toLowerCase().includes(searchResidente.toLowerCase())
  );

  const handleFormSubmit = (data: Omit<Vivienda, 'id' | 'estadoPago'>) => {
    setDialogState({ type: 'confirmation', data });
  };

  const handleConfirmData = () => {
    if (dialogState.type === 'confirmation') {
      const existingVivienda = viviendas.find(
        v => v.residente.toLowerCase() === dialogState.data.residente.toLowerCase() ||
             v.numero.toLowerCase() === dialogState.data.numero.toLowerCase()
      );

      if (existingVivienda) {
        setDialogState({ type: 'exists', data: dialogState.data });
      } else {
        setDialogState({ type: 'approval', data: dialogState.data });
      }
    }
  };

  const handleApprove = () => {
    if (dialogState.type === 'approval' || dialogState.type === 'exists') {
      const newVivienda: Vivienda = {
        ...dialogState.data,
        id: `VIV-${String(viviendas.length + 1).padStart(3, '0')}`,
        estadoPago: 'pendiente',
      };
      setViviendas([...viviendas, newVivienda]);
      setDialogState({ type: 'success', data: newVivienda });
    }
  };

  const handleReject = () => {
    if (dialogState.type === 'approval') {
      setDialogState({ type: 'rejected', data: dialogState.data });
    }
  };

  const handleCloseAll = () => {
    setDialogState({ type: 'none' });
  };

  const handleAddResidente = (newResidente: Omit<Residente, 'id' | 'fechaRegistro'>) => {
    const residente: Residente = {
      ...newResidente,
      id: `RES-${String(residentes.length + 1).padStart(3, '0')}`,
      fechaRegistro: new Date().toISOString().split('T')[0],
    };
    setResidentes([...residentes, residente]);
    setIsResidenteDialogOpen(false);
    toast.success('Residente registrado exitosamente', {
      description: `${residente.nombreCompleto} - ${residente.tipoResidencia}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-sky-800 mb-2">Gestión de Viviendas y Residentes</h2>
        <p className="text-muted-foreground">
          Administra las viviendas y residentes del sistema
        </p>
      </div>

      <Tabs defaultValue="viviendas" className="w-full">
        <TabsList>
          <TabsTrigger value="viviendas" className="gap-2">
            <Building2 className="w-4 h-4" />
            Viviendas
          </TabsTrigger>
          <TabsTrigger value="residentes" className="gap-2">
            <Users className="w-4 h-4" />
            Residentes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viviendas" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium text-sky-800">Gestión de Viviendas</h3>
              <p className="text-sm text-muted-foreground">
                Registra y administra las viviendas del sistema
              </p>
            </div>

            <Button
              onClick={() => setDialogState({ type: 'form' })}
              className="bg-sky-600 hover:bg-sky-700 h-12"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Vivienda
            </Button>
          </div>

      {/* Form Dialog */}
      <Dialog open={dialogState.type === 'form'} onOpenChange={(open) => !open && setDialogState({ type: 'none' })}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Vivienda</DialogTitle>
            <DialogDescription>
              Completa todos los datos del encargado del hogar y la vivienda
            </DialogDescription>
          </DialogHeader>
          <AddViviendaForm onSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogState.type === 'confirmation'}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Verificar Datos
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Por favor verifica que todos los datos ingresados sean correctos:</p>
              {dialogState.type === 'confirmation' && (
                <div className="bg-sky-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-sky-900">Encargado:</span>
                    <span className="text-sky-700">{dialogState.data.residente}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sky-900">Dirección:</span>
                    <span className="text-sky-700">{dialogState.data.direccion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sky-900">Número:</span>
                    <span className="text-sky-700">{dialogState.data.numero}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sky-900">Sector:</span>
                    <span className="text-sky-700">{dialogState.data.sector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sky-900">Teléfono:</span>
                    <span className="text-sky-700">{dialogState.data.telefono}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sky-900">Integrantes:</span>
                    <span className="text-sky-700">{dialogState.data.integrantesHogar} personas</span>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground">¿Los datos son correctos?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDialogState({ type: 'form' })}>
              Corregir Datos
            </Button>
            <Button onClick={handleConfirmData} className="bg-sky-600 hover:bg-sky-700">
              Sí, son correctos
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Existing Record Dialog */}
      <AlertDialog open={dialogState.type === 'exists'}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Registro Existente
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p className="text-amber-700 font-medium">
                Ya existe un registro similar en el sistema.
              </p>
              <p>
                Se ha detectado que el nombre del encargado o el número de vivienda ya están registrados.
              </p>
              <p className="text-sm">
                ¿Desea crear el registro de todas formas?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleCloseAll}>
              Cancelar
            </Button>
            <Button onClick={handleApprove} className="bg-sky-600 hover:bg-sky-700">
              Crear de Todas Formas
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approval Dialog */}
      <AlertDialog open={dialogState.type === 'approval'}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-600" />
              Aprobar Registro de Vivienda
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Los datos han sido verificados correctamente.</p>
              <p className="text-sm font-medium text-sky-900">
                ¿Desea aprobar el registro de esta nueva vivienda?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleReject} className="border-red-300 text-red-700 hover:bg-red-50">
              Rechazar
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aprobar Registro
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={dialogState.type === 'success'}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-6 h-6" />
              Registro Exitoso
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p className="text-green-700 font-medium">
                La vivienda ha sido registrada exitosamente en el sistema.
              </p>
              {dialogState.type === 'success' && (
                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">{dialogState.data.numero}</span>
                  </div>
                  <p className="text-sm text-green-700">
                    ID: {dialogState.data.id}
                  </p>
                  <p className="text-sm text-green-700">
                    Encargado: {dialogState.data.residente}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleCloseAll} className="bg-green-600 hover:bg-green-700">
              Aceptar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rejected Dialog */}
      <AlertDialog open={dialogState.type === 'rejected'}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="w-6 h-6" />
              Registro Denegado
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-red-700 font-medium">
                El registro de la vivienda ha sido denegado.
              </p>
              <div className="bg-red-50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-red-900">
                  Para conocer el motivo del rechazo, por favor comuníquese con el comité comunitario:
                </p>
                <div className="flex items-center gap-3 bg-white p-3 rounded border border-red-200">
                  <Phone className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono de contacto</p>
                    <p className="text-lg font-bold text-red-700">555-COMITE</p>
                    <p className="text-sm text-muted-foreground">(555-266483)</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Horario de atención: Lunes a Viernes, 8:00 AM - 5:00 PM
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleCloseAll} variant="outline">
              Cerrar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>Viviendas Registradas</CardTitle>
          <CardDescription>
            Total: {viviendas.length} viviendas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, residente o sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Encargado</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Integrantes</TableHead>
                  <TableHead>Estado de Pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredViviendas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No se encontraron viviendas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredViviendas.map((vivienda) => (
                    <TableRow key={vivienda.id}>
                      <TableCell className="font-mono text-sm">{vivienda.id}</TableCell>
                      <TableCell className="font-medium">{vivienda.numero}</TableCell>
                      <TableCell>{vivienda.sector}</TableCell>
                      <TableCell>{vivienda.residente}</TableCell>
                      <TableCell>{vivienda.telefono}</TableCell>
                      <TableCell>
                        {vivienda.integrantesHogar ? (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            {vivienda.integrantesHogar}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            vivienda.estadoPago === 'al-dia'
                              ? 'default'
                              : vivienda.estadoPago === 'moroso'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className={
                            vivienda.estadoPago === 'al-dia'
                              ? 'bg-green-500 hover:bg-green-600'
                              : vivienda.estadoPago === 'pendiente'
                              ? 'bg-amber-500 hover:bg-amber-600'
                              : ''
                          }
                        >
                          {vivienda.estadoPago === 'al-dia'
                            ? 'Al Día'
                            : vivienda.estadoPago === 'moroso'
                            ? `Moroso (${vivienda.mesesAdeudados} meses)`
                            : 'Pendiente'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Al Día</CardTitle>
                <Building2 className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {viviendas.filter((v) => v.estadoPago === 'al-dia').length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <Building2 className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {viviendas.filter((v) => v.estadoPago === 'pendiente').length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Morosos</CardTitle>
                <Building2 className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {viviendas.filter((v) => v.estadoPago === 'moroso').length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="residentes" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium text-sky-800">Registro de Residentes</h3>
              <p className="text-sm text-muted-foreground">
                Registra los datos de propietarios e inquilinos
              </p>
            </div>

            <Dialog open={isResidenteDialogOpen} onOpenChange={setIsResidenteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-600 hover:bg-sky-700 h-12">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Nuevo Residente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Residente</DialogTitle>
                  <DialogDescription>
                    Completa todos los datos del residente
                  </DialogDescription>
                </DialogHeader>
                <AddResidenteForm onSubmit={handleAddResidente} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Residentes Registrados</CardTitle>
              <CardDescription>
                Total: {residentes.length} residentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, teléfono o dirección..."
                    value={searchResidente}
                    onChange={(e) => setSearchResidente(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre Completo</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tel. Propietario</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResidentes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No se encontraron residentes
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredResidentes.map((residente) => (
                        <TableRow key={residente.id}>
                          <TableCell className="font-mono text-sm">{residente.id}</TableCell>
                          <TableCell className="font-medium">{residente.nombreCompleto}</TableCell>
                          <TableCell>{residente.direccion}</TableCell>
                          <TableCell>{residente.telefono}</TableCell>
                          <TableCell>
                            <Badge
                              variant={residente.tipoResidencia === 'propietario' ? 'default' : 'secondary'}
                              className={
                                residente.tipoResidencia === 'propietario'
                                  ? 'bg-blue-500 hover:bg-blue-600'
                                  : 'bg-purple-500 hover:bg-purple-600'
                              }
                            >
                              {residente.tipoResidencia === 'propietario' ? 'Propietario' : 'Inquilino'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {residente.telefonoPropietario || (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(residente.fechaRegistro).toLocaleDateString('es-ES')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Propietarios</CardTitle>
                <UserCheck className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {residentes.filter((r) => r.tipoResidencia === 'propietario').length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inquilinos</CardTitle>
                <Users className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {residentes.filter((r) => r.tipoResidencia === 'inquilino').length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AddViviendaForm: React.FC<{
  onSubmit: (vivienda: Omit<Vivienda, 'id' | 'estadoPago'>) => void;
}> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    residente: '',
    direccion: '',
    numero: '',
    sector: '',
    telefono: '',
    integrantesHogar: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.residente || !formData.direccion || !formData.numero ||
        !formData.sector || !formData.telefono || !formData.integrantesHogar) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const integrantes = parseInt(formData.integrantesHogar);
    if (isNaN(integrantes) || integrantes < 1) {
      toast.error('El número de integrantes debe ser mayor a 0');
      return;
    }

    onSubmit({
      residente: formData.residente,
      direccion: formData.direccion,
      numero: formData.numero,
      sector: formData.sector,
      telefono: formData.telefono,
      integrantesHogar: integrantes,
    });

    setFormData({
      residente: '',
      direccion: '',
      numero: '',
      sector: '',
      telefono: '',
      integrantesHogar: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="residente">Nombre del Encargado del Hogar</Label>
        <Input
          id="residente"
          placeholder="Juan Pérez García"
          value={formData.residente}
          onChange={(e) => setFormData({ ...formData, residente: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="direccion"
            placeholder="Av. Principal #123"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero">Número de Vivienda</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="numero"
              placeholder="A-101"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sector">Sector</Label>
          <Input
            id="sector"
            placeholder="Sector A"
            value={formData.sector}
            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="telefono"
            placeholder="555-0000"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="integrantesHogar">Número de Integrantes del Hogar</Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="integrantesHogar"
            type="number"
            min="1"
            placeholder="4"
            value={formData.integrantesHogar}
            onChange={(e) => setFormData({ ...formData, integrantesHogar: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 h-12">
        Continuar
      </Button>
    </form>
  );
};

const AddResidenteForm: React.FC<{
  onSubmit: (residente: Omit<Residente, 'id' | 'fechaRegistro'>) => void;
}> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    telefono: '',
    direccion: '',
    tipoResidencia: 'propietario' as 'propietario' | 'inquilino',
    telefonoPropietario: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombreCompleto || !formData.telefono || !formData.direccion) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.tipoResidencia === 'inquilino' && !formData.telefonoPropietario) {
      toast.error('Debe ingresar el teléfono del propietario para inquilinos');
      return;
    }

    onSubmit({
      nombreCompleto: formData.nombreCompleto,
      telefono: formData.telefono,
      direccion: formData.direccion,
      tipoResidencia: formData.tipoResidencia,
      telefonoPropietario: formData.tipoResidencia === 'inquilino' ? formData.telefonoPropietario : undefined,
    });

    setFormData({
      nombreCompleto: '',
      telefono: '',
      direccion: '',
      tipoResidencia: 'propietario',
      telefonoPropietario: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombreCompleto">Nombre Completo</Label>
        <Input
          id="nombreCompleto"
          placeholder="Juan Pérez García"
          value={formData.nombreCompleto}
          onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefonoResidente">Número de Teléfono</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="telefonoResidente"
            placeholder="555-0000"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccionResidente">Dirección</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="direccionResidente"
            placeholder="A-101"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipoResidencia">Tipo de Residencia</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipoResidencia"
              value="propietario"
              checked={formData.tipoResidencia === 'propietario'}
              onChange={(e) => setFormData({ ...formData, tipoResidencia: 'propietario', telefonoPropietario: '' })}
              className="w-4 h-4 text-sky-600"
            />
            <span className="text-sm">Propietario</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipoResidencia"
              value="inquilino"
              checked={formData.tipoResidencia === 'inquilino'}
              onChange={(e) => setFormData({ ...formData, tipoResidencia: 'inquilino' })}
              className="w-4 h-4 text-sky-600"
            />
            <span className="text-sm">Inquilino</span>
          </label>
        </div>
      </div>

      {formData.tipoResidencia === 'inquilino' && (
        <div className="space-y-2">
          <Label htmlFor="telefonoPropietario">Teléfono del Propietario</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="telefonoPropietario"
              placeholder="555-0000"
              value={formData.telefonoPropietario}
              onChange={(e) => setFormData({ ...formData, telefonoPropietario: e.target.value })}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Ingrese el número de teléfono del dueño de la vivienda
          </p>
        </div>
      )}

      <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 h-12">
        <UserPlus className="w-4 h-4 mr-2" />
        Registrar Residente
      </Button>
    </form>
  );
};
