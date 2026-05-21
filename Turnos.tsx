import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Clock, Play, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { mockTurnos, mockReglasDistribucion, currentTankLevel, type Turno } from '../data/mockData';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export const Turnos: React.FC = () => {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState<Turno[]>(mockTurnos);

  const handleIniciarTurno = (turnoId: string) => {
    const turno = turnos.find((t) => t.id === turnoId);
    if (!turno) return;

    // Find the rule for this sector
    const regla = mockReglasDistribucion.find((r) => r.sector === turno.sector);
    if (!regla) return;

    // Check if tank level is sufficient
    if (currentTankLevel < regla.nivelMinimo) {
      toast.error('No se puede iniciar el turno', {
        description: `Nivel del tanque insuficiente. Se requiere ${regla.nivelMinimo}%, actual: ${currentTankLevel}%`,
        icon: <XCircle className="w-4 h-4" />,
      });
      return;
    }

    // Update turn status
    const updatedTurnos = turnos.map((t) =>
      t.id === turnoId ? { ...t, estado: 'en-curso' as const } : t
    );
    setTurnos(updatedTurnos);

    toast.success('Turno iniciado', {
      description: `${turno.sector} - ${turno.horarioInicio} a ${turno.horarioFin}`,
      icon: <Play className="w-4 h-4" />,
    });
  };

  const handleCompletarTurno = (turnoId: string) => {
    const turno = turnos.find((t) => t.id === turnoId);
    if (!turno) return;

    const updatedTurnos = turnos.map((t) =>
      t.id === turnoId ? { ...t, estado: 'completado' as const } : t
    );
    setTurnos(updatedTurnos);

    toast.success('Turno completado', {
      description: `${turno.sector} - Distribución finalizada`,
      icon: <CheckCircle className="w-4 h-4" />,
    });
  };

  const turnosHoy = turnos.filter((t) => t.fecha === '2026-04-17');
  const turnosPasados = turnos.filter((t) => t.fecha !== '2026-04-17');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-sky-800 mb-2">Gestión de Turnos</h2>
        <p className="text-muted-foreground">
          Administra los turnos de distribución de agua
        </p>
      </div>

      {/* Tank Level Alert */}
      {currentTankLevel < 30 && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            ⚠️ ALERTA: Nivel del tanque en {currentTankLevel}%. Los turnos no pueden
            iniciarse hasta alcanzar el nivel mínimo de 30%.
          </AlertDescription>
        </Alert>
      )}

      {/* Today's Turns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            Turnos de Hoy - Viernes, 17 de Abril 2026
          </CardTitle>
          <CardDescription>{turnosHoy.length} turnos programados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {turnosHoy.map((turno) => {
              const regla = mockReglasDistribucion.find((r) => r.sector === turno.sector);
              const canStart = currentTankLevel >= (regla?.nivelMinimo || 30);

              return (
                <div
                  key={turno.id}
                  className={`p-4 border rounded-lg ${
                    turno.estado === 'completado'
                      ? 'border-green-200 bg-green-50'
                      : turno.estado === 'en-curso'
                      ? 'border-sky-200 bg-sky-50'
                      : canStart
                      ? 'border-gray-200'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{turno.sector}</h4>
                        <Badge
                          variant={
                            turno.estado === 'completado'
                              ? 'default'
                              : turno.estado === 'en-curso'
                              ? 'secondary'
                              : 'outline'
                          }
                          className={
                            turno.estado === 'completado'
                              ? 'bg-green-500 hover:bg-green-600'
                              : turno.estado === 'en-curso'
                              ? 'bg-sky-600 hover:bg-sky-700 text-white'
                              : ''
                          }
                        >
                          {turno.estado === 'completado'
                            ? 'Completado'
                            : turno.estado === 'en-curso'
                            ? 'En Curso'
                            : turno.estado === 'cancelado'
                            ? 'Cancelado'
                            : 'Programado'}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {turno.horarioInicio} - {turno.horarioFin}
                        </div>
                        <p>Operador: {turno.operador}</p>
                        {regla && (
                          <p>
                            Nivel mínimo requerido: {regla.nivelMinimo}% (Actual:{' '}
                            {currentTankLevel}%)
                          </p>
                        )}
                      </div>

                      {!canStart && turno.estado === 'programado' && (
                        <div className="mt-2">
                          <Alert className="border-red-300 bg-red-100">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800 text-sm">
                              No se puede iniciar: nivel del tanque insuficiente
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {turno.estado === 'programado' && user?.role === 'operador' && (
                        <Button
                          onClick={() => handleIniciarTurno(turno.id)}
                          disabled={!canStart}
                          className="bg-sky-600 hover:bg-sky-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Iniciar
                        </Button>
                      )}

                      {turno.estado === 'en-curso' && user?.role === 'operador' && (
                        <Button
                          onClick={() => handleCompletarTurno(turno.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Past Turns */}
      {turnosPasados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Turnos Anteriores</CardTitle>
            <CardDescription>Historial de turnos completados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {turnosPasados.map((turno) => (
                <div
                  key={turno.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{turno.sector}</h4>
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Completado
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {turno.fecha} • {turno.horarioInicio} - {turno.horarioFin}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="border-sky-200 bg-sky-50">
        <CardHeader>
          <CardTitle className="text-sky-800">Información de Turnos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-sky-700">
          <p>
            • <strong>Inicio de turno:</strong> Solo puede iniciarse si el nivel del
            tanque supera el mínimo configurado para el sector.
          </p>
          <p>
            • <strong>Bloqueo automático:</strong> Los turnos se bloquean automáticamente
            si el nivel es insuficiente.
          </p>
          <p>
            • <strong>Registro:</strong> Al completar un turno, se registra
            automáticamente en el sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
