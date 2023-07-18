import { NgModule } from '@angular/core';
import { RemarkComponent } from './remark.component';
import { CommonModule } from '@angular/common';
import { RemarkTemplateDirective } from './remark-template.directive';
import { RemarkNodeComponent } from './remark-node.component';



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
