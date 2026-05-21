import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'comite' | 'operador' | 'residente';

export interface User {
  id: string;
  nombre: string;
  telefono: string;
  role: UserRole;
  viviendaId?: string;
  estado?: 'activo' | 'pendiente';
}

export interface RegisterData {
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  tipoResidencia: 'propietario' | 'inquilino';
  telefonoPropietario?: string;
}

interface AuthContextType {
  user: User | null;
  login: (telefono: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  isOnline: boolean;
  toggleOnline: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: Array<User & { password: string; direccion?: string }> = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    telefono: '555-0001',
    password: '123456',
    role: 'comite',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'María González',
    telefono: '555-0002',
    password: '123456',
    role: 'operador',
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'Carlos Ramírez',
    telefono: '555-0003',
    password: '123456',
    role: 'residente',
    viviendaId: 'VIV-001',
    estado: 'activo',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('aquagest_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (telefono: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(
      u => u.telefono === telefono && u.password === password
    );

    if (foundUser && foundUser.estado === 'activo') {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('aquagest_user', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aquagest_user');
  };

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; message: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if phone already exists
    const existingUser = mockUsers.find(u => u.telefono === data.telefono);
    if (existingUser) {
      return {
        success: false,
        message: 'Este número de teléfono ya está registrado',
      };
    }

    // In real app, this would create a pending user and send to mockResidentes
    console.log('Nuevo registro de residente:', {
      nombreCompleto: data.nombreCompleto,
      telefono: data.telefono,
      direccion: data.direccion,
      tipoResidencia: data.tipoResidencia,
      telefonoPropietario: data.telefonoPropietario,
    });

    return {
      success: true,
      message: `Registro exitoso. Tu solicitud como ${data.tipoResidencia} está pendiente de aprobación. Contacta al Comité: 555-COMITE (555-266483)`,
    };
  };

  const toggleOnline = () => {
    setIsOnline(!isOnline);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isOnline, toggleOnline }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
