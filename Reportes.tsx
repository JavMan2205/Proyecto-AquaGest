import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { BarChart3, Download, FileText, Banknote, Droplets, AlertCircle } from 'lucide-react';
import { mockViviendas, mockPagos, mockIncidencias, mockNivelTanque } from '../data/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export const Reportes: React.FC = () => {
  const [tipoReporte, setTipoReporte] = useState('pagos');
  const [periodo, setPeriodo] = useState('mes-actual');

  const handleExportarPDF = () => {
    toast.success('Reporte generado', {
      description: 'Se ha descargado el PDF exitosamente',
      icon: <Download className="w-4 h-4" />,
    });
  };

  const handleExportarExcel = () => {
    toast.success('Reporte exportado', {
      description: 'Se ha descargado el archivo Excel',
      icon: <Download className="w-4 h-4" />,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-sky-800 mb-2">Reportes y Estadísticas</h2>
        <p className="text-muted-foreground">
          Genera y exporta reportes del sistema
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            Configuración del Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select value={tipoReporte} onValueChange={setTipoReporte}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pagos">Pagos y Caja</SelectItem>
                  <SelectItem value="incidencias">Incidencias</SelectItem>
                  <SelectItem value="consumo">Consumo de Agua</SelectItem>
                  <SelectItem value="viviendas">Estado de Viviendas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes-actual">Mes Actual</SelectItem>
                  <SelectItem value="mes-anterior">Mes Anterior</SelectItem>
                  <SelectItem value="trimestre">Último Trimestre</SelectItem>
                  <SelectItem value="anio">Año Actual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Acciones</Label>
              <div className="flex gap-2">
                <Button
                  onClick={handleExportarPDF}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button
                  onClick={handleExportarExcel}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Content */}
      {tipoReporte === 'pagos' && <ReportePagos />}
      {tipoReporte === 'incidencias' && <ReporteIncidencias />}
      {tipoReporte === 'consumo' && <ReporteConsumo />}
      {tipoReporte === 'viviendas' && <ReporteViviendas />}
    </div>
  );
};

const ReportePagos: React.FC = () => {
  const totalRecaudado = mockPagos.reduce((sum, p) => sum + p.monto, 0);
  const viviendasAlDia = mockViviendas.filter((v) => v.estadoPago === 'al-dia').length;
  const viviendasMorosas = mockViviendas.filter((v) => v.estadoPago === 'moroso').length;
  const viviendasPendientes = mockViviendas.filter((v) => v.estadoPago === 'pendiente').length;

  const dataEstadoPagos = [
    { name: 'Al Día', value: viviendasAlDia, color: '#10b981' },
    { name: 'Pendiente', value: viviendasPendientes, color: '#f59e0b' },
    { name: 'Morosos', value: viviendasMorosas, color: '#dc2626' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
            <Banknote className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Q{totalRecaudado.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Abril 2026</p>
          </CardContent>
        </Card>

        <Card className="border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Pago</CardTitle>
            <BarChart3 className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700">
              {((viviendasAlDia / mockViviendas.length) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Viviendas al día</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Cobrar</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              Q{((viviendasMorosas + viviendasPendientes) * 25).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Estimado</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribución de Estados de Pago</CardTitle>
          <CardDescription>Análisis visual del estado de pagos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataEstadoPagos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dataEstadoPagos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const ReporteIncidencias: React.FC = () => {
  const incidenciasPorTipo = mockIncidencias.reduce((acc, inc) => {
    acc[inc.tipo] = (acc[inc.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dataIncidencias = Object.entries(incidenciasPorTipo).map(([tipo, cantidad]) => ({
    tipo,
    cantidad,
  }));

  const pendientes = mockIncidencias.filter((i) => i.estado === 'pendiente').length;
  const enProceso = mockIncidencias.filter((i) => i.estado === 'en-proceso').length;
  const resueltas = mockIncidencias.filter((i) => i.estado === 'resuelta').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendientes}</div>
          </CardContent>
        </Card>

        <Card className="border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <AlertCircle className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700">{enProceso}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resueltas</CardTitle>
            <AlertCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resueltas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incidencias por Tipo</CardTitle>
          <CardDescription>Distribución de tipos de incidencias reportadas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataIncidencias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Bar key="incidencias-bar" dataKey="cantidad" fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const ReporteConsumo: React.FC = () => {
  const chartData = mockNivelTanque.map(item => ({
    fecha: item.fecha.split('-').slice(1).join('/'),
    nivel: item.nivel,
  }));

  const promedioNivel = mockNivelTanque.reduce((sum, n) => sum + n.nivel, 0) / mockNivelTanque.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel Promedio</CardTitle>
            <Droplets className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700">{promedioNivel.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Últimos 7 días</p>
          </CardContent>
        </Card>

        <Card className="border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lecturas Registradas</CardTitle>
            <BarChart3 className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700">{mockNivelTanque.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Última semana</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolución del Nivel del Tanque</CardTitle>
          <CardDescription>Histórico de los últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="nivel" fill="#0284c7" name="Nivel (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const ReporteViviendas: React.FC = () => {
  const viviendasPorSector = mockViviendas.reduce((acc, v) => {
    acc[v.sector] = (acc[v.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dataSectores = Object.entries(viviendasPorSector).map(([sector, cantidad]) => ({
    sector,
    cantidad,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Viviendas por Sector</CardTitle>
          <CardDescription>Distribución de viviendas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataSectores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sector" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-sm">Al Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockViviendas.filter((v) => v.estadoPago === 'al-dia').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-sm">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {mockViviendas.filter((v) => v.estadoPago === 'pendiente').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-sm">Morosos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockViviendas.filter((v) => v.estadoPago === 'moroso').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};