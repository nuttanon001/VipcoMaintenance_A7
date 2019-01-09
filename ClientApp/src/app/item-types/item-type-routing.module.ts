import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemTypeCenterComponent } from "./item-type-center.component";
import { ItemTypeMasterComponent } from "./item-type-master/item-type-master.component";

const routes: Routes = [
  {
    path: "",
    component: ItemTypeCenterComponent,
    children: [
      {
        path: ":key",
        component: ItemTypeMasterComponent,
      },
      {
        path: "",
        component: ItemTypeMasterComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemTypeRoutingModule { }
