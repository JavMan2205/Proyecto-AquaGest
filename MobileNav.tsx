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
    label: 'Pagos',
    roles: ['comite'],
  },
  {
    to: '/distribucion',
    icon: Settings,
    label: 'Config',
    roles: ['comite'],
  },
  {
    to: '/nivel-tanque',
    icon: Gauge,
    label: 'Tanque',
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
    label: 'Servicio',
    roles: ['residente'],
  },
  {
    to: '/notificaciones',
    icon: Bell,
    label: 'Avisos',
    roles: ['residente'],
  },
];

export const MobileNav: React.FC = () => {
  const { user } = useAuth();

  const filteredNavItems = navItems
    .filter((item) => item.roles.includes(user?.role as UserRole))
    .slice(0, 5); // Show max 5 items on mobile nav

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                isActive
                  ? 'text-sky-600 bg-sky-50'
                  : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('w-6 h-6', isActive && 'stroke-[2.5]')} />
                <span className="text-xs">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
