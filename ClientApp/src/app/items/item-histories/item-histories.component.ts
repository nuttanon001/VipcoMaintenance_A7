// Angular Core
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
// Serviers
import { ItemService } from '../shared/item.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
// Models
import { Item } from '../shared/item.model';
import { ItemHistoriesOption } from '../shared/item-histories-option.model';
import { ItemHistories } from '../shared/item-histories.model';

@Component({
  selector: 'app-item-histories',
  templateUrl: './item-histories.component.html',
  styleUrls: ['./item-histories.component.scss']
})

export class ItemHistoriesComponent implements OnInit {
  // Constructor
  constructor(
    private service: ItemService,
    private serviceDialog: DialogsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private viewContainerRef: ViewContainerRef,
  ) { }

  //Parameter
  item: Item;
  itemOption: ItemHistoriesOption;
  itemHistories: Array<ItemHistories>;
  itemOptionForm: FormGroup;
  backToSchedule: boolean;
  isLoaded = true;
  //OnInit
  ngOnInit() {
    this.backToSchedule = false;
    this.isLoaded = false;
    // From route
    this.route.paramMap.subscribe((param: ParamMap) => {
      let key: number = Number(param.get("condition") || 0);

      if (key) {
        // can go back to last page
        this.backToSchedule = true;

        this.itemOption = {
          ItemId: 0,
        };
        // ItemName
        this.service.getOneKeyNumber({ ItemId: this.itemOption.ItemId })
          .subscribe(dbItem => {
            if (dbItem) {
              this.itemOption = {
                ItemId: dbItem.ItemId,
                ItemName: `${dbItem.ItemCode}/${dbItem.Name}`,
              }

              setTimeout(() => {
                this.onBulidForm();
              }, 500);
            }
          });
      }
    }, error => console.error(error));
    // If
    this.itemOption = {
      ItemId:0
    };
    this.onBulidForm();
  }

  //Bulid Form
  onBulidForm(): void {
    this.itemOptionForm = this.fb.group({
      ItemId: this.itemOption.ItemId,
      ItemName: this.itemOption.ItemName,
      SDate: this.itemOption.SDate,
      EDate: this.itemOption.EDate
    });

    this.itemOptionForm.valueChanges.subscribe(data => this.onValueChange(data));
  }

  // ValueChange
  onValueChange(data?: any): void {
    if (!this.itemOptionForm) { return; }
    //Change value to paramater
    this.itemOption = this.itemOptionForm.value;
    this.onLoadData(this.itemOption);
  }

  // Load Data
  onLoadData(data?: ItemHistoriesOption): void {
    this.isLoaded = true;
    this.service.getItemHistories(data)
      .subscribe(dbData => {
        this.itemHistories = new Array;
        this.itemHistories = dbData.slice();
        this.isLoaded = false;
      });
  }

  // open Dialog
  onOpenDialog(mode?: string): void {
    if (mode.indexOf("Item") !== -1) {
      this.serviceDialog.dialogSelectItem(this.viewContainerRef)
        .subscribe(dialogItem => {
          if (dialogItem) {
            this.itemOptionForm.patchValue({
              ItemId: dialogItem.ItemId,
              ItemName: `${dialogItem.ItemCode}/${dialogItem.Name}`
            });

            this.service.getOneKeyNumber(dialogItem)
              .subscribe(dbitem => {
                this.item = dbitem || undefined;
              });
            //Debug here
            // console.log(JSON.stringify(this.itemOptionForm.value));
          } else {
            this.itemOptionForm.patchValue({
              ItemId: 0,
              ItemName: ""
            });

            this.item = undefined;
          }
        });
    }
  }

  // select Histores
  onSelectHistores(item:{ data: ItemHistories, option: number }): void {
    if (item) {
      this.serviceDialog.dialogSelectItemMaintenance(item.data.ItemMaintenanceId, this.viewContainerRef)
        .subscribe();
    } else {
      this.serviceDialog.error("Warning Message", "This maintenance not plan yet.", this.viewContainerRef);
    }
  }

  onReport(itemOption: ItemHistoriesOption): void {
    if (itemOption) {
      this.isLoaded = true;
      this.service.getXlsx(itemOption).subscribe(data => {
        console.log(data);
        this.isLoaded = false;
      }, (error) => this.isLoaded = false, () => this.isLoaded = false);
    }
  }
}
