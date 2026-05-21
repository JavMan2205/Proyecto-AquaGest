import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import { Search, Banknote, CreditCard, Clock } from 'lucide-react';
import { mockViviendas, mockPagos, type Vivienda, type Pago } from '../data/mockData';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export const Pagos: React.FC = () => {
  const { isOnline } = useAuth();
  const [viviendas, setViviendas] = useState<Vivienda[]>(mockViviendas);
  const [pagos, setPagos] = useState<Pago[]>(mockPagos);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredViviendas = viviendas.filter(
    (v) =>
      v.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.residente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegistrarPago = (viviendaId: string, monto: number, mes: string) => {
    const fecha = new Date().toISOString().split('T')[0];
    const nuevoPago: Pago = {
      id: `PAG-${String(pagos.length + 1).padStart(3, '0')}`,
      viviendaId,
      monto,
      fecha,
      mes,
      estado: 'pagado',
    };

    // Update payment status
    const updatedViviendas = viviendas.map((v) => {
      if (v.id === viviendaId) {
        return {
          ...v,
          estadoPago: 'al-dia' as const,
          ultimoPago: fecha,
          mesesAdeudados: 0,
        };
      }
      return v;
    });

    setPagos([...pagos, nuevoPago]);
    setViviendas(updatedViviendas);
    setIsDialogOpen(false);

    if (isOnline) {
      toast.success('Pago registrado exitosamente', {
        description: `Q${monto.toFixed(2)} - ${mes}`,
      });
    } else {
      toast.warning('Pago guardado localmente', {
        description: 'Se sincronizará cuando vuelvas a estar en línea',
        icon: <Clock className="w-4 h-4" />,
      });
    }
  };

  const totalRecaudado = pagos.reduce((sum, pago) => sum + pago.monto, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-sky-800 mb-2">Caja y Pagos</h2>
          <p className="text-muted-foreground">Gestiona los pagos de las viviendas</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-600 hover:bg-sky-700 h-12">
              <Banknote className="w-5 h-5 mr-2" />
              Registrar Pago
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Pago</DialogTitle>
              <DialogDescription>
                Selecciona la vivienda y registra el pago recibido
              </DialogDescription>
            </DialogHeader>
            <RegistrarPagoForm
              viviendas={viviendas}
              onSubmit={handleRegistrarPago}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
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
            <p className="text-xs text-muted-foreground mt-1">
              {pagos.length} pagos registrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-sky-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viviendas al Día</CardTitle>
            <CreditCard className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700">
              {viviendas.filter((v) => v.estadoPago === 'al-dia').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              De {viviendas.length} total
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Morosos (2+ meses)</CardTitle>
            <CreditCard className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {viviendas.filter((v) => v.estadoPago === 'moroso').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and List */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Pagos por Vivienda</CardTitle>
          <CardDescription>Busca viviendas para ver su estado de pago</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por número o residente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredViviendas.map((vivienda) => (
              <div
                key={vivienda.id}
                className={`p-4 border rounded-lg ${
                  vivienda.estadoPago === 'al-dia'
                    ? 'border-green-200 bg-green-50'
                    : vivienda.estadoPago === 'moroso'
                    ? 'border-red-200 bg-red-50'
                    : 'border-amber-200 bg-amber-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{vivienda.numero}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          vivienda.estadoPago === 'al-dia'
                            ? 'bg-green-500 text-white'
                            : vivienda.estadoPago === 'moroso'
                            ? 'bg-red-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {vivienda.estadoPago === 'al-dia'
                          ? 'Al Día'
                          : vivienda.estadoPago === 'moroso'
                          ? 'Moroso'
                          : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {vivienda.residente} • {vivienda.sector}
                    </p>
                    {vivienda.ultimoPago && (
                      <p className="text-sm text-muted-foreground">
                        Último pago: {vivienda.ultimoPago}
                      </p>
                    )}
                    {vivienda.mesesAdeudados && vivienda.mesesAdeudados > 0 && (
                      <p className="text-sm font-medium text-red-600">
                        Meses adeudados: {vivienda.mesesAdeudados}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RegistrarPagoForm: React.FC<{
  viviendas: Vivienda[];
  onSubmit: (viviendaId: string, monto: number, mes: string) => void;
}> = ({ viviendas, onSubmit }) => {
  const [viviendaId, setViviendaId] = useState('');
  const [monto, setMonto] = useState('25.00');
  const [mes, setMes] = useState('Abril 2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viviendaId) {
      toast.error('Por favor selecciona una vivienda');
      return;
    }
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }
    onSubmit(viviendaId, montoNum, mes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vivienda">Vivienda</Label>
        <Select value={viviendaId} onValueChange={setViviendaId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una vivienda" />
          </SelectTrigger>
          <SelectContent>
            {viviendas.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.numero} - {v.residente}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="monto">Monto (Q)</Label>
        <Input
          id="monto"
          type="number"
          step="0.01"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="25.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mes">Mes de Pago</Label>
        <Input
          id="mes"
          type="text"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          placeholder="Abril 2026"
        />
      </div>

      <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">
        Registrar Pago
      </Button>
    </form>
  );
};
