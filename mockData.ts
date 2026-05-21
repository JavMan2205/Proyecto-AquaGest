// Mock data for AquaGest system

export interface Vivienda {
  id: string;
  numero: string;
  direccion?: string;
  sector: string;
  residente: string;
  telefono: string;
  integrantesHogar?: number;
  estadoPago: 'al-dia' | 'pendiente' | 'moroso';
  ultimoPago?: string;
  mesesAdeudados?: number;
}

export interface Residente {
  id: string;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  tipoResidencia: 'propietario' | 'inquilino';
  telefonoPropietario?: string;
  fechaRegistro: string;
}

export interface Pago {
  id: string;
  viviendaId: string;
  monto: number;
  fecha: string;
  mes: string;
  estado: 'pagado' | 'pendiente';
}

export interface Incidencia {
  id: string;
  tipo: 'fuga' | 'daño' | 'mantenimiento' | 'otro';
  descripcion: string;
  ubicacion: string;
  reportadoPor: string;
  fecha: string;
  estado: 'pendiente' | 'en-proceso' | 'resuelta';
  prioridad: 'baja' | 'media' | 'alta';
  foto?: string;
}

export interface ReglaDistribucion {
  id: string;
  sector: string;
  nivelMinimo: number;
  horarioInicio: string;
  horarioFin: string;
  dias: string[];
}

export interface Turno {
  id: string;
  sector: string;
  fecha: string;
  horarioInicio: string;
  horarioFin: string;
  operador: string;
  estado: 'programado' | 'en-curso' | 'completado' | 'cancelado';
}

export interface NivelTanque {
  fecha: string;
  nivel: number;
  registradoPor: string;
}

// Mock Viviendas
export const mockViviendas: Vivienda[] = [
  {
    id: 'VIV-001',
    numero: 'A-101',
    sector: 'Sector A',
    residente: 'Carlos Ramírez',
    telefono: '555-0003',
    estadoPago: 'al-dia',
    ultimoPago: '2026-04-01',
  },
  {
    id: 'VIV-002',
    numero: 'A-102',
    sector: 'Sector A',
    residente: 'Ana López',
    telefono: '555-0004',
    estadoPago: 'pendiente',
    ultimoPago: '2026-03-01',
    mesesAdeudados: 1,
  },
  {
    id: 'VIV-003',
    numero: 'B-201',
    sector: 'Sector B',
    residente: 'Pedro Martínez',
    telefono: '555-0005',
    estadoPago: 'moroso',
    ultimoPago: '2026-02-01',
    mesesAdeudados: 2,
  },
  {
    id: 'VIV-004',
    numero: 'B-202',
    sector: 'Sector B',
    residente: 'Laura Sánchez',
    telefono: '555-0006',
    estadoPago: 'al-dia',
    ultimoPago: '2026-04-01',
  },
  {
    id: 'VIV-005',
    numero: 'C-301',
    sector: 'Sector C',
    residente: 'Roberto García',
    telefono: '555-0007',
    estadoPago: 'al-dia',
    ultimoPago: '2026-04-01',
  },
  {
    id: 'VIV-006',
    numero: 'C-302',
    sector: 'Sector C',
    residente: 'Isabel Torres',
    telefono: '555-0008',
    estadoPago: 'pendiente',
    ultimoPago: '2026-03-01',
    mesesAdeudados: 1,
  },
];

// Mock Pagos
export const mockPagos: Pago[] = [
  {
    id: 'PAG-001',
    viviendaId: 'VIV-001',
    monto: 25.00,
    fecha: '2026-04-01',
    mes: 'Abril 2026',
    estado: 'pagado',
  },
  {
    id: 'PAG-002',
    viviendaId: 'VIV-004',
    monto: 25.00,
    fecha: '2026-04-05',
    mes: 'Abril 2026',
    estado: 'pagado',
  },
  {
    id: 'PAG-003',
    viviendaId: 'VIV-005',
    monto: 25.00,
    fecha: '2026-04-03',
    mes: 'Abril 2026',
    estado: 'pagado',
  },
];

