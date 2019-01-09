import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    selector: "context-dialog",
    template: `
    <div>
        <h4 class="text-danger">
            <i class="fa fa-x2 fa-frown-o" aria-hidden="true"></i>
            {{ title }}
        </h4>
    </div>
    <p>{{ message }}</p>
    <button type="submit" mat-raised-button (click)="dialogRef.close(true)" color="warn">รับทราบ</button>
`,
})
export class ErrorDialog {

    public title: string;
    public message: string;

    constructor(public dialogRef: MatDialogRef<ErrorDialog>) {

    }
}
