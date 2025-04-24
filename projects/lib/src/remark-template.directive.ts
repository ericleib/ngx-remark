import { Directive, TemplateRef, inject, input } from "@angular/core";

@Directive({
  selector: "[remarkTemplate]",
  standalone: false
})
export class RemarkTemplateDirective {
  readonly template = inject<TemplateRef<any>>(TemplateRef);

  readonly nodeType = input.required<string>({ alias: "remarkTemplate" });
}
