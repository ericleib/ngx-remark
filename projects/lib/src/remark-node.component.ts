import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Node, Parent } from "mdast";
import { RemarkTemplatesService } from "./remark-templates.service";

@Component({
  selector: "remark-node, [remarkNode]",
  templateUrl: "./remark-node.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet]
})
export class RemarkNodeComponent {
  templateService = inject(RemarkTemplatesService);

  readonly node = input.required<Node>({ alias: "remarkNode" });

  readonly children = computed(() => (this.node() as Parent).children);

  // Note: implemented solely for the purpose of tests (to use spyOn)
  ngOnInit() {}
  ngOnChanges() {}
}
