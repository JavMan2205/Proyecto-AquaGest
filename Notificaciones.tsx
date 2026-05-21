import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Bell, AlertCircle, Info, CheckCircle, Droplets, Calendar, Trash2 } from 'lucide-react';
import { currentTankLevel } from '../data/mockData';

interface Notificacion {
  id: string;
  tipo: 'alerta' | 'info' | 'exito';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

const mockNotificaciones: Notificacion[] = [
  {
    id: 'NOT-001',
    tipo: 'alerta',
    titulo: 'Nivel de Tanque Bajo',
    mensaje: `El nivel del tanque está en ${currentTankLevel}%. Se recomienda usar el agua con moderación durante los próximos días.`,
    fecha: '2026-04-17 09:00',
    leida: false,
  },
  {
    id: 'NOT-002',
    tipo: 'info',
    titulo: 'Corte Programado - Sector A',
    mensaje: 'Mañana Sábado 18 de Abril no habrá servicio en Sector A por mantenimiento preventivo de 8:00 AM a 12:00 PM.',
    fecha: '2026-04-16 14:30',
    leida: false,
  },
  {
    id: 'NOT-003',
    tipo: 'exito',
    titulo: 'Pago Registrado',
    mensaje: 'Tu pago de Q25.00 correspondiente a Abril 2026 ha sido registrado exitosamente. ¡Gracias!',
    fecha: '2026-04-15 10:15',
    leida: true,
  },
  {
    id: 'NOT-004',
    tipo: 'info',
    titulo: 'Nuevo Horario de Distribución',
    mensaje: 'Se ha actualizado el horario de distribución para el Sector C. Ahora el servicio será de Martes, Jueves y Sábado de 2:00 PM a 6:00 PM.',
    fecha: '2026-04-14 11:00',
    leida: true,
  },
  {
    id: 'NOT-005',
    tipo: 'alerta',
    titulo: 'Recordatorio de Pago',
    mensaje: 'Te recordamos que el pago mensual de Abril vence el día 30. Monto: Q25.00. Puedes pagar en cualquier momento con el Comité.',
    fecha: '2026-04-10 08:00',
    leida: true,
  },
];

export const Notificaciones: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(mockNotificaciones);

  const handleMarcarLeida = (id: string) => {
    setNotificaciones(
      notificaciones.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const handleEliminar = (id: string) => {
    setNotificaciones(notificaciones.filter((n) => n.id !== id));
  };

  const handleMarcarTodasLeidas = () => {
    setNotificaciones(notificaciones.map((n) => ({ ...n, leida: true })));
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-sky-800 mb-2">Notificaciones y Avisos</h2>
          <p className="text-muted-foreground">
            Mantente informado sobre el servicio de agua
          </p>
        </div>

        {noLeidas > 0 && (
          <Button
            onClick={handleMarcarTodasLeidas}
            variant="outline"
            className="border-sky-600 text-sky-600 hover:bg-sky-50"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar Todas como Leídas
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notificaciones</CardTitle>
            <Bell className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700">{notificaciones.length}</div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Leídas</CardTitle>
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{noLeidas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600" />
            Todas las Notificaciones
          </CardTitle>
          <CardDescription>Avisos y actualizaciones del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {notificaciones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    notificacion.leida
                      ? 'bg-gray-50 border-gray-200'
                      : notificacion.tipo === 'alerta'
                      ? 'bg-amber-50 border-amber-200'
                      : notificacion.tipo === 'exito'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-sky-50 border-sky-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {notificacion.tipo === 'alerta' && (
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      )}
                      {notificacion.tipo === 'info' && (
                        <Info className="w-5 h-5 text-sky-600" />
                      )}
                      {notificacion.tipo === 'exito' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {notificacion.titulo}
                        </h4>
                        {!notificacion.leida && (
                          <Badge className="bg-sky-600 hover:bg-sky-700 whitespace-nowrap">
                            Nueva
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 mb-2">{notificacion.mensaje}</p>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {notificacion.fecha}
                        </div>

                        <div className="flex gap-2">
                          {!notificacion.leida && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarcarLeida(notificacion.id)}
                              className="text-sky-600 hover:text-sky-700 hover:bg-sky-100"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Marcar leída
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEliminar(notificacion.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-sky-200 bg-sky-50">
        <CardHeader>
          <CardTitle className="text-sky-800 flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            Tipos de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-sky-700">
          <p>
            • <strong className="text-amber-700">Alertas:</strong> Avisos importantes sobre
            nivel del tanque, cortes de servicio, o situaciones que requieren tu atención.
          </p>
          <p>
            • <strong className="text-sky-700">Información:</strong> Actualizaciones sobre
            horarios, mantenimientos programados, o cambios en el servicio.
          </p>
          <p>
            • <strong className="text-green-700">Confirmaciones:</strong> Notificaciones
            sobre pagos registrados, reportes recibidos, o acciones completadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
