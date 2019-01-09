// angular core
import {
  OnInit, OnDestroy,
  ElementRef, ViewChild, ViewContainerRef
} from "@angular/core";
// rxjs
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// classes
import { BaseModel } from "./base-model.model";
import { ScrollData } from "./scroll-data.model";
import { Scroll } from "./scroll.model";
import { BaseRestService } from "./base-rest.service";
// services
import { DialogsService } from "../dialogs/shared/dialogs.service";
import { AuthService } from "../core/auth/auth.service";

export abstract class BaseMasterComponent<Model extends BaseModel, Service extends BaseRestService<Model>>
  implements OnInit, OnDestroy {
  /*
   * constructor
   */
  constructor(
    protected service: Service,
    protected comService: any,
    protected authService:AuthService,
    protected dialogsService: DialogsService,
    protected viewContainerRef: ViewContainerRef,
  ) { }
  /*
   * Parameter
   */
  displayValue: Model | undefined;
  editValue: any;
  columns: any;
  subscription1: Subscription;
  // boolean event
  _showEdit: boolean;
  canSave: boolean;
  hideleft: boolean;
  onlyCre: boolean;
  scroll: Scroll;

  /*
   * Property
   */
  get DisplayDataNull(): boolean {
    return this.displayValue === undefined;
  }
  get ShowEdit(): boolean {
    if (this._showEdit) {
      return this._showEdit;
    } else {
      return false;
    }
  }
  set ShowEdit(showEdit: boolean) {
    if (showEdit !== this._showEdit) {
      this.hideleft = !showEdit;
      this._showEdit = showEdit;
    }
  }

  /*
   * Methods
   */
  // angular hook
  ngOnInit(): void {
    this.ShowEdit = false;
    this.canSave = false;

    this.subscription1 = this.comService.ToParent$.subscribe(
      (TypeValue: [Model, boolean]) => {
        this.editValue = TypeValue[0];
        this.canSave = TypeValue[1];
      });
  }

  // angular hook
  ngOnDestroy(): void {
    if (this.subscription1) {
      this.subscription1.unsubscribe;
    }
  }

  // on detail edit
  onDetailEdit(editValue?: Model): void {
    this.displayValue = editValue;
    this.ShowEdit = true;
    setTimeout(() => this.comService.toChildEdit(this.displayValue), 1000);
  }

  // on cancel edit
  onCancelEdit(): void {
    this.editValue = undefined;
    this.displayValue = undefined;
    this.canSave = false;
    this.ShowEdit = false;
    this.onDetailView(undefined);
  }

  // on submit
  onSubmit(): void {
    this.canSave = false;
    if (this.editValue.Creator) {
      this.onUpdateToDataBase(this.editValue);
    } else {
      this.onInsertToDataBase(this.editValue);
    }
  }

  // on save complete
  onSaveComplete(): void {
    this.dialogsService.context("System message", "Save completed.", this.viewContainerRef)
      .subscribe(result => {
        this.canSave = false;
        this.ShowEdit = false;
        this.editValue = undefined;
        this.onDetailView(undefined);
        this.onReloadData();
      });
  }

  // on detail view
  // abstract onDetailView(value: any): void;
  onDetailView(value?: Model): void {
    // debug here
    // console.log(JSON.stringify(value));

    if (this.ShowEdit) {
      return;
    }
    if (value) {
      // console.log(value);
      this.service.getOneKeyNumber(value)
        .subscribe(dbData => {
          // console.log(JSON.stringify(dbData));
          this.displayValue = dbData;
        }, error => this.displayValue = undefined);
    } else {
      this.displayValue = undefined;
    }
  }

  // on insert data
  //abstract onInsertToDataBase(value: Model): void;
  onInsertToDataBase(value: Model): void {
    if (this.authService.getAuth) {
      value["Creator"] = this.authService.getAuth.UserName || "";
    }
    // change timezone
    value = this.changeTimezone(value);
    // insert data
    this.service.addModel(value).subscribe(
      (complete: any) => {
        //debug here
        //console.log("Complate", JSON.stringify(complete));
        if (complete) {
          this.displayValue = complete;
          this.onSaveComplete();
        } else {
          this.editValue.Creator = undefined;
          this.canSave = true;
          this.dialogsService.error("Failed !",
            "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
        }
      },
      (error: any) => {
        console.error(error);
        this.editValue.Creator = undefined;
        this.canSave = true;
        this.dialogsService.error("Failed !",
          "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
      }
    );
  }

  // on update data
  // abstract onUpdateToDataBase(value: Model): void;
  onUpdateToDataBase(value: Model): void {
    if (this.authService.getAuth) {
      value["Modifyer"] = this.authService.getAuth.UserName || "";
    }
    // debug here
    // console.log("Value is: ",JSON.stringify(value));
    // change timezone
    value = this.changeTimezone(value);
    // update data
    this.service.updateModelWithKey(value).subscribe(
      (complete: any) => {
        //debug here
        //console.log("Complate", JSON.stringify(complete));
        if (complete) {
          this.displayValue = complete;
          this.onSaveComplete();
        } else {
          this.canSave = true;
          this.dialogsService.error("Failed !",
            "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
        }
      },
      (error: any) => {
        console.error(error);
        this.canSave = true;
        this.dialogsService.error("Failed !",
          "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
      }
    );
  }

  // change data to timezone
  abstract changeTimezone(value: Model): Model;

  // reload
  abstract onReloadData(): void;
}
