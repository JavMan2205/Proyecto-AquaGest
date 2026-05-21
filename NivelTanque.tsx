import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Gauge, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { mockNivelTanque, currentTankLevel as initialLevel, updateTankLevel } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export const NivelTanque: React.FC = () => {
  const { user, isOnline } = useAuth();
  const [nivel, setNivel] = useState(initialLevel);
  const [inputValue, setInputValue] = useState(String(initialLevel));
  const [saving, setSaving] = useState(false);

  const handleSaveNivel = async () => {
    const nivelNum = parseInt(inputValue);

    if (isNaN(nivelNum) || nivelNum < 0 || nivelNum > 100) {
      toast.error('Valor inválido', {
        description: 'El nivel debe estar entre 0 y 100',
      });
      return;
    }

    setSaving(true);

    // Simulate saving delay
    await new Promise(resolve => setTimeout(resolve, isOnline ? 500 : 1500));

    updateTankLevel(nivelNum);
    setNivel(nivelNum);

    if (isOnline) {
      setSaving(false);
      toast.success('Nivel registrado exitosamente', {
        description: `Nivel actualizado a ${nivelNum}%`,
        icon: <CheckCircle className="w-4 h-4" />,
      });

      // Alert if level is low
      if (nivelNum < 20) {
        setTimeout(() => {
          toast.error('Alerta de nivel crítico', {
            description: `Nivel en ${nivelNum}%. Se ha enviado notificación al Comité.`,
            icon: <AlertCircle className="w-4 h-4" />,
          });
        }, 1000);
      } else if (nivelNum < 30) {
        setTimeout(() => {
          toast.warning('Nivel bajo detectado', {
            description: `Nivel en ${nivelNum}%. Cerca del límite mínimo para distribución.`,
          });
        }, 1000);
      }
    } else {
      // Simulate offline mode with pending sync
      setTimeout(() => {
        setSaving(false);
        toast.warning('Dato guardado localmente', {
          description: 'Se sincronizará cuando vuelvas a estar en línea',
          icon: <Clock className="w-4 h-4" />,
        });
      }, 1500);
    }
  };

  const chartData = mockNivelTanque.map(item => ({
    fecha: item.fecha.split('-').slice(1).join('/'),
    nivel: item.nivel,
  }));

  const trend = mockNivelTanque[mockNivelTanque.length - 1].nivel > mockNivelTanque[mockNivelTanque.length - 2].nivel;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-sky-800 mb-2">Nivel del Tanque</h2>
        <p className="text-muted-foreground">
          Registra y monitorea el nivel de agua del tanque
        </p>
      </div>

      {/* Alerts */}
      {nivel < 10 && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            🚨 NIVEL CRÍTICO: {nivel}%. Suspender distribución inmediatamente.
          </AlertDescription>
        </Alert>
      )}

      {nivel >= 10 && nivel < 20 && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            ⚠️ ALERTA: Nivel en {nivel}%. Por debajo del mínimo operativo.
          </AlertDescription>
        </Alert>
      )}

      {nivel >= 20 && nivel < 30 && (
        <Alert className="border-amber-500 bg-amber-50">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 font-medium">
            ⚠️ PRECAUCIÓN: Nivel en {nivel}%. Cerca del límite mínimo para distribución.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Level Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-sky-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-sky-600" />
              Nivel Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#e0f2fe"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke={nivel < 20 ? '#dc2626' : nivel < 30 ? '#f59e0b' : '#0284c7'}
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(nivel / 100) * 502.4} 502.4`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-sky-700">{nivel}%</span>
                  <span className="text-sm text-muted-foreground">Nivel de agua</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={trend ? 'border-green-200' : 'border-red-200'}>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {trend ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Tendencia
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  Tendencia
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${trend ? 'text-green-600' : 'text-red-600'}`}>
              {trend ? '↗ Subiendo' : '↘ Bajando'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Basado en últimas 7 lecturas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Register New Level */}
      <Card className="border-sky-200">
        <CardHeader>
          <CardTitle>Registrar Nuevo Nivel</CardTitle>
          <CardDescription>
            {user?.role === 'operador'
              ? 'Actualiza el nivel actual del tanque de agua'
              : 'Solo para operadores autorizados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Nivel (%) - Usar control deslizante</Label>
              <Slider
                value={[parseInt(inputValue) || 0]}
                onValueChange={(value) => setInputValue(String(value[0]))}
                max={100}
                step={1}
                className="w-full"
                disabled={saving}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nivel-input">O ingresa el valor manualmente</Label>
              <Input
                id="nivel-input"
                type="number"
                min="0"
                max="100"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ej: 75"
                disabled={saving}
              />
            </div>

            <Button
              onClick={handleSaveNivel}
              className="w-full h-12 bg-sky-600 hover:bg-sky-700"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  {isOnline ? 'Guardando...' : 'Guardando localmente...'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Guardar Nivel
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historical Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Niveles (Últimos 7 días)</CardTitle>
          <CardDescription>Gráfico de evolución del nivel del tanque</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                key="nivel-line"
                type="monotone"
                dataKey="nivel"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ fill: '#0284c7', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-sky-200 bg-sky-50">
        <CardHeader>
          <CardTitle className="text-sky-800">Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-sky-700">
          <p>
            • <strong>Nivel mínimo operativo:</strong> 30% para iniciar distribución de
            agua.
          </p>
          <p>
            • <strong>Nivel de alerta:</strong> 20% - Se notifica al Comité
            automáticamente.
          </p>
          <p>
            • <strong>Nivel crítico:</strong> 10% - Se debe suspender la distribución
            inmediatamente.
          </p>
          <p>
            • <strong>Registro:</strong> Actualiza el nivel al menos una vez al día para
            mantener el sistema preciso.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};