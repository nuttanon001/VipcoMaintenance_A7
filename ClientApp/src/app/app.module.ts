import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Components
import { AppComponent } from "./core/app/app.component";
import { NavMenuComponent } from "./core/nav-menu/nav-menu.component";
import { HomeComponent } from "./core/home/home.component";
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
// Modules
import { CustomMaterialModule } from "./shared/customer-material/customer-material.module";
import { CustomMaterialModule as CustomMaterialAlias } from "./shared2/customer-material.module";
import { DialogsModule } from "./dialogs/dialog.module";
import { SharedModule } from "./shared/shared.module";
// Serices
import { ShareService } from "./shared/share.service";
import { AuthService } from "./core/auth/auth.service";
import { AuthGuard } from "./core/auth/auth-guard.service";
import { MessageService } from "./shared/message.service";
import { HttpErrorHandler } from "./shared/http-error-handler.service";

import "hammerjs";
import "popper.js";
import { JwtInterceptorService } from './core/auth/jwt-interceptor.service';
import { ErrorInterceptorService } from './core/auth/error-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    // Angular Core
    HttpModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    // Modules
    SharedModule,
    DialogsModule,
    CustomMaterialModule,
    CustomMaterialAlias,
    // Router
    RouterModule.forRoot([
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomeComponent },
      { path: "login", component: LoginComponent },
      { path: "register/:condition", component: RegisterComponent },
      { path: "register", component: RegisterComponent },
      {
        path: "branch",
        loadChildren: './branchs/branch.module#BranchModule',
        canActivate: [AuthGuard],
      },
      {
        path: "item",
        loadChildren: "./items/item.module#ItemModule",
        canActivate: [AuthGuard],
      },
      {
        path: "item-type",
        loadChildren: './item-types/item-type.module#ItemTypeModule',
        canActivate: [AuthGuard],
      },
      {
        path: "obsolete",
        loadChildren: './obsolete-items/obsolete-item.module#ObsoleteItemModule',
        canActivate: [AuthGuard], 
      },
      {
        path: "work-group",
        loadChildren: "./work-groups/work-group.module#WorkGroupModule",
        canActivate: [AuthGuard],
      },
      {
        path: "work-group-mainten",
        loadChildren: './work-group-maintenances/work-group-mainten.module#WorkGroupMaintenModule',
        canActivate: [AuthGuard],
      },
      {
        path: "type-mainten",
        loadChildren: "./type-maintenances/type-mainten.module#TypeMaintenModule",
        canActivate: [AuthGuard],
      },
      {
        path: "require-mainten",
        loadChildren: "./require-maintenances/require-mainten.module#RequireMaintenModule",
        canActivate: [AuthGuard],
      },
      {
        path: "maintenance",
        loadChildren: "./item-maintenances/item-mainten.module#ItemMaintenModule",
      },
      {
        path: "spare-part",
        loadChildren: "./spare-parts/spare-part.module#SparePartModule",
        canActivate: [AuthGuard],
      },
      {
        path: "inventories",
        loadChildren: "./inventories/inventory.module#InventoriyModule",
        canActivate: [AuthGuard],
      },
      { path: "**", redirectTo: "home" },
    ]),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    AuthGuard,
    AuthService,
    ShareService,
    MessageService,
    HttpErrorHandler,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
