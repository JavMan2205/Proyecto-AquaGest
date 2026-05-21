import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Building2,
  CreditCard,
  Clock,
  MapPin,
  AlertCircle,
  Banknote,
  Calendar,
  Droplets,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockViviendas, currentTankLevel } from '../data/mockData';

export const MiServicio: React.FC = () => {
  const { user } = useAuth();
  const vivienda = mockViviendas.find((v) => v.id === user?.viviendaId);

  if (!vivienda) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            No se encontró información de vivienda asociada a tu usuario. Contacta al
            Comité: 555-0001
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Determine schedule based on sector
  let horario = { dias: '', horas: '' };
  if (vivienda.sector === 'Sector A') {
    horario = { dias: 'Lunes, Miércoles y Viernes', horas: '6:00 AM - 10:00 AM' };
  } else if (vivienda.sector === 'Sector B') {
    horario = { dias: 'Lunes, Miércoles y Viernes', horas: '10:00 AM - 2:00 PM' };
  } else if (vivienda.sector === 'Sector C') {
    horario = { dias: 'Martes, Jueves y Sábado', horas: '2:00 PM - 6:00 PM' };
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-sky-800 mb-2">Mi Servicio de Agua</h2>
        <p className="text-muted-foreground">
          Información y estado de tu servicio de agua
        </p>
      </div>

      {/* Tank Level Alert */}
      {currentTankLevel < 30 && (
        <Alert className="border-amber-500 bg-amber-50">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 font-medium">
            ⚠️ AVISO: El nivel del tanque está en {currentTankLevel}%. Por favor, usa el
            agua con moderación.
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Alert */}
      {vivienda.estadoPago === 'moroso' && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            ⚠️ IMPORTANTE: Tienes {vivienda.mesesAdeudados} mes(es) de atraso en el pago.
            Por favor regulariza tu situación. Contacto: 555-0001
          </AlertDescription>
        </Alert>
      )}

      {/* Vivienda Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-sky-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-600" />
              Información de Vivienda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Número de Vivienda</p>
              <p className="text-xl font-semibold text-sky-700">{vivienda.numero}</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{vivienda.sector}</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Residente</p>
              <p className="font-medium">{vivienda.residente}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">{vivienda.telefono}</p>
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
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Estado Actual</p>
              <Badge
                variant={vivienda.estadoPago === 'moroso' ? 'destructive' : 'default'}
                className={`text-lg py-1 px-3 ${
                  vivienda.estadoPago === 'al-dia'
                    ? 'bg-green-500 hover:bg-green-600'
                    : vivienda.estadoPago === 'pendiente'
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : ''
                }`}
              >
                {vivienda.estadoPago === 'al-dia'
                  ? '✓ Al Día'
                  : vivienda.estadoPago === 'moroso'
                  ? '⚠ Moroso'
                  : '⚠ Pendiente'}
              </Badge>
            </div>

            {vivienda.ultimoPago && (
              <div>
                <p className="text-sm text-muted-foreground">Último Pago Registrado</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{vivienda.ultimoPago}</p>
                </div>
              </div>
            )}

            {vivienda.mesesAdeudados && vivienda.mesesAdeudados > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Meses Adeudados</p>
                <p className="text-xl font-semibold text-red-600">
                  {vivienda.mesesAdeudados} mes(es)
                </p>
              </div>
            )}

            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Monto Mensual</p>
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-sky-600" />
                <p className="text-xl font-semibold text-sky-700">Q25.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule */}
      <Card className="border-sky-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            Horario de Distribución
          </CardTitle>
          <CardDescription>Tu sector recibe agua en los siguientes días y horarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
              <p className="text-sm text-muted-foreground mb-2">Días de Servicio</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-600" />
                <p className="font-semibold text-sky-700">{horario.dias}</p>
              </div>
            </div>

            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
              <p className="text-sm text-muted-foreground mb-2">Horario</p>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-600" />
                <p className="font-semibold text-sky-700">{horario.horas}</p>
              </div>
            </div>
          </div>

          <Alert className="mt-4 border-sky-200 bg-sky-50">
            <Droplets className="h-5 w-5 text-sky-600" />
            <AlertDescription className="text-sky-800">
              <strong>Nota:</strong> Los horarios pueden variar según el nivel del tanque.
              Nivel actual: {currentTankLevel}%
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Water Tank Info */}
      <Card className="border-sky-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-600" />
            Nivel del Tanque Comunitario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Nivel Actual</span>
              <span className="text-2xl font-bold text-sky-700">{currentTankLevel}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className={`h-6 rounded-full ${
                  currentTankLevel < 20
                    ? 'bg-red-500'
                    : currentTankLevel < 30
                    ? 'bg-amber-500'
                    : 'bg-sky-600'
                }`}
                style={{ width: `${currentTankLevel}%` }}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              {currentTankLevel >= 70 && (
                <p>✓ Nivel óptimo. El servicio funciona con normalidad.</p>
              )}
              {currentTankLevel >= 30 && currentTankLevel < 70 && (
                <p>⚠ Nivel moderado. Usa el agua responsablemente.</p>
              )}
              {currentTankLevel < 30 && (
                <p className="text-amber-700 font-medium">
                  ⚠ Nivel bajo. Se recomienda usar el agua solo para necesidades básicas.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="border-sky-200 bg-sky-50">
        <CardHeader>
          <CardTitle className="text-sky-800">Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-sky-700">
          <p>
            <strong>Comité Comunitario:</strong> 555-0001
          </p>
          <p>
            <strong>Operador del Sistema:</strong> 555-0002
          </p>
          <p>
            <strong>Emergencias:</strong> Reporta fugas o daños en la sección de
            Notificaciones
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 h-12 bg-sky-600 hover:bg-sky-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          Reportar Incidencia
        </Button>
        <Button variant="outline" className="flex-1 h-12 border-sky-600 text-sky-600 hover:bg-sky-50">
          <CreditCard className="w-5 h-5 mr-2" />
          Ver Historial de Pagos
        </Button>
      </div>
    </div>
  );
};
