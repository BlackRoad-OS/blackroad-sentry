import {InputGroup} from '@sentry/scraps/input/inputGroup';
import {Text} from '@sentry/scraps/text';

import {CompactSelect} from 'sentry/components/core/compactSelect';
import {t} from 'sentry/locale';
import type {StatusCodeOp} from 'sentry/views/alerts/rules/uptime/types';

import {COMPARISON_OPTIONS, OpContainer} from './opCommon';

interface AssertionOpStatusCodeProps {
  onChange: (op: StatusCodeOp) => void;
  onRemove: () => void;
  value: StatusCodeOp;
}

export function AssertionOpStatusCode({
  value,
  onChange,
  onRemove,
}: AssertionOpStatusCodeProps) {
  // Filter out 'always' and 'never' which are not valid for status code checks
  const statusCodeOptions = COMPARISON_OPTIONS.filter(
    opt => !['always', 'never'].includes(opt.value)
  );
  const selectedOption = statusCodeOptions.find(opt => opt.value === value.operator.cmp);

  return (
    <OpContainer label={t('Status Code')} onRemove={onRemove}>
      <InputGroup>
        <InputGroup.LeadingItems>
          <CompactSelect
            size="xs"
            value={value.operator.cmp}
            onChange={option => {
              onChange({
                op: 'status_code_check',
                operator: {cmp: option.value},
                value: value.value,
              });
            }}
            options={statusCodeOptions}
            triggerProps={{
              size: 'zero',
              borderless: true,
              showChevron: false,
              children: <Text monospace>{selectedOption?.symbol ?? ''}</Text>,
            }}
          />
        </InputGroup.LeadingItems>
        <InputGroup.Input
          type="number"
          size="sm"
          value={value.value}
          min={100}
          max={599}
          onChange={e => {
            const newValue = parseInt(e.target.value, 10);
            if (!isNaN(newValue)) {
              onChange({...value, value: newValue});
            }
          }}
          placeholder="code"
          monospace
          width="100%"
        />
      </InputGroup>
    </OpContainer>
  );
}
