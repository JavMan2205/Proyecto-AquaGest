import React from 'react';
import { NavLink } from 'react-router';
import {
  Home,
  Building2,
  CreditCard,
  Settings,
  AlertCircle,
  BarChart3,
  Gauge,
  Clock,
  Bell,
  FileText,
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { cn } from './ui/utils';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    icon: Home,
    label: 'Inicio',
    roles: ['comite', 'operador', 'residente'],
  },
  {
    to: '/viviendas',
    icon: Building2,
    label: 'Viviendas',
    roles: ['comite'],
  },
  {
    to: '/pagos',
    icon: CreditCard,
    label: 'Caja y Pagos',
    roles: ['comite'],
  },
  {
    to: '/distribucion',
    icon: Settings,
    label: 'Distribución',
    roles: ['comite'],
  },
  {
    to: '/nivel-tanque',
    icon: Gauge,
    label: 'Nivel del Tanque',
    roles: ['comite', 'operador'],
  },
  {
    to: '/turnos',
    icon: Clock,
    label: 'Turnos',
    roles: ['comite', 'operador'],
  },
  {
    to: '/incidencias',
    icon: AlertCircle,
    label: 'Incidencias',
    roles: ['comite', 'operador'],
  },
  {
    to: '/reportes',
    icon: BarChart3,
    label: 'Reportes',
    roles: ['comite'],
  },
  {
    to: '/mi-servicio',
    icon: FileText,
    label: 'Mi Servicio',
    roles: ['residente'],
  },
  {
    to: '/notificaciones',
    icon: Bell,
    label: 'Notificaciones',
    roles: ['residente'],
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role as UserRole)
  );

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-sky-800 text-white min-h-screen">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                'hover:bg-sky-700',
                isActive ? 'bg-sky-600 text-white' : 'text-sky-100'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-sky-700">
        <div className="text-xs text-sky-300">
          <p>AquaGest v1.0</p>
          <p>Sistema de Gestión Comunitaria</p>
        </div>
      </div>
    </aside>
  );
};
