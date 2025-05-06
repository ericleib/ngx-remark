import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RemarkNodeComponent } from './remark-node.component';
import { RemarkTemplateDirective } from './remark-template.directive';
import { RemarkComponent } from './remark.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RemarkComponent,
    RemarkTemplateDirective,
    RemarkNodeComponent
  ],
  exports: [
    RemarkComponent,
    RemarkTemplateDirective,
    RemarkNodeComponent
  ]
})
export class RemarkModule { }
