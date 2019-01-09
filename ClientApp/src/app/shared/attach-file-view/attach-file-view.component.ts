import { Component, Input } from "@angular/core";
import { AttachFile } from "../attach-file.model";

@Component({
  selector: 'app-attach-file-view',
  templateUrl: './attach-file-view.component.html',
  styleUrls: ['./attach-file-view.component.scss']
})
export class AttachFileViewComponent {
  /** attach-file-view ctor */
  constructor() { }

  // Parameter
  @Input() attachFiles: Array<AttachFile>;

  // open attact file
  onOpenNewLink(link: string): void {
    if (link) {
      window.open("maintenance/" + link, "_blank");
    }
  }
}
