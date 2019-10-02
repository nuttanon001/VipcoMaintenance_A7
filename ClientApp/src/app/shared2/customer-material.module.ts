import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatAutocompleteModule,MatButtonModule, MatCardModule, MatCheckboxModule,
  MatDatepickerModule, MatDialogModule, MatExpansionModule,
  MatIconModule, MatInputModule, MatPaginatorModule,
  MatProgressBarModule, MatProgressSpinnerModule,
  MatNativeDateModule, MatMenuModule, MatTooltipModule,
  MatTabsModule, MatTableModule, MatSortModule,
  MatStepperModule, MatSliderModule, MatSidenavModule,
  MatSelectModule, MatRadioModule,
  MatToolbarModule, MatListModule,
} from "@angular/material";
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";

// primeng
import {
  SharedModule,
} from "primeng/primeng";
import { TableModule } from 'primeng/table';
// 3rd Party
import { VirtualScrollerModule } from 'primeng/virtualscroller';
// component
import { SearchBox2Component } from "./search-box/search-box.component";
//import { AttachFileComponent } from './attach-file/attach-file.component';
//import { AttachFileViewComponent } from './attach-file-view/attach-file-view.component';
// Moment
import * as moment from 'moment';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    // component
    SearchBox2Component,
    //AttactFileComponent,
    // pipe
    //AttachFileComponent,
    //AttachFileViewComponent,
  ],
  imports: [
    // material
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatSliderModule,
    MatSelectModule,
    MatRadioModule,
    MatToolbarModule,
    MatListModule,
    LayoutModule,
    // angularSplit
    // chart
    //ChartsModule
    //Angular
    CommonModule,
    FormsModule,
    // PrimeNg
    //DataTableModule,
    SharedModule,
    TableModule,
    VirtualScrollerModule,
  ],
  exports: [
    // material
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatSliderModule,
    MatSelectModule,
    MatRadioModule,
    MatToolbarModule,
    MatListModule,
    LayoutModule,
    // angularSplit
    // component
    SearchBox2Component,
    //AttachFileComponent,
    //AttachFileViewComponent,
    //AttactFileComponent,
    //BaseChartComponent,
    // chart
    //ChartsModule
    // PrimeNg
    //DataTableModule,
    SharedModule,
    TableModule,
    VirtualScrollerModule,
  ],
  entryComponents: [
    SearchBox2Component,
    //AttachFileComponent,
    //AttachFileViewComponent,
    //AttactFileComponent,
    //BaseChartComponent,
  ],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    // { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class CustomMaterialModule { }
