import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Settings, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { mockReglasDistribucion, currentTankLevel } from '../data/mockData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';

export const Distribucion: React.FC = () => {
  const [reglas] = useState(mockReglasDistribucion);
  const [suspendido, setSuspendido] = useState(false);

  const handleSuspensionEmergencia = () => {
    setSuspendido(true);
    toast.error('Sistema de distribución suspendido', {
      description: 'Todos los turnos programados han sido cancelados por emergencia',
    });
  };

  const handleReactivar = () => {
    setSuspendido(false);
    toast.success('Sistema reactivado', {
      description: 'El sistema de distribución ha sido reactivado',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-sky-800 mb-2">Configuración de Distribución</h2>
          <p className="text-muted-foreground">
            Gestiona las reglas de distribución de agua por sectores
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="lg"
              className="h-12"
              disabled={suspendido}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Suspensión de Emergencia
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                ¿Suspender distribución de emergencia?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción bloqueará el sistema completo de distribución. Se
                cancelarán todos los turnos programados. Solo usa esta opción en caso
                de emergencia crítica (nivel de tanque menor a 10% o falla técnica
                grave).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSuspensionEmergencia}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmar Suspensión
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Emergency Alert */}
      {currentTankLevel < 10 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            🚨 EMERGENCIA CRÍTICA: Nivel del tanque en {currentTankLevel}%. Se recomienda
            SUSPENSIÓN INMEDIATA del sistema de distribución.
          </AlertDescription>
        </Alert>
      )}

      {suspendido && (
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                🚫 Sistema suspendido por emergencia. Todos los turnos están
                cancelados.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReactivar}
                className="ml-4"
              >
                Reactivar Sistema
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Tank Level Info */}
      <Card className="border-sky-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-600" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nivel actual del tanque</p>
              <p className="text-3xl font-bold text-sky-700">{currentTankLevel}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado del sistema</p>
              <Badge
                variant={suspendido ? 'destructive' : 'default'}
                className={
                  suspendido ? '' : 'bg-green-500 hover:bg-green-600 text-white'
                }
              >
                {suspendido ? 'Suspendido' : 'Operativo'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Reglas de Distribución por Sector</CardTitle>
          <CardDescription>
            Configuración de horarios y nivel mínimo requerido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reglas.map((regla) => (
              <div
                key={regla.id}
                className={`p-4 border rounded-lg ${
                  currentTankLevel < regla.nivelMinimo
                    ? 'border-red-200 bg-red-50'
                    : 'border-sky-200 bg-sky-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sky-800">{regla.sector}</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Horario: {regla.horarioInicio} - {regla.horarioFin}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Días: {regla.dias.join(', ')}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Nivel mínimo requerido:
                        </span>
                        <span className="font-medium text-sky-700">
                          {regla.nivelMinimo}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {currentTankLevel >= regla.nivelMinimo ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        ✓ Disponible
                      </Badge>
                    ) : (
                      <Badge variant="destructive">⚠ Bloqueado</Badge>
                    )}
                  </div>
                </div>

                {currentTankLevel < regla.nivelMinimo && (
                  <Alert className="mt-3 border-red-300 bg-red-100">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Nivel insuficiente:</strong> Se requiere al menos{' '}
                      {regla.nivelMinimo}% para iniciar distribución. Nivel actual:{' '}
                      {currentTankLevel}%.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-sky-200 bg-sky-50">
        <CardHeader>
          <CardTitle className="text-sky-800">
            Información del Sistema de Distribución
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-sky-700">
          <p>
            • <strong>Regla automática:</strong> Los turnos solo pueden iniciarse si el
            nivel del tanque supera el mínimo configurado para cada sector.
          </p>
          <p>
            • <strong>Suspensión de emergencia:</strong> Bloquea todo el sistema cuando
            el nivel es crítico (menor a 10%) o existe una falla técnica grave.
          </p>
          <p>
            • <strong>Notificaciones:</strong> Los residentes reciben avisos
            automáticos cuando su sector tiene cortes programados o el nivel es bajo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
