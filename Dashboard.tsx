import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Building2,
  CreditCard,
  AlertCircle,
  Gauge,
  TrendingUp,
  Users,
  Droplets,
  Clock,
} from 'lucide-react';
import { mockViviendas, mockIncidencias, currentTankLevel } from '../data/mockData';
import { Alert, AlertDescription } from '../components/ui/alert';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'comite') {
    return <DashboardComite />;
  }

  if (user?.role === 'operador') {
    return <DashboardOperador />;
  }

  if (user?.role === 'residente') {
    return <DashboardResidente />;
  }

  return null;
};

const DashboardComite: React.FC = () => {
  const totalViviendas = mockViviendas.length;
  const viviendasAlDia = mockViviendas.filter((v) => v.estadoPago === 'al-dia').length;
  const viviendasMorosas = mockViviendas.filter((v) => v.estadoPago === 'moroso').length;
  const incidenciasPendientes = mockIncidencias.filter((i) => i.estado === 'pendiente').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-sky-800 mb-2">Panel de Control - Comité</h2>
        <p className="text-muted-foreground">
          Administración total del sistema AquaGest
        </p>
      </div>

      {/* Tank Level Alert */}
      {currentTankLevel < 20 && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            ⚠️ ALERTA CRÍTICA: Nivel del tanque en {currentTankLevel}%. Se recomienda
            suspensión de distribución.
          </AlertDescription>
        </Alert>
      )}

      {currentTankLevel >= 20 && currentTankLevel < 30 && (
        <Alert className="border-amber-500 bg-amber-50">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 font-medium">
            ⚠️ Nivel del tanque en {currentTankLevel}%. Cerca del límite mínimo para
            distribución.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Viviendas</CardTitle>
            <Building2 className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-700">{totalViviendas}</div>
            <p className="text-xs text-muted-foreground mt-1">Viviendas registradas</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos al Día</CardTitle>
            <CreditCard className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{viviendasAlDia}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((viviendasAlDia / totalViviendas) * 100).toFixed(0)}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Morosos</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{viviendasMorosas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              2+ meses sin pagar
            </p>
          </CardContent>
        </Card>

        <Card className="border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel Tanque</CardTitle>
            <Gauge className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-700">{currentTankLevel}%</div>
            <p className="text-xs text-muted-foreground mt-1">Actualizado hoy</p>
          </CardContent>
        </Card>
      </div>

      {/* Incidencias Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Incidencias Pendientes
          </CardTitle>
          <CardDescription>
            Reportes que requieren atención inmediata
          </CardDescription>
        </CardHeader>
        <CardContent>
          {incidenciasPendientes === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay incidencias pendientes
            </p>
          ) : (
            <div className="space-y-3">
              {mockIncidencias
                .filter((i) => i.estado === 'pendiente')
                .map((incidencia) => (
                  <div
                    key={incidencia.id}
                    className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-900">{incidencia.descripcion}</p>
                      <p className="text-sm text-amber-700">
                        {incidencia.ubicacion} • {incidencia.fecha}
                      </p>
                    </div>
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">
                      {incidencia.prioridad}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-sky-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700">
              <Users className="w-5 h-5" />
              Gestión de Viviendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Administrar viviendas y residentes
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow border-sky-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700">
              <CreditCard className="w-5 h-5" />
              Registro de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Registrar y consultar pagos
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow border-sky-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700">
              <TrendingUp className="w-5 h-5" />
              Ver Reportes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Reportes y estadísticas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DashboardOperador: React.FC = () => {
  const incidenciasActivas = mockIncidencias.filter(
    (i) => i.estado === 'pendiente' || i.estado === 'en-proceso'
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-sky-800 mb-2">Panel de Operador</h2>
        <p className="text-muted-foreground">Gestión técnica y operativa del sistema</p>
      </div>

      {/* Tank Level Alert */}
      {currentTankLevel < 30 && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            ⚠️ ALERTA: Nivel del tanque en {currentTankLevel}%. No iniciar turnos hasta
            alcanzar nivel mínimo.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel del Tanque</CardTitle>
            <Droplets className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-700">{currentTankLevel}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentTankLevel >= 30 ? 'Nivel óptimo' : 'Por debajo del mínimo'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidencias Activas</CardTitle>
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{incidenciasActivas}</div>
            <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos Hoy</CardTitle>
            <Clock className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">2</div>
            <p className="text-xs text-muted-foreground mt-1">Turnos programados</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Operator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-sky-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700">
              <Gauge className="w-5 h-5" />
              Registrar Nivel del Tanque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Actualizar porcentaje de agua actual
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow border-sky-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700">
              <Clock className="w-5 h-5" />
              Gestionar Turnos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ver y completar turnos de distribución
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DashboardResidente: React.FC = () => {
  const { user } = useAuth();
  const vivienda = mockViviendas.find((v) => v.id === user?.viviendaId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-sky-800 mb-2">Mi Servicio de Agua</h2>
        <p className="text-muted-foreground">Información de tu vivienda</p>
      </div>

      {vivienda && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-sky-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-600" />
                Mi Vivienda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Número</p>
                <p className="font-medium text-lg">{vivienda.numero}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sector</p>
                <p className="font-medium">{vivienda.sector}</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className={
              vivienda.estadoPago === 'al-dia'
                ? 'border-green-200'
                : vivienda.estadoPago === 'moroso'
                ? 'border-red-200'
                : 'border-amber-200'
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Estado de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <p
                  className={`font-medium text-lg ${
                    vivienda.estadoPago === 'al-dia'
                      ? 'text-green-600'
                      : vivienda.estadoPago === 'moroso'
                      ? 'text-red-600'
                      : 'text-amber-600'
                  }`}
                >
                  {vivienda.estadoPago === 'al-dia'
                    ? '✓ Al Día'
                    : vivienda.estadoPago === 'moroso'
                    ? '⚠ Moroso'
                    : '⚠ Pendiente'}
                </p>
              </div>
              {vivienda.ultimoPago && (
                <div>
                  <p className="text-sm text-muted-foreground">Último pago</p>
                  <p className="font-medium">{vivienda.ultimoPago}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-sky-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            Horario de Distribución
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vivienda?.sector === 'Sector A' && (
            <div className="space-y-2">
              <p className="font-medium">Lunes, Miércoles y Viernes</p>
              <p className="text-muted-foreground">6:00 AM - 10:00 AM</p>
            </div>
          )}
          {vivienda?.sector === 'Sector B' && (
            <div className="space-y-2">
              <p className="font-medium">Lunes, Miércoles y Viernes</p>
              <p className="text-muted-foreground">10:00 AM - 2:00 PM</p>
            </div>
          )}
          {vivienda?.sector === 'Sector C' && (
            <div className="space-y-2">
              <p className="font-medium">Martes, Jueves y Sábado</p>
              <p className="text-muted-foreground">2:00 PM - 6:00 PM</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert className="border-sky-200 bg-sky-50">
        <AlertCircle className="h-5 w-5 text-sky-600" />
        <AlertDescription className="text-sky-800">
          <strong>Recordatorio:</strong> Usa el agua de manera responsable. El nivel
          actual del tanque es {currentTankLevel}%.
        </AlertDescription>
      </Alert>
    </div>
  );
};