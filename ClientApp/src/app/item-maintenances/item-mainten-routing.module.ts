// Angular Core
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Components
import { ItemMaintenCenterComponent } from './item-mainten-center.component';
import { ItemMaintenMasterComponent } from './item-mainten-master/item-mainten-master.component';
import { ItemMaintenScheduleComponent } from './item-mainten-schedule/item-mainten-schedule.component';
import { ItemManitenLinkMailComponent } from './item-maniten-link-mail/item-maniten-link-mail.component';
// Services
import { AuthGuard } from '../core/auth/auth-guard.service';
import { ItemMaintenHistoryComponent } from './item-mainten-history/item-mainten-history.component';
import { ItemMaintenanceListComponent } from './item-maintenance-list/item-maintenance-list.component';
import { ItemMaintenManhourComponent } from './item-mainten-manhour/item-mainten-manhour.component';

const routes: Routes = [{
  path: '',
  component: ItemMaintenCenterComponent,
  children: [
    {
      path: 'item-mainlist',
      component: ItemMaintenanceListComponent,
    },
    {
      path: 'schedule',
      component: ItemMaintenScheduleComponent,
    },
    {
      path: 'schedule/:condition',
      component: ItemMaintenScheduleComponent,
    },
    {
      path: 'actual-info/:itemmaintenanceid',
      component: ItemMaintenMasterComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'link-mail/:condition',
      component: ItemManitenLinkMailComponent,
    },
    {
      path: 'history1',
      component: ItemMaintenHistoryComponent,
    },
    {
      path: 'manhour',
      component: ItemMaintenManhourComponent,
    },
    {
      path: ':condition',
      component: ItemMaintenMasterComponent,
      canActivate: [AuthGuard]
    },
    {
      path: '',
      component: ItemMaintenMasterComponent,
      canActivate: [AuthGuard]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemMaintenRoutingModule { }
