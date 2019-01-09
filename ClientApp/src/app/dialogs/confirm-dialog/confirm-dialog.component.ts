import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    selector: 'confirm-dialog',
    template: `
    <div>
        <h4 class="text-info">
        <i class="fa fa-x2 fa-meh-o" aria-hidden="true"></i>
            {{ title }}
        </h4>
    </div>
    <p>{{ message }}</p>
    <button type="submit" mat-raised-button (click)="dialogRef.close(true)" color="accent">Yes</button>
    <button type="button" mat-button (click)="dialogRef.close()" color="warn">No</button>
    `,
})
export class ConfirmDialog {

    public title: string;
    public message: string;

    constructor(public dialogRef: MatDialogRef<ConfirmDialog>) {

    }
}
