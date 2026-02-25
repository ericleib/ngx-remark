/*
 * Public API Surface of lib
 */

import { RemarkComponent } from './remark.component';
import { RemarkNodeComponent } from './remark-node.component';
import { RemarkTemplateDirective } from './remark-template.directive';

export {
  RemarkComponent,
  RemarkNodeComponent,
  RemarkTemplateDirective
};

export const RemarkModule = [
  RemarkComponent,
  RemarkNodeComponent,
  RemarkTemplateDirective,
] as const;

export * from './remark-templates.service';
export * from './plugins';
