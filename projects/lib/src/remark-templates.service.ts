import { Injectable, Signal, TemplateRef } from "@angular/core";

@Injectable()
export class RemarkTemplatesService {
  templates!: Signal<{[nodeType: string]: TemplateRef<any>}>;
}
