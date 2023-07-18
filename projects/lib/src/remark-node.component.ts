import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { RemarkTemplatesService } from "./remark-templates.service";

@Component({
  selector: "remark-node, [remarkNode]",
  templateUrl: "./remark-node.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemarkNodeComponent {
  @Input("remarkNode") node: any;

  constructor(
    public templateService: RemarkTemplatesService
  ) {}

  get templates() {
    return this.templateService.templates;
  }
}
