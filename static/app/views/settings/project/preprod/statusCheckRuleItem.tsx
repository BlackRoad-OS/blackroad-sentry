import {Fragment, useState} from 'react';
import styled from '@emotion/styled';

import {Stack} from 'sentry/components/core/layout';
import {Text} from 'sentry/components/core/text';
import {IconChevron} from 'sentry/icons';
import {space} from 'sentry/styles/space';

import {StatusCheckRuleForm} from './statusCheckRuleForm';
import type {StatusCheckRule} from './types';
import {getMeasurementLabel, getMetricLabel} from './types';

interface Props {
  onDelete: () => void;
  onSave: (rule: StatusCheckRule) => void;
  rule: StatusCheckRule;
  defaultExpanded?: boolean;
}

export function StatusCheckRuleItem({
  rule,
  onSave,
  onDelete,
  defaultExpanded = false,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const valueWithUnit =
    rule.unit === '%' ? `${rule.value}%` : `${rule.value} ${rule.unit}`;
  const title = `${getMetricLabel(rule.metric)} • ${getMeasurementLabel(rule.measurement)} • ${valueWithUnit}`;

  const groupedFilters = rule.filters.reduce(
    (acc, filter) => {
      if (!acc[filter.key]) {
        acc[filter.key] = [];
      }
      acc[filter.key]!.push(filter);
      return acc;
    },
    {} as Record<string, typeof rule.filters>
  );

  return (
    <ItemContainer>
      <ItemHeader onClick={() => setIsExpanded(!isExpanded)}>
        <Stack gap="2xs">
          <Text size="md" bold>
            {title}
          </Text>
          {rule.filters.length > 0 && (
            <Text size="sm" variant="muted" as="div">
              {Object.entries(groupedFilters).map(([key, filters], groupIdx) => {
                const keyLabel = key.replace('build.', '');
                return (
                  <Fragment key={key}>
                    {groupIdx > 0 && ' • '}
                    {filters.map((f, idx) => (
                      <Fragment key={`${f.key}-${f.value}-${idx}`}>
                        {idx > 0 && <BoldText> OR </BoldText>}
                        {f.negated && <BoldText>NOT </BoldText>}
                        {f.value}
                      </Fragment>
                    ))}{' '}
                    ({keyLabel})
                  </Fragment>
                );
              })}
            </Text>
          )}
        </Stack>
        <IconChevron direction={isExpanded ? 'up' : 'down'} size="sm" />
      </ItemHeader>
      {isExpanded && (
        <ItemContent>
          <StatusCheckRuleForm
            key={rule.id}
            rule={rule}
            onSave={onSave}
            onDelete={onDelete}
          />
        </ItemContent>
      )}
    </ItemContainer>
  );
}

const ItemContainer = styled('div')`
  border-bottom: 1px solid ${p => p.theme.tokens.border.primary};

  &:last-child {
    border-bottom: none;
  }
`;

const ItemHeader = styled('button')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${space(2)} ${space(2)};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${p => p.theme.backgroundSecondary};
  }
`;

const ItemContent = styled('div')`
  padding: 0 ${space(2)} ${space(2)} ${space(2)};
`;

const BoldText = styled('span')`
  font-weight: ${p => p.theme.fontWeight.bold};
`;
