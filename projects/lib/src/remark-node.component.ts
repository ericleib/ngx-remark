import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { Node, Parent } from "mdast";
import { RemarkTemplatesService } from "./remark-templates.service";

@Component({
  selector: "remark-node, [remarkNode]",
  templateUrl: "./remark-node.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class RemarkNodeComponent {
  templateService = inject(RemarkTemplatesService);

  readonly node = input.required<Node>({ alias: "remarkNode" });

  readonly children = computed(() => (this.node() as Parent).children)

  get templates() {
    return this.templateService.templates;
  }

}
