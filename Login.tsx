import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Droplet, User, Lock, AlertCircle, CheckCircle, Phone, MapPin, UserPlus, Home } from 'lucide-react';
import { useAuth, type RegisterData } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!telefono || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    const success = await login(telefono, password);
    setLoading(false);

    if (!success) {
      setError('Credenciales inválidas. Verifica tu usuario y contraseña');
    }
  };

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-sky-200">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center">
            <Droplet className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl text-sky-700">AquaGest</CardTitle>
            <CardDescription>Sistema de Gestión de Agua Comunitaria</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Usuario / Teléfono</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="telefono"
                  type="text"
                  placeholder="555-0001"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="pl-10 h-12"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-sky-600 hover:bg-sky-700"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="text-sm text-sky-600 hover:text-sky-700 hover:underline"
              >
                ¿Nuevo residente? Regístrate aquí
              </button>
            </div>

            <div className="bg-sky-50 p-3 rounded-md border border-sky-200 text-sm">
              <p className="font-medium text-sky-900 mb-2">Usuarios de prueba:</p>
              <ul className="space-y-1 text-sky-700">
                <li>• Comité: 555-0001 / 123456</li>
                <li>• Operador: 555-0002 / 123456</li>
                <li>• Residente: 555-0003 / 123456</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const RegisterForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [formData, setFormData] = useState<RegisterData>({
    nombreCompleto: '',
    telefono: '',
    direccion: '',
    tipoResidencia: 'propietario',
    telefonoPropietario: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nombreCompleto || !formData.telefono || !formData.direccion) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.tipoResidencia === 'inquilino' && !formData.telefonoPropietario) {
      setError('Debe ingresar el teléfono del propietario para inquilinos');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setFormData({
        nombreCompleto: '',
        telefono: '',
        direccion: '',
        tipoResidencia: 'propietario',
        telefonoPropietario: '',
      });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-sky-200 max-h-[95vh] overflow-y-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl text-sky-700">Registro de Residente</CardTitle>
            <CardDescription>Completa todos tus datos para solicitar acceso al sistema</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="nombreCompleto"
                  type="text"
                  placeholder="Juan Pérez García"
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  className="h-12 pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono-registro">Número de Teléfono *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="telefono-registro"
                  type="tel"
                  placeholder="555-0000"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="h-12 pl-10"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Este será tu usuario para iniciar sesión
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección / Número de Vivienda *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="direccion"
                  type="text"
                  placeholder="A-101"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="h-12 pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Tipo de Residencia *</Label>
              <div className="flex flex-col gap-3 bg-sky-50 p-4 rounded-lg border border-sky-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoResidencia"
                    value="propietario"
                    checked={formData.tipoResidencia === 'propietario'}
                    onChange={() => setFormData({ ...formData, tipoResidencia: 'propietario', telefonoPropietario: '' })}
                    className="w-5 h-5 text-sky-600"
                    disabled={loading}
                  />
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-sky-600" />
                    <span className="font-medium">Soy Propietario de la Vivienda</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoResidencia"
                    value="inquilino"
                    checked={formData.tipoResidencia === 'inquilino'}
                    onChange={() => setFormData({ ...formData, tipoResidencia: 'inquilino' })}
                    className="w-5 h-5 text-sky-600"
                    disabled={loading}
                  />
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Soy Inquilino</span>
                  </div>
                </label>
              </div>
            </div>

            {formData.tipoResidencia === 'inquilino' && (
              <div className="space-y-2 bg-purple-50 p-4 rounded-lg border border-purple-200">
                <Label htmlFor="telefonoPropietario">Teléfono del Propietario *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="telefonoPropietario"
                    type="tel"
                    placeholder="555-0000"
                    value={formData.telefonoPropietario}
                    onChange={(e) => setFormData({ ...formData, telefonoPropietario: e.target.value })}
                    className="h-12 pl-10 bg-white"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-purple-700">
                  Ingrese el número de teléfono del dueño de la vivienda
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full h-12 bg-sky-600 hover:bg-sky-700"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Enviar Solicitud de Registro'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={onBack}
                disabled={loading}
              >
                Volver al Login
              </Button>
            </div>

            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-sm text-amber-900">
              <p className="font-medium mb-2">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Información Importante:
              </p>
              <ul className="space-y-1 ml-1">
                <li>• Tu solicitud quedará pendiente de aprobación por el Comité Comunitario</li>
                <li>• Recibirás tu contraseña una vez aprobado tu registro</li>
                <li>• Para consultas: <strong className="text-amber-950">555-COMITE (555-266483)</strong></li>
                <li>• Horario: Lunes a Viernes, 8:00 AM - 5:00 PM</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
