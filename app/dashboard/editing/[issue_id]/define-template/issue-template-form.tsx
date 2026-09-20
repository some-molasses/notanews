"use client";

import { Button } from "@/app/components/button/button.client";
import {
  Column,
  Row,
  RowReverse,
} from "@/app/components/layout/layout-components";
import Tiptap from "@/app/components/tiptap/tiptap";
import { useArrayState } from "@/app/utils/client-utils";
import {
  IssueTemplate,
  IssueTemplateComponent,
  IssueTemplatePluralitySchema,
} from "@/app/utils/data-types";
import { insecureUUID } from "@/app/utils/util";
import "./issue-template-form.scss";

export function IssueTemplateForm({
  template,
  defaultComponents,
}: {
  template: IssueTemplate;
  defaultComponents: IssueTemplateComponent[];
}) {
  const [components, addComponent, updateComponent, deleteComponent] =
    useArrayState(defaultComponents, (c) => c.id);

  return (
    <div id="issue-template-form">
      <Column id="components-list">
        {components.map((c) => (
          <TemplateComponent
            component={c}
            key={c.id}
            onUpdate={({
              title,
              description,
              plurality,
            }: Pick<
              IssueTemplateComponent,
              "title" | "description" | "plurality"
            >) =>
              updateComponent({ ...c, title, description, plurality }, c.id)
            }
            onDelete={() => deleteComponent(c.id)}
          />
        ))}
      </Column>
      <RowReverse>
        <Button
          handler={() =>
            addComponent({
              id: insecureUUID(),
              title: null,
              description: null,
              issue_template_id: template.id,
              plurality: "single-item",
            })
          }
        >
          Add component
        </Button>
      </RowReverse>
    </div>
  );
}

function TemplateComponent({
  component,
  onUpdate,
  onDelete,
}: {
  component: IssueTemplateComponent;
  onUpdate: (args: {
    title: string | null;
    description: string | null;
    plurality: IssueTemplateComponent["plurality"];
  }) => void;
  onDelete: () => void;
}) {
  const pluralityOptions = [
    {
      value: "single-item",
      desc: "Only allow one item to be submitted",
    },
    {
      value: "multi-item",
      desc: "Allow multiple items to be submitted",
    },
  ];
  return (
    <Column className="template-component">
      <input
        className="component-title h3"
        placeholder="name your section"
        onChange={(evt) =>
          onUpdate({
            title: evt.target.value,
            description: component.description,
            plurality: component.plurality,
          })
        }
      />
      <div className="component-description">
        <Tiptap
          defaultContent={component.description ?? "Tell us what you think!"}
          onUpdate={(props) =>
            onUpdate({
              title: component.title,
              description: props.editor.getHTML(),
              plurality: component.plurality,
            })
          }
          editable
        />
      </div>

      <Row className="component-bottom-row">
        <div className="pluralty-selector">
          <select
            value={component.plurality}
            onChange={(evt) =>
              onUpdate({
                title: component.title,
                description: component.description,
                plurality: IssueTemplatePluralitySchema.parse(evt.target.value),
              })
            }
          >
            {pluralityOptions.map(({ value, desc }) => (
              <option value={value} key={value}>
                {desc}
              </option>
            ))}
          </select>
        </div>
        <Button handler={onDelete}>Delete component</Button>
      </Row>
    </Column>
  );
}
