import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ItemMaintenScheduleComponent } from '../item-mainten-schedule/item-mainten-schedule.component';
import { ItemMaintenService, ItemMaintenCommunicateService } from '../shared/item-mainten.service';
import { RequireMaintenService } from '../../require-maintenances/shared/require-mainten.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { AuthService } from '../../core/auth/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OptionItemMaintenSchedule } from '../shared/option-item-mainten-schedule.model';

@Component({
  selector: 'app-item-maniten-link-mail',
  templateUrl: '../item-mainten-schedule/item-mainten-schedule.component.html',
  styleUrls: ['./item-maniten-link-mail.component.scss']
})
export class ItemManitenLinkMailComponent extends ItemMaintenScheduleComponent {

  constructor(
    service: ItemMaintenService,
    serviceRequire: RequireMaintenService,
    serviceCom: ItemMaintenCommunicateService,
    serviceDialogs: DialogsService,
    serviceAuth: AuthService,
    viewContainerRef: ViewContainerRef,
    fb: FormBuilder,
    router: Router,
    route: ActivatedRoute) {
    super(service,
      serviceRequire,
      serviceCom,
      serviceDialogs,
      serviceAuth,
      viewContainerRef,
      fb,
      router,
      route );
  }

  // angular hook
  ngOnInit(): void {
    this.loadReport = false;
    this.isLinkMail = true;
    this.ReportType = "";

    this.datasource = new Array;
    this.route.paramMap.subscribe((param: ParamMap) => {
      let key: number = Number(param.get("condition") || 0);

      if (key) {
        this.mode = 1;
        let schedule: OptionItemMaintenSchedule = {
          Mode: this.mode,
          RequireMaintenanceId: key
        };
        this.buildForm(schedule);
      }
    }, error => console.error(error));
  }
}
