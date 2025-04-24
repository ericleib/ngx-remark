import { Directive, Input, TemplateRef, inject } from "@angular/core";

@Directive({
    selector: "[remarkTemplate]",
    standalone: false
})
export class RemarkTemplateDirective {
  readonly template = inject<TemplateRef<any>>(TemplateRef);

  @Input({required: true, alias: "remarkTemplate"}) nodeType!: string;

}
