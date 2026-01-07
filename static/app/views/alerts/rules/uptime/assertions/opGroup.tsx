import {css} from '@emotion/react';
import styled from '@emotion/styled';

import {Button} from '@sentry/scraps/button';
import {Stack} from '@sentry/scraps/layout';
import {Text} from '@sentry/scraps/text';

import {CompactSelect, type SelectOption} from 'sentry/components/core/compactSelect';
import {IconAdd, IconDelete} from 'sentry/icons';
import {t} from 'sentry/locale';
import type {GroupOp, Op} from 'sentry/views/alerts/rules/uptime/types';

import {AddOpButton} from './addOpButton';
import {AssertionOpHeader} from './opHeader';
import {AssertionOpJsonPath} from './opJsonPath';
import {AssertionOpStatusCode} from './opStatusCode';

interface AssertionOpGroupProps {
  onChange: (op: GroupOp) => void;
  value: GroupOp;
  onRemove?: () => void;
  root?: boolean;
}

const GROUP_TYPE_OPTIONS: Array<SelectOption<'and' | 'or'>> = [
  {value: 'and', label: t('Assert All')},
  {value: 'or', label: t('Assert Any')},
];

export function AssertionOpGroup({
  value,
  onChange,
  onRemove,
  root,
}: AssertionOpGroupProps) {
  const handleAddOp = (newOp: Op) =>
    onChange({...value, children: [...value.children, newOp]});

  const handleUpdateChild = (index: number, updatedOp: Op) => {
    const newChildren = [...value.children];
    newChildren[index] = updatedOp;
    onChange({...value, children: newChildren});
  };

  const handleRemoveChild = (index: number) => {
    const newChildren = value.children.filter((_, i) => i !== index);
    onChange({...value, children: newChildren});
  };

  const renderOp = (op: Op, index: number) => {
    switch (op.op) {
      case 'status_code_check':
        return (
          <AssertionOpStatusCode
            key={index}
            value={op}
            onChange={updatedOp => handleUpdateChild(index, updatedOp)}
            onRemove={() => handleRemoveChild(index)}
          />
        );
      case 'json_path':
        return (
          <AssertionOpJsonPath
            key={index}
            value={op}
            onChange={updatedOp => handleUpdateChild(index, updatedOp)}
            onRemove={() => handleRemoveChild(index)}
          />
        );
      case 'header_check':
        return (
          <AssertionOpHeader
            key={index}
            value={op}
            onChange={updatedOp => handleUpdateChild(index, updatedOp)}
            onRemove={() => handleRemoveChild(index)}
          />
        );
      case 'and':
      case 'or':
        return (
          <AssertionOpGroup
            key={index}
            value={op}
            onChange={updatedOp => handleUpdateChild(index, updatedOp)}
            onRemove={() => handleRemoveChild(index)}
          />
        );
      default:
        return null;
    }
  };

  if (root) {
    return (
      <Stack gap="md">
        {value.children.map((child, index) => renderOp(child, index))}
        <div>
          <AddOpButton
            size="xs"
            triggerProps={{size: 'xs'}}
            triggerLabel={t('Add Assertion')}
            onAddOp={handleAddOp}
          />
        </div>
      </Stack>
    );
  }

  return (
    <GroupContainer>
      <GroupHeading>
        <CompactSelect
          size="xs"
          triggerProps={{
            borderless: true,
            size: 'zero',
          }}
          value={value.op}
          onChange={option => {
            onChange({...value, op: option.value});
          }}
          options={GROUP_TYPE_OPTIONS}
        />
        <AddOpButton
          size="xs"
          triggerProps={{
            borderless: true,
            size: 'zero',
            icon: <IconAdd size="xs" />,
            title: t('Add assertion to group'),
          }}
          onAddOp={handleAddOp}
        />
        <TopBorder rightBorder={!onRemove} />
        {onRemove ? (
          <Button
            size="zero"
            borderless
            icon={<IconDelete size="xs" variant="muted" />}
            aria-label={t('Remove Group')}
            onClick={onRemove}
          />
        ) : (
          <div />
        )}
      </GroupHeading>
      <Stack gap="md">
        {value.children.length === 0 && (
          <Text size="xs">{t('Empty assertion group')}</Text>
        )}
        {value.children.map((child, index) => renderOp(child, index))}
      </Stack>
    </GroupContainer>
  );
}

const BORDER_OFFSET = '15px';

const GroupContainer = styled('div')`
  padding: ${p => p.theme.space.lg};
  padding-top: ${p => p.theme.space.xl};
  position: relative;
  margin-top: ${p => p.theme.space.lg};
  margin-right: calc(${p => p.theme.space.lg} - 1px);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    top: ${BORDER_OFFSET};
    border: 1px dashed ${p => p.theme.innerBorder};
    border-top: none;
    border-radius: ${p => p.theme.radius.md};
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    pointer-events: none;
  }
`;

const TopBorder = styled('div')<{rightBorder?: boolean}>`
  border-top: 1px dashed ${p => p.theme.innerBorder};
  height: ${BORDER_OFFSET};
  margin-bottom: -${BORDER_OFFSET};
  ${p =>
    p.rightBorder &&
    css`
      border-right: 1px dashed ${p.theme.innerBorder};
      border-top-right-radius: ${p.theme.radius.md};
      margin-right: calc(${p.theme.space.lg} - 3px);
    `};
`;

const GroupHeading = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  left: -${p => p.theme.space.sm};
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: max-content max-content 1fr max-content;
  align-items: center;
  gap: ${p => p.theme.space['2xs']};
  margin-right: calc(${p => p.theme.space.lg} * -1 + 1px);
`;
