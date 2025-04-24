import { ChangeDetectionStrategy, Component, Input, TrackByFunction, inject } from "@angular/core";
import { RemarkTemplatesService } from "./remark-templates.service";
import { Node, Parent } from "mdast";

@Component({
    selector: "remark-node, [remarkNode]",
    templateUrl: "./remark-node.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RemarkNodeComponent {
  templateService = inject(RemarkTemplatesService);

  @Input({required: true, alias: "remarkNode"}) node!: Node;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  get children() {
    return (this.node as Parent).children;
  }

  get templates() {
    return this.templateService.templates;
  }

  // Tracking by index means that DOM elements are reused even when the node type and content is different
  // Changes should still be reflected because of the @Input() node binding
  trackBy: TrackByFunction<Node> = (index, node) => index;
}
