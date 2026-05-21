import React from 'react';
import { Droplet, LogOut, Wifi, WifiOff, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, showMenuButton = false }) => {
  const { user, logout, isOnline, toggleOnline } = useAuth();

  return (
    <header className="bg-sky-700 text-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="text-white hover:bg-sky-600 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </Button>
          )}
          <Droplet className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-semibold">AquaGest</h1>
            <p className="text-xs text-sky-200">Sistema de Gestión de Agua</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Network Status Indicator */}
          <button
            onClick={toggleOnline}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              isOnline
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="hidden sm:inline">En línea</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="hidden sm:inline">Modo Offline</span>
              </>
            )}
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-sky-600">
                <div className="text-right hidden sm:block mr-2">
                  <p className="text-sm font-medium">{user?.nombre}</p>
                  <p className="text-xs text-sky-200 capitalize">{user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                  {user?.nombre.charAt(0)}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p>{user?.nombre}</p>
                  <p className="text-xs text-muted-foreground">{user?.telefono}</p>
                  <p className="text-xs text-sky-600 capitalize font-normal">
                    Rol: {user?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
