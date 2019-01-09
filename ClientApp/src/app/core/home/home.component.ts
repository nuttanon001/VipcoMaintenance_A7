import { Component,OnInit } from "@angular/core";
// Model
import { User } from "../../users/shared/user.model";
// Service
import { UserService } from "../../users/shared/user.service";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  providers: [UserService]
})
export class HomeComponent implements OnInit {
  constructor(
    private service:UserService
  ) { }

  /**
   * Parameter
   */
  /**
   * On angular core Init
   */
  ngOnInit(): void {
  }

  onOpenNewLink(): void {
    let link: string = "files/maintenance_doc.pdf";
    if (link) {
      window.open(link, "_blank");
    }
  }
}
