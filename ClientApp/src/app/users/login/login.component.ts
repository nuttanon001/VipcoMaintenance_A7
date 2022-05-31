import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
// models
import { User } from "../shared/user.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: [
    "../../shared/styles/login.style.scss",
    "../../shared/styles/edit.style.scss"
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: User;

  constructor(
    private authService: AuthService,
    private dialogsService: DialogsService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  // init
  ngOnInit(): void {
    this.user = {
      UserId: 0,
      PassWord: "",
      UserName: "",
      LevelUser: 1,
    };
    this.buildForm();
  }

  // build form
  buildForm(): void {
    this.loginForm = this.fb.group({
      UserId: [this.user.UserId],
      UserName: [this.user.UserName,
        [
          Validators.required,
          Validators.minLength(1),
        ]
      ],
      PassWord: [this.user.PassWord,
        [
          Validators.required,
          Validators.minLength(4),
        ]
      ]
    });
  }

  // login
  onLogin(): void {
    // console.log("On Login");

    this.user = this.loginForm.value;
    this.authService.login(this.user)
      .subscribe((data) => {
        // login successful
        // no more alert Token
        // alert("Our Token is: " + auth.access_token);
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : "/home";
        this.router.navigate([redirect]);
      },
      (err) => {
        console.error(err);
        // login failure
        this.dialogsService.error("Login failure", "Warning : Username or Password mismatch !!!", this.viewContainerRef)
      });
  }

  // logout
  logout(): void {
    // console.log("Logout page login");
    this.authService.logout();
  }
}
