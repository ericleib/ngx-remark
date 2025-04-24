import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({
    selector: "[remarkTemplate]",
    standalone: false
})
export class RemarkTemplateDirective {
  @Input({required: true, alias: "remarkTemplate"}) nodeType!: string;

  constructor(
    public readonly template: TemplateRef<any>
  ) {}
}
