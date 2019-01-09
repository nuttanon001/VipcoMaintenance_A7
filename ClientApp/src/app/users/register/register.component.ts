// angular
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { Component, OnInit, ViewContainerRef, PACKAGE_ROOT_URL } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, } from "@angular/forms";
// model
import { User } from "../shared/user.model";
// service
import { UserService } from "../shared/user.service";
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { EmployeeService } from "../../employees/shared/employee.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["../../shared/styles/edit.style.scss"],
  providers: [UserService, EmployeeService]
})
export class RegisterComponent implements OnInit {
  constructor(private service: UserService,
    private serviceEmployee: EmployeeService,
    private serviceDialogs: DialogsService,
    private serviceAuth: AuthService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { }

  /**
   * Parameter
   */
  user: User;
  userForm: FormGroup;
  empCode: string = "";
  userName: string = "";

  get UpdateProfile(): boolean {
    if (this.user) {
      return this.user.UserId > 0;
    }
    return false;
  }

  // angular core hook
  ngOnInit() {
    this.user = {
      UserId: 0,
      LevelUser: 1,
    };

    this.buildForm();

    this.route.paramMap.subscribe((param: ParamMap) => {
      let key: number = Number(param.get("condition") || 0);

      // debug here
      // console.log("Route key is :", key);

      if (key) {
        if (this.serviceAuth.getAuth) {
          this.user = this.serviceAuth.getAuth;

          // debug here
          // console.log("getAuth is :", JSON.stringify(this.user));
          this.buildForm();
        } else {
          this.onGoBack();
        }
      }
    }, error => console.error(error));
  }

  // build form
  buildForm(): void {
    this.userForm = this.fb.group({
      UserId: [this.user.UserId],
      UserName: [this.user.UserName,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ]
      ],
      PassWord: [this.user.PassWord,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20)
        ]
      ],
      MailAddress: [this.user.MailAddress,
        [
          Validators.maxLength(200),
        ]
      ],
      LevelUser: [this.user.LevelUser],
      EmpCode: [this.user.EmpCode,
        [
          Validators.required,
        ]
      ],
      Creator: [this.user.Creator],
      CreateDate: [this.user.CreateDate],
      Modifyer: [this.user.Modifyer],
      ModifyDate: [this.user.ModifyDate],
      // viewModel
      NameThai: [this.user.NameThai,
        [
          Validators.required,
        ]
      ],
    });

    const control: AbstractControl | null = this.userForm.get("EmpCode");
    if (control) {
      control.valueChanges.subscribe((data: any) => this.onUpdateEmployee());
    }
  }

  // update PlanDate
  onUpdateEmployee(): void {
    if (!this.userForm || !this.user) { return; }

    const form: FormGroup = this.userForm;
    const control: AbstractControl | null = form.get("EmpCode");
    // if have planned start date
    if (control) {
      // beark loop
      if (this.empCode) {
        if (this.empCode === control.value) {
          return;
        }
      }

      this.serviceEmployee.getOneKeyString({ EmpCode: control.value})
        .subscribe(employee => {
          if (employee && employee.EmpCode) {
            this.service.getEmployeeAlready(employee.EmpCode)
              .subscribe(data => {
                if (data) {
                  // console.log(JSON.stringify(data));
                  this.userForm.patchValue({
                    NameThai: employee.NameThai,
                  });
                } else {
                  let message: any = "this employee was already in system.";
                  this.serviceDialogs.error("Reguester Error", (message || ""), this.viewContainerRef);
                  this.userForm.patchValue({
                    NameThai: "",
                  });
                }
              });
          }
        }, error => {
          this.userForm.patchValue({
            NameThai: "",
          });
          console.error(error);
        });
    }
  }

  // on valid data
  onSubmit(): void {
    if (this.userForm) {
      this.user = this.userForm.value;

      if (this.user.UserId > 0) {
        this.onUpdateData(this.user);
      } else {
        this.onInsertData(this.user);
      }
    }
  }

  // on Insert
  onInsertData(user: User): void {
    user.Creator = user.UserName;

    this.service.addModel(user)
      .subscribe(dBUser => {
        this.serviceDialogs.context("Regiester Complate", "บัญชีผู้ใช้งานนี้สามารถเข้าใช้งานได้แล้ว", this.viewContainerRef)
          .subscribe(() => this.onGoBack());
      }, (error: string) => {
        let message: any = error.replace("404 - Not Found", "");

        this.serviceDialogs.error("Register Error", (message || ""), this.viewContainerRef);
      });
  }
  // on Update
  onUpdateData(user: User): void {
    this.service.updateModelWithKey(user)
      .subscribe(dBUser => {
        // this.serviceAuth.setAuth = dBUser;
        this.serviceDialogs.context("Update Complate", "บัญชีผู้ใช้งานปรับปรุงเรียบร้อย", this.viewContainerRef)
          .subscribe(() => this.onGoBack());
      }, (error: string) => {
        let message: any = error.replace("404 - Not Found", "");

        this.serviceDialogs.error("Register Error", (message || ""), this.viewContainerRef);
      });
  }

  // on go back
  onGoBack(): void {
    if (this.UpdateProfile) {
      this.router.navigate(["home"]);
    } else {
      this.router.navigate(["login"]);
    }
  }
}
