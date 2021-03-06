import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'formly-repeat-section',
  template: `
    <h4>{{ to.description || '' }}</h4>
    <div *ngFor="let field of field.fieldGroup; let i = index;" class="section">
        <formly-field class="col" [field]="field"></formly-field>
        <button mat-icon-button color="warn" class="remove" type="button" (click)="remove(i)"><mat-icon>delete</mat-icon></button>
    </div>
    <div style="margin:30px 0;">
      <button mat-raised-button color="primary" type="button" (click)="add()" [matTooltip]="to.addText">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styleUrls:["./repeat-section.styles.scss"]
})
export class RepeatTypeComponent extends FieldArrayType {}
