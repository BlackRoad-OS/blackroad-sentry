import {Fragment, useState} from 'react';

import {CodeBlock} from '@sentry/scraps/code';
import {Stack} from '@sentry/scraps/layout';

import * as Storybook from 'sentry/stories';
import type {
  GroupOp,
  HeaderCheckOp,
  JsonPathOp,
  StatusCodeOp,
} from 'sentry/views/alerts/rules/uptime/types';

import {AddOpButton} from './addOpButton';
import {
  AssertionOpGroup,
  AssertionOpHeader,
  AssertionOpJsonPath,
  AssertionOpStatusCode,
} from './ops';

export default Storybook.story('Uptime Assertions', story => {
  story('Status Code Op', () => {
    const [statusCodeOp, setStatusCodeOp] = useState<StatusCodeOp>({
      op: 'status_code_check',
      operator: {cmp: 'equals'},
      value: 200,
    });

    return (
      <Fragment>
        <p>
          The <Storybook.JSXNode name="AssertionOpStatusCode" /> component allows users to
          configure status code assertions with comparison operators.
        </p>
        <AssertionOpStatusCode
          value={statusCodeOp}
          onChange={setStatusCodeOp}
          onRemove={() => {}}
        />
        <CodeBlock language="javascript">
          {JSON.stringify(statusCodeOp, null, 2)}
        </CodeBlock>
      </Fragment>
    );
  });

  story('JSON Path Op', () => {
    const [jsonPathOp, setJsonPathOp] = useState<JsonPathOp>({
      op: 'json_path',
      value: '$.data.success',
    });

    return (
      <Fragment>
        <p>
          The <Storybook.JSXNode name="AssertionOpJsonPath" /> component allows users to
          configure JSON path assertions for response body validation.
        </p>
        <AssertionOpJsonPath
          value={jsonPathOp}
          onChange={setJsonPathOp}
          onRemove={() => {}}
        />
        <CodeBlock language="javascript">{JSON.stringify(jsonPathOp, null, 2)}</CodeBlock>
      </Fragment>
    );
  });

  story('Header Op - With Values', () => {
    const [headerOp, setHeaderOp] = useState<HeaderCheckOp>({
      op: 'header_check',
      key_op: {cmp: 'equals'},
      key_operand: {header_op: 'literal', value: 'Content-Type'},
      value_op: {cmp: 'equals'},
      value_operand: {header_op: 'literal', value: 'application/json'},
    });

    return (
      <Fragment>
        <p>
          The <Storybook.JSXNode name="AssertionOpHeader" /> component allows users to
          configure HTTP header assertions. When using equals/not_equal comparisons, both
          key and value inputs are shown with operand type selectors (literal/glob).
        </p>
        <AssertionOpHeader value={headerOp} onChange={setHeaderOp} onRemove={() => {}} />
        <CodeBlock language="javascript">{JSON.stringify(headerOp, null, 2)}</CodeBlock>
      </Fragment>
    );
  });

  story('Header Op - Always/Never', () => {
    const [headerOp, setHeaderOp] = useState<HeaderCheckOp>({
      op: 'header_check',
      key_op: {cmp: 'always'},
      key_operand: {header_op: 'none'},
      value_op: {cmp: 'always'},
      value_operand: {header_op: 'none'},
    });

    return (
      <Fragment>
        <p>
          When the key comparison is set to <code>always</code> or <code>never</code>, the
          input fields are hidden and the value comparison automatically matches the key
          comparison.
        </p>
        <AssertionOpHeader value={headerOp} onChange={setHeaderOp} onRemove={() => {}} />
        <CodeBlock language="javascript">{JSON.stringify(headerOp, null, 2)}</CodeBlock>
      </Fragment>
    );
  });

  story('Header Op - Glob Pattern', () => {
    const [headerOp, setHeaderOp] = useState<HeaderCheckOp>({
      op: 'header_check',
      key_op: {cmp: 'equals'},
      key_operand: {header_op: 'glob', pattern: {value: 'X-*'}},
      value_op: {cmp: 'not_equal'},
      value_operand: {header_op: 'glob', pattern: {value: '*error*'}},
    });

    return (
      <Fragment>
        <p>
          Headers can use glob patterns for matching. The operand type selector allows
          switching between literal string matching and glob pattern matching.
        </p>
        <AssertionOpHeader value={headerOp} onChange={setHeaderOp} onRemove={() => {}} />
        <CodeBlock language="javascript">{JSON.stringify(headerOp, null, 2)}</CodeBlock>
      </Fragment>
    );
  });

  story('Multiple Ops', () => {
    const [statusCodeOp, setStatusCodeOp] = useState<StatusCodeOp>({
      op: 'status_code_check',
      operator: {cmp: 'less_than'},
      value: 400,
    });

    const [jsonPathOp, setJsonPathOp] = useState<JsonPathOp>({
      op: 'json_path',
      value: '$.error',
    });

    const [headerOp, setHeaderOp] = useState<HeaderCheckOp>({
      op: 'header_check',
      key_op: {cmp: 'equals'},
      key_operand: {header_op: 'literal', value: 'Content-Type'},
      value_op: {cmp: 'equals'},
      value_operand: {header_op: 'literal', value: 'application/json'},
    });

    return (
      <Fragment>
        <p>
          Multiple assertion operations can be combined to create complex validation
          rules.
        </p>
        <Stack gap="md">
          <AssertionOpStatusCode
            value={statusCodeOp}
            onChange={setStatusCodeOp}
            onRemove={() => {}}
          />
          <AssertionOpJsonPath
            value={jsonPathOp}
            onChange={setJsonPathOp}
            onRemove={() => {}}
          />
          <AssertionOpHeader
            value={headerOp}
            onChange={setHeaderOp}
            onRemove={() => {}}
          />
        </Stack>
      </Fragment>
    );
  });

  story('Add Op Button', () => {
    const [ops, setOps] = useState<Array<StatusCodeOp | JsonPathOp>>([]);

    return (
      <Fragment>
        <p>
          The <Storybook.JSXNode name="AddOpButton" /> component provides a dropdown menu
          to add new assertion operations.
        </p>
        <Stack gap="md">
          <AddOpButton
            onAddOp={op => {
              setOps(prev => [...prev, op as StatusCodeOp | JsonPathOp]);
            }}
          />
          {ops.length > 0 && (
            <div>
              <h4>Added Operations:</h4>
              <Stack gap="sm">
                {ops.map((op, index) => (
                  <div key={index}>
                    {op.op === 'status_code_check' ? (
                      <AssertionOpStatusCode
                        value={op}
                        onChange={newOp => {
                          setOps(prev => prev.map((o, i) => (i === index ? newOp : o)));
                        }}
                        onRemove={() => {
                          setOps(prev => prev.filter((_, i) => i !== index));
                        }}
                      />
                    ) : (
                      <AssertionOpJsonPath
                        value={op}
                        onChange={newOp => {
                          setOps(prev => prev.map((o, i) => (i === index ? newOp : o)));
                        }}
                        onRemove={() => {
                          setOps(prev => prev.filter((_, i) => i !== index));
                        }}
                      />
                    )}
                  </div>
                ))}
              </Stack>
            </div>
          )}
        </Stack>
      </Fragment>
    );
  });

  story('Group Op - Assert All (And)', () => {
    const [groupOp, setGroupOp] = useState<GroupOp>({
      op: 'and',
      children: [
        {
          op: 'status_code_check',
          operator: {cmp: 'less_than'},
          value: 400,
        },
        {
          op: 'json_path',
          value: '$.success',
        },
      ],
    });

    return (
      <Fragment>
        <p>
          The <Storybook.JSXNode name="AssertionOpGroup" /> component allows grouping
          multiple assertions with logical operators. "Assert All" requires all child
          assertions to pass.
        </p>
        <AssertionOpGroup value={groupOp} onChange={setGroupOp} />
        <CodeBlock language="javascript">{JSON.stringify(groupOp, null, 2)}</CodeBlock>
      </Fragment>
    );
  });

  story('Group Op - Assert Any (Or)', () => {
    const [groupOp, setGroupOp] = useState<GroupOp>({
      op: 'or',
      children: [
        {
          op: 'status_code_check',
          operator: {cmp: 'equals'},
          value: 200,
        },
        {
          op: 'status_code_check',
          operator: {cmp: 'equals'},
          value: 204,
        },
      ],
    });

    return (
      <Fragment>
        <p>
          "Assert Any" requires at least one child assertion to pass. The selector at the
          top allows switching between "Assert All" (and) and "Assert Any" (or).
        </p>
        <AssertionOpGroup value={groupOp} onChange={setGroupOp} />
        <CodeBlock language="javascript">{JSON.stringify(groupOp, null, 2)}</CodeBlock>
      </Fragment>
    );
  });

  story('Group Op - Nested Groups', () => {
    const [groupOp, setGroupOp] = useState<GroupOp>({
      op: 'and',
      children: [
        {
          op: 'status_code_check',
          operator: {cmp: 'less_than'},
          value: 400,
        },
        {
          op: 'or',
          children: [
            {
              op: 'json_path',
              value: '$.status',
            },
            {
              op: 'header_check',
              key_op: {cmp: 'equals'},
              key_operand: {header_op: 'literal', value: 'X-Status'},
              value_op: {cmp: 'equals'},
              value_operand: {header_op: 'literal', value: 'ok'},
            },
          ],
        },
      ],
    });

    return (
      <Fragment>
        <p>
          Groups can be nested to create complex logical expressions. This example shows
          an "Assert All" group containing a status code check and a nested "Assert Any"
          group.
        </p>
        <AssertionOpGroup value={groupOp} onChange={setGroupOp} />
        <CodeBlock language="javascript">{JSON.stringify(groupOp, null, 2)}</CodeBlock>
      </Fragment>
    );
  });

  story('Group Op - Empty Group', () => {
    const [groupOp, setGroupOp] = useState<GroupOp>({
      op: 'and',
      children: [],
    });

    return (
      <Fragment>
        <p>
          Empty groups show only the type selector and the "Add Condition" button,
          allowing users to build assertions from scratch.
        </p>
        <AssertionOpGroup value={groupOp} onChange={setGroupOp} />
        <CodeBlock language="javascript">{JSON.stringify(groupOp, null, 2)}</CodeBlock>
      </Fragment>
    );
  });

  story('Root Group', () => {
    const [rootGroup, setRootGroup] = useState<GroupOp>({
      op: 'and',
      children: [
        {
          op: 'status_code_check',
          operator: {cmp: 'less_than'},
          value: 400,
        },
        {
          op: 'json_path',
          value: '$.success',
        },
        {
          op: 'header_check',
          key_op: {cmp: 'equals'},
          key_operand: {header_op: 'literal', value: 'Content-Type'},
          value_op: {cmp: 'equals'},
          value_operand: {header_op: 'literal', value: 'application/json'},
        },
      ],
    });

    return (
      <Fragment>
        <p>
          The root group renders without the <code>GroupContainer</code> styling. It
          displays assertions in a simple stack with an "Add Assertion" button at the
          bottom. The root group is always an "and" operation and cannot be changed or
          removed.
        </p>
        <AssertionOpGroup value={rootGroup} onChange={setRootGroup} root />
        <CodeBlock language="javascript">{JSON.stringify(rootGroup, null, 2)}</CodeBlock>
      </Fragment>
    );
  });

  story('Root Group - Empty', () => {
    const [rootGroup, setRootGroup] = useState<GroupOp>({
      op: 'and',
      children: [],
    });

    return (
      <Fragment>
        <p>
          An empty root group shows only the "Add Assertion" button, providing a clean
          starting point for building assertions.
        </p>
        <AssertionOpGroup value={rootGroup} onChange={setRootGroup} root />
        <CodeBlock language="javascript">{JSON.stringify(rootGroup, null, 2)}</CodeBlock>
      </Fragment>
    );
  });
});
