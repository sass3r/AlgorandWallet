import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/member-list', title: 'Miembros',  icon:'face', class: '', },
    { path: '/ministry-list', title: 'Ministerios',  icon: 'dashboard', class: '' },
    { path: '/turn-list', title: 'Turnos',  icon:'loop', class: '', },
    { path: '/meeting-list', title: 'Servicios',  icon:'groups', class: '', },
    { path: '/gift-list', title: 'Ofrendas',  icon:'card_giftcard', class: '', },
    { path: '/gift-card', title: 'Registrar Ofrenda',  icon:'content_paste', class: '', },
    { path: '/tithe-list', title: 'Diezmos',  icon:'payments', class: '', },
    { path: '/expense-list', title: 'Egresos', icon:'request_quote', class: '', },
    { path: '/report', title: 'Reportes', icon:'receipt', class: '', }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  showMenu = true;
  menuItems: any[] = [];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
  verify(routePath: string): boolean {
    let res: boolean = true;
    return res;
  }
}
