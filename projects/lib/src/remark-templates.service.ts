import { Injectable, TemplateRef } from "@angular/core";

@Injectable()
export class RemarkTemplatesService {
  templates: {[nodeType: string]: TemplateRef<any>} = {};
}
