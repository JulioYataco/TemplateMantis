export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
  rolesPermitidos?: string[];  // <-- Nueva propiedad

}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'lecturashumedad',
        title: 'Lecturas de Humedad',
        type: 'item',
        classes: 'nav-item',
        url: '/lecturashumedad',
        icon: 'dashboard',
        breadcrumbs: false,
        rolesPermitidos: ['Jefe Fundo'],
      }
    ]
  },
  //Esto es para que todos los cruds aparescan en el navbar
  {
    id: 'Crud',
    title: 'Crud',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'sedes',
        title: 'Sedes',
        type: 'item',
        url: '/sedes',
        classes: 'nav-item',
        icon: 'profile',
        rolesPermitidos: ['Administrador'],
      },
      {
        id: 'roles',
        title: 'Roles',
        type: 'item',
        url: '/roles',
        classes: 'nav-item',
        icon: 'profile',
        rolesPermitidos: ['Administrador'],
      },
      {
        id: 'vehiculos',
        title: 'Vehiculos',
        type: 'item',
        url: '/vehiculos',
        classes: 'nav-item',
        icon: 'profile',
        rolesPermitidos: ['Administrador'],
      },
    ]
  },
];