// Mock Incidencias
export const mockIncidencias: Incidencia[] = [
  {
    id: 'INC-001',
    tipo: 'fuga',
    descripcion: 'Fuga de agua en tubería principal cerca del tanque',
    ubicacion: 'Entrada principal, cerca del tanque',
    reportadoPor: 'Carlos Ramírez',
    fecha: '2026-04-15',
    estado: 'pendiente',
    prioridad: 'alta',
  },
  {
    id: 'INC-002',
    tipo: 'mantenimiento',
    descripcion: 'Revisión de válvulas del sector B',
    ubicacion: 'Sector B - Válvula principal',
    reportadoPor: 'María González',
    fecha: '2026-04-14',
    estado: 'en-proceso',
    prioridad: 'media',
  },
  {
    id: 'INC-003',
    tipo: 'daño',
    descripcion: 'Medidor de agua descalibrado',
    ubicacion: 'Vivienda A-102',
    reportadoPor: 'Ana López',
    fecha: '2026-04-10',
    estado: 'resuelta',
    prioridad: 'baja',
  },
];

// Mock Reglas de Distribución
export const mockReglasDistribucion: ReglaDistribucion[] = [
  {
    id: 'REG-001',
    sector: 'Sector A',
    nivelMinimo: 30,
    horarioInicio: '06:00',
    horarioFin: '10:00',
    dias: ['Lunes', 'Miércoles', 'Viernes'],
  },
  {
    id: 'REG-002',
    sector: 'Sector B',
    nivelMinimo: 30,
    horarioInicio: '10:00',
    horarioFin: '14:00',
    dias: ['Lunes', 'Miércoles', 'Viernes'],
  },
  {
    id: 'REG-003',
    sector: 'Sector C',
    nivelMinimo: 30,
    horarioInicio: '14:00',
    horarioFin: '18:00',
    dias: ['Martes', 'Jueves', 'Sábado'],
  },
];

// Mock Turnos
export const mockTurnos: Turno[] = [
  {
    id: 'TUR-001',
    sector: 'Sector A',
    fecha: '2026-04-17',
    horarioInicio: '06:00',
    horarioFin: '10:00',
    operador: 'María González',
    estado: 'programado',
  },
  {
    id: 'TUR-002',
    sector: 'Sector B',
    fecha: '2026-04-17',
    horarioInicio: '10:00',
    horarioFin: '14:00',
    operador: 'María González',
    estado: 'programado',
  },
  {
    id: 'TUR-003',
    sector: 'Sector A',
    fecha: '2026-04-16',
    horarioInicio: '06:00',
    horarioFin: '10:00',
    operador: 'María González',
    estado: 'completado',
  },
];

// Mock Nivel Tanque (histórico)
export const mockNivelTanque: NivelTanque[] = [
  { fecha: '2026-04-11', nivel: 85, registradoPor: 'María González' },
  { fecha: '2026-04-12', nivel: 72, registradoPor: 'María González' },
  { fecha: '2026-04-13', nivel: 58, registradoPor: 'María González' },
  { fecha: '2026-04-14', nivel: 45, registradoPor: 'María González' },
  { fecha: '2026-04-15', nivel: 68, registradoPor: 'María González' },
  { fecha: '2026-04-16', nivel: 75, registradoPor: 'María González' },
  { fecha: '2026-04-17', nivel: 62, registradoPor: 'María González' },
];

// Mock Residentes
export const mockResidentes: Residente[] = [
  {
    id: 'RES-001',
    nombreCompleto: 'Carlos Ramírez',
    telefono: '555-0003',
    direccion: 'A-101',
    tipoResidencia: 'propietario',
    fechaRegistro: '2026-01-15',
  },
  {
    id: 'RES-002',
    nombreCompleto: 'Ana López',
    telefono: '555-0004',
    direccion: 'A-102',
    tipoResidencia: 'inquilino',
    telefonoPropietario: '555-9001',
    fechaRegistro: '2026-02-20',
  },
  {
    id: 'RES-003',
    nombreCompleto: 'Pedro Martínez',
    telefono: '555-0005',
    direccion: 'B-201',
    tipoResidencia: 'propietario',
    fechaRegistro: '2026-01-10',
  },
];

// Current water tank level
export let currentTankLevel = 62;

export const updateTankLevel = (newLevel: number) => {
  currentTankLevel = newLevel;
};
