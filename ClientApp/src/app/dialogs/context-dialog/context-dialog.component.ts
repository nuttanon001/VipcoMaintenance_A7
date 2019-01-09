import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    selector: "context-dialog",
    template: `
    <div>
        <h4 class="text-success">
            <i class="fa fa-x2 fa-info" aria-hidden="true"></i>
            {{ title }}
        </h4>
    </div>
    <p>
        {{ message }}
    </p>
    <button type="submit" mat-raised-button (click)="dialogRef.close(true)" color="accent">รับทราบ</button>
    `,
})
export class ContextDialog {

    public title: string;
    public message: string;

    constructor(public dialogRef: MatDialogRef<ContextDialog>) {

    }
}
