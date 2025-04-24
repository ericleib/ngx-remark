import { ChangeDetectionStrategy, Component, TrackByFunction, inject, input } from "@angular/core";
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

  get children() {
    return (this.node() as Parent).children;
  }

  get templates() {
    return this.templateService.templates;
  }

  // Tracking by index means that DOM elements are reused even when the node type and content is different
  // Changes should still be reflected because of the @Input() node binding
  trackBy: TrackByFunction<Node> = (index, node) => index;
}
