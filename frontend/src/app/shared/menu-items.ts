import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}

const MENUITEMS = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    role: '',
  },
  {
    state: 'category',
    name: 'Manage Category',
    icon: 'category',
    role: 'admin', //hoda
  },
  {
    state: 'product',
    name: 'Manage Product',
    icon: 'inventory_2',
    role: 'admin', //hoda
  },
];
@Injectable()
export class MenuItems {
  gotMenuitem(): Menu[] {
    return MENUITEMS;
  }
}

// @Injectable()
// export class MenuItems {
//   // Get all menu items or filter by user role
//   getMenuItemsForRole(role?: string): Menu[] {
//     return MENUITEMS.filter(item => !item.role || item.role === role);
//   }
// }