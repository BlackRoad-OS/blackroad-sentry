import {Button} from '@sentry/scraps/button';
import {Flex, Grid, Stack} from '@sentry/scraps/layout';
import {Text} from '@sentry/scraps/text';

import type {SelectOption} from 'sentry/components/core/compactSelect';
import QuestionTooltip from 'sentry/components/questionTooltip';
import {IconDelete} from 'sentry/icons';
import {t} from 'sentry/locale';
import type {Comparison} from 'sentry/views/alerts/rules/uptime/types';

interface OpContainerProps {
  children: React.ReactNode;
  label: React.ReactNode;
  onRemove: () => void;
  tooltip?: React.ReactNode;
}

export function OpContainer({label, children, tooltip, onRemove}: OpContainerProps) {
  return (
    <Stack gap="sm">
      <Flex gap="xs" align="center">
        <Text size="sm" bold>
          {label}
        </Text>
        {tooltip && <QuestionTooltip size="xs" title={tooltip} isHoverable />}
      </Flex>
      <Grid columns="1fr max-content" align="center" gap="sm">
        {children}
        <Button
          size="zero"
          borderless
          icon={<IconDelete size="xs" variant="muted" />}
          aria-label={t('Remove Group')}
          onClick={onRemove}
        />
      </Grid>
    </Stack>
  );
}

export const COMPARISON_OPTIONS: Array<
  SelectOption<Comparison['cmp']> & {symbol: string}
> = [
  {
    value: 'equals',
    label: t('equal'),
    symbol: '=',
    trailingItems: <Text monospace>=</Text>,
  },
  {
    value: 'not_equal',
    label: t('not equal to'),
    symbol: '\u2260',
    trailingItems: <Text monospace>{'\u2260'}</Text>,
  },
  {
    value: 'less_than',
    label: t('less than'),
    symbol: '<',
    trailingItems: <Text monospace>{'<'}</Text>,
  },
  {
    value: 'greater_than',
    label: t('greater than'),
    symbol: '>',
    trailingItems: <Text monospace>{'>'}</Text>,
  },
  {
    value: 'always',
    label: t('present'),
    symbol: '\u22A4',
    trailingItems: <Text monospace>{'\u22A4'}</Text>,
  },
  {
    value: 'never',
    label: t('not present'),
    symbol: '\u2205',
    trailingItems: <Text monospace>{'\u2205'}</Text>,
  },
];
