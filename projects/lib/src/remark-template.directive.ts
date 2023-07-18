import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({
  selector: "[remarkTemplate]"
})
export class RemarkTemplateDirective {
  @Input("remarkTemplate") nodeType!: string;

  constructor(
    public readonly template: TemplateRef<any>
  ) {}
}
