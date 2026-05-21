import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { AlertCircle, Plus, MapPin, User, Calendar, Image } from 'lucide-react';
import { mockIncidencias, type Incidencia } from '../data/mockData';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export const Incidencias: React.FC = () => {
  const { user } = useAuth();
  const [incidencias, setIncidencias] = useState<Incidencia[]>(mockIncidencias);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReportarIncidencia = (newIncidencia: Omit<Incidencia, 'id' | 'fecha' | 'estado' | 'reportadoPor'>) => {
    const incidencia: Incidencia = {
      ...newIncidencia,
      id: `INC-${String(incidencias.length + 1).padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
      reportadoPor: user?.nombre || 'Usuario',
    };

    setIncidencias([incidencia, ...incidencias]);
    setIsDialogOpen(false);

    toast.success('Incidencia reportada', {
      description: 'Tu reporte ha sido enviado al equipo técnico',
    });
  };

  const handleCambiarEstado = (id: string, nuevoEstado: Incidencia['estado']) => {
    const updatedIncidencias = incidencias.map((inc) =>
      inc.id === id ? { ...inc, estado: nuevoEstado } : inc
    );
    setIncidencias(updatedIncidencias);

    toast.success('Estado actualizado', {
      description: `La incidencia ahora está: ${nuevoEstado}`,
    });
  };

  const incidenciasPendientes = incidencias.filter((i) => i.estado === 'pendiente');
  const incidenciasEnProceso = incidencias.filter((i) => i.estado === 'en-proceso');
  const incidenciasResueltas = incidencias.filter((i) => i.estado === 'resuelta');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-sky-800 mb-2">
            {user?.role === 'residente' ? 'Reportar Incidencia' : 'Gestión de Incidencias'}
          </h2>
          <p className="text-muted-foreground">
            {user?.role === 'residente'
              ? 'Reporta fugas, daños o problemas del servicio'
              : 'Administra y da seguimiento a las incidencias reportadas'}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-600 hover:bg-sky-700 h-12">
              <Plus className="w-5 h-5 mr-2" />
              Reportar Incidencia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Incidencia</DialogTitle>
              <DialogDescription>
                Completa los detalles del problema que deseas reportar
              </DialogDescription>
            </DialogHeader>
            <ReportarIncidenciaForm onSubmit={handleReportarIncidencia} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics for Comite/Operador */}
      {(user?.role === 'comite' || user?.role === 'operador') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {incidenciasPendientes.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <AlertCircle className="h-5 w-5 text-sky-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-700">
                {incidenciasEnProceso.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resueltas</CardTitle>
              <AlertCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {incidenciasResueltas.length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending Incidents */}
      {incidenciasPendientes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Incidencias Pendientes
            </CardTitle>
            <CardDescription>Requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incidenciasPendientes.map((incidencia) => (
                <IncidenciaCard
                  key={incidencia.id}
                  incidencia={incidencia}
                  onCambiarEstado={handleCambiarEstado}
                  userRole={user?.role || 'residente'}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* In Progress */}
      {incidenciasEnProceso.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-sky-600" />
              En Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incidenciasEnProceso.map((incidencia) => (
                <IncidenciaCard
                  key={incidencia.id}
                  incidencia={incidencia}
                  onCambiarEstado={handleCambiarEstado}
                  userRole={user?.role || 'residente'}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resolved */}
      {incidenciasResueltas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-green-600" />
              Resueltas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incidenciasResueltas.map((incidencia) => (
                <IncidenciaCard
                  key={incidencia.id}
                  incidencia={incidencia}
                  onCambiarEstado={handleCambiarEstado}
                  userRole={user?.role || 'residente'}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const IncidenciaCard: React.FC<{
  incidencia: Incidencia;
  onCambiarEstado: (id: string, estado: Incidencia['estado']) => void;
  userRole: string;
}> = ({ incidencia, onCambiarEstado, userRole }) => {
  return (
    <div
      className={`p-4 border rounded-lg ${
        incidencia.estado === 'pendiente'
          ? 'border-amber-200 bg-amber-50'
          : incidencia.estado === 'en-proceso'
          ? 'border-sky-200 bg-sky-50'
          : 'border-green-200 bg-green-50'
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">{incidencia.descripcion}</h4>
              <Badge
                variant={incidencia.prioridad === 'alta' ? 'destructive' : 'secondary'}
                className={
                  incidencia.prioridad === 'media'
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : incidencia.prioridad === 'baja'
                    ? 'bg-gray-400 hover:bg-gray-500 text-white'
                    : ''
                }
              >
                {incidencia.prioridad}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {incidencia.ubicacion}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Reportado por: {incidencia.reportadoPor}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {incidencia.fecha}
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Tipo: {incidencia.tipo}
              </div>
            </div>
          </div>

          <Badge
            variant={
              incidencia.estado === 'resuelta'
                ? 'default'
                : incidencia.estado === 'en-proceso'
                ? 'secondary'
                : 'outline'
            }
            className={
              incidencia.estado === 'resuelta'
                ? 'bg-green-500 hover:bg-green-600'
                : incidencia.estado === 'en-proceso'
                ? 'bg-sky-600 hover:bg-sky-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }
          >
            {incidencia.estado}
          </Badge>
        </div>

        {(userRole === 'comite' || userRole === 'operador') && incidencia.estado !== 'resuelta' && (
          <div className="flex gap-2 pt-2 border-t">
            {incidencia.estado === 'pendiente' && (
              <Button
                size="sm"
                onClick={() => onCambiarEstado(incidencia.id, 'en-proceso')}
                className="bg-sky-600 hover:bg-sky-700"
              >
                Tomar en Proceso
              </Button>
            )}
            {incidencia.estado === 'en-proceso' && (
              <Button
                size="sm"
                onClick={() => onCambiarEstado(incidencia.id, 'resuelta')}
                className="bg-green-600 hover:bg-green-700"
              >
                Marcar como Resuelta
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ReportarIncidenciaForm: React.FC<{
  onSubmit: (incidencia: Omit<Incidencia, 'id' | 'fecha' | 'estado' | 'reportadoPor'>) => void;
}> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    tipo: 'fuga' as Incidencia['tipo'],
    descripcion: '',
    ubicacion: '',
    prioridad: 'media' as Incidencia['prioridad'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descripcion || !formData.ubicacion) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Incidencia</Label>
        <Select
          value={formData.tipo}
          onValueChange={(value) =>
            setFormData({ ...formData, tipo: value as Incidencia['tipo'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fuga">Fuga de Agua</SelectItem>
            <SelectItem value="daño">Daño en Infraestructura</SelectItem>
            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción del Problema *</Label>
        <Textarea
          id="descripcion"
          placeholder="Describe el problema de manera clara y detallada..."
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ubicacion">Ubicación *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="ubicacion"
            placeholder="Ej: Vivienda A-101, Tanque principal"
            value={formData.ubicacion}
            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prioridad">Prioridad</Label>
        <Select
          value={formData.prioridad}
          onValueChange={(value) =>
            setFormData({ ...formData, prioridad: value as Incidencia['prioridad'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baja">Baja</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="foto">Foto (Opcional)</Label>
        <div className="flex items-center gap-2">
          <Input id="foto" type="file" accept="image/*" className="flex-1" />
          <Image className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          Puedes adjuntar una foto del problema
        </p>
      </div>

      <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">
        Enviar Reporte
      </Button>
    </form>
  );
};
