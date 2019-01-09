// angular
import { Component, ViewContainerRef, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
// models
// services
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { RequisitionStock } from "../../inventories/shared/requisition-stock.model";
import { Request } from "@angular/http";

@Component({
  selector: 'app-item-mainten-requisition',
  templateUrl: './item-mainten-requisition.component.html',
  styleUrls: ['./item-mainten-requisition.component.scss']
})
export class ItemMaintenRequisitionComponent implements OnInit,OnChanges {
  constructor(
    private serviceDialogs: DialogsService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder
  ) { }

  // Parameter
  @Input() requisition: RequisitionStock;
  @Output() returnRequisition: EventEmitter<RequisitionStock> = new EventEmitter<RequisitionStock>();
  editValueForm: FormGroup;

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.buildForm();
  }

  // build form
  buildForm(): void {
    // New form
    this.editValueForm = this.fb.group({
      RequisitionStockSpId: [this.requisition.RequisitionStockSpId],
      PaperNo: [this.requisition.PaperNo],
      Remark: [this.requisition.Remark,
        [
          Validators.maxLength(250),
        ]
      ],
      Quantity: [this.requisition.Quantity,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],
      RequisitionDate: [this.requisition.RequisitionDate,
        [
          Validators.required
        ]
      ],
      RequisitionEmp: [this.requisition.RequisitionEmp],
      SparePartId: [this.requisition.SparePartId],
      ItemMaintenanceId: [this.requisition.ItemMaintenanceId],
      MovementStockSpId: [this.requisition.MovementStockSpId],
      // BaseModel
      Creator: [this.requisition.Creator],
      CreateDate: [this.requisition.CreateDate],
      Modifyer: [this.requisition.Modifyer],
      ModifyDate: [this.requisition.ModifyDate],
      // ViewModel
      SparePartName: [this.requisition.SparePartName,
        [
          Validators.required,
        ]
      ],
      RequisitionEmpString: [this.requisition.RequisitionEmpString],
      TotalPrice: [this.requisition.TotalPrice],
      UnitPrice: [this.requisition.UnitPrice]
    });
  }

  // Return event
  onReturnRequisition(Complate: boolean): void {
    if (Complate) {
      if (this.editValueForm) {
        if (this.editValueForm.valid) {
          this.requisition = this.editValueForm.value;
          this.returnRequisition.emit(this.requisition);
        }
      }
    } else {
      this.returnRequisition.emit();
    }
  }

  // open dialog
  openDialog(type?: string): void {
    if (type) {
      if (type === "SparePart") {
        this.serviceDialogs.dialogSelectSparePart(this.viewContainerRef)
          .subscribe(spare => {
            if (spare) {
              this.editValueForm.patchValue({
                SparePartId: spare.SparePartId,
                SparePartName: spare.Name,
                UnitPrice: spare.UnitPrice,
              });
            }
          });
      }
    }
  }
}
