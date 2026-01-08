import {useCallback, useState} from 'react';
import styled from '@emotion/styled';

import {openConfirmModal} from 'sentry/components/confirm';
import {Button} from 'sentry/components/core/button';
import {CompactSelect} from 'sentry/components/core/compactSelect';
import {NumberInput} from 'sentry/components/core/input/numberInput';
import {Flex, Stack} from 'sentry/components/core/layout';
import {Text} from 'sentry/components/core/text';
import {SearchQueryBuilder} from 'sentry/components/searchQueryBuilder';
import {
  parseSearch,
  Token,
  type TokenResult,
} from 'sentry/components/searchSyntax/parser';
import {t} from 'sentry/locale';
import type {TagCollection} from 'sentry/types/group';

import {SectionLabel} from './statusCheckSharedComponents';
import type {StatusCheckFilter, StatusCheckRule} from './types';
import {
  getMeasurementLabel,
  getMetricLabel,
  getUnitForMeasurement,
  MEASUREMENT_OPTIONS,
  METRIC_OPTIONS,
} from './types';

interface Props {
  onDelete: () => void;
  onSave: (rule: StatusCheckRule) => void;
  rule: StatusCheckRule;
}

const FILTER_KEYS: TagCollection = {
  'build.platform': {key: 'build.platform', name: 'Platform'},
  'build.package_name': {key: 'build.package_name', name: 'Package Name'},
  'build.build_configuration': {
    key: 'build.build_configuration',
    name: 'Build Configuration',
  },
  'build.branch': {key: 'build.branch', name: 'Branch'},
};

function filtersToQueryString(filters: StatusCheckFilter[]): string {
  const grouped = filters.reduce(
    (acc, filter) => {
      const groupKey = `${filter.key}:${filter.negated ? 'negated' : 'normal'}`;
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(filter);
      return acc;
    },
    {} as Record<string, StatusCheckFilter[]>
  );

  return Object.entries(grouped)
    .map(([_groupKey, keyFilters]) => {
      const key = keyFilters[0]!.key;
      const negated = keyFilters[0]!.negated;

      if (keyFilters.length === 1) {
        return `${negated ? '!' : ''}${key}:${keyFilters[0]!.value}`;
      }
      const values = keyFilters.map(f => f.value).join(',');
      return `${negated ? '!' : ''}${key}:[${values}]`;
    })
    .join(' ');
}

function queryToFilters(query: string): StatusCheckFilter[] {
  if (!query.trim()) {
    return [];
  }
  const parsed = parseSearch(query);
  if (!parsed) {
    return [];
  }
  const filters: StatusCheckFilter[] = [];

  parsed
    .filter((token): token is TokenResult<Token.FILTER> => token.type === Token.FILTER)
    .forEach(token => {
      const valueText = token.value.text;

      if (valueText.startsWith('[') && valueText.endsWith(']')) {
        const values = valueText
          .slice(1, -1)
          .split(',')
          .map(v => v.trim());
        values.forEach(value => {
          filters.push({
            key: token.key.text,
            value,
            negated: token.negated || false,
          });
        });
      } else {
        filters.push({
          key: token.key.text,
          value: valueText,
          negated: token.negated || false,
        });
      }
    });

  return filters;
}

const getTagValues = (
  tag: {key: string; name: string},
  _searchQuery: string
): Promise<string[]> => {
  if (tag.key === 'build.platform') {
    return Promise.resolve(['android', 'ios']);
  }
  return Promise.resolve([]);
};

export function StatusCheckRuleForm({rule, onSave, onDelete}: Props) {
  const [metric, setMetric] = useState(rule.metric);
  const [measurement, setMeasurement] = useState(rule.measurement);
  const [value, setValue] = useState(rule.value);
  const [filterQuery, setFilterQuery] = useState(() =>
    filtersToQueryString(rule.filters)
  );

  const unit = getUnitForMeasurement(measurement);

  const handleSave = () => {
    onSave({
      ...rule,
      filters: queryToFilters(filterQuery),
      measurement,
      metric,
      unit,
      value,
    });
  };

  const handleQueryChange = useCallback((query: string) => {
    setFilterQuery(query);
  }, []);

  const handleDelete = () => {
    const valueWithUnit =
      rule.unit === '%' ? `${rule.value}%` : `${rule.value} ${rule.unit}`;
    const ruleDescription = `${getMetricLabel(rule.metric)} - ${getMeasurementLabel(rule.measurement)}`;

    openConfirmModal({
      header: (
        <Text size="lg" bold>
          {t('Are you sure you want to delete this status check rule?')}
        </Text>
      ),
      message: (
        <span>
          Will no longer fail status checks when <strong>{ruleDescription}</strong>{' '}
          surpasses <strong>{valueWithUnit}</strong>
        </span>
      ),
      confirmText: t('Delete Rule'),
      priority: 'danger',
      onConfirm: onDelete,
    });
  };

  return (
    <Stack gap="md" paddingTop="md" paddingBottom="md">
      <SectionLabel>{t('Fail Status Check When')}</SectionLabel>

      <Flex align="center" gap="md" wrap="wrap">
        <CompactSelect
          value={metric}
          options={METRIC_OPTIONS}
          onChange={opt => setMetric(opt.value)}
        />
        <Text variant="muted">:</Text>
        <CompactSelect
          value={measurement}
          options={MEASUREMENT_OPTIONS}
          onChange={opt => setMeasurement(opt.value)}
        />
        <Text variant="muted">{t('is greater than')}</Text>
        <Flex align="center" gap="xs">
          <StyledNumberInput value={value} onChange={v => setValue(v ?? 0)} min={0} />
          <Text variant="muted">{unit}</Text>
        </Flex>
      </Flex>

      <Stack gap="sm">
        <SectionLabel>{t('For')}</SectionLabel>
        <SearchQueryBuilder
          filterKeys={FILTER_KEYS}
          getTagValues={getTagValues}
          initialQuery={filterQuery}
          onChange={handleQueryChange}
          searchSource="preprod-status-check-filters"
          disallowFreeText
          disallowLogicalOperators
          placeholder={t('Add build filters...')}
          portalTarget={document.body}
        />
      </Stack>

      <Flex gap="md" marginTop="sm">
        <Button priority="primary" onClick={handleSave}>
          {t('Save Rule')}
        </Button>
        <Button onClick={handleDelete}>{t('Delete Rule')}</Button>
      </Flex>
    </Stack>
  );
}

const StyledNumberInput = styled(NumberInput)`
  width: 100px;
`;
