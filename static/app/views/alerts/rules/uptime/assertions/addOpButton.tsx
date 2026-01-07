import {
  DropdownMenu,
  type DropdownMenuProps,
  type MenuItemProps,
} from 'sentry/components/dropdownMenu';
import {t} from 'sentry/locale';
import type {
  AndOp,
  HeaderCheckOp,
  JsonPathOp,
  Op,
  StatusCodeOp,
} from 'sentry/views/alerts/rules/uptime/types';

interface AddOpButtonProps extends Omit<DropdownMenuProps, 'items'> {
  /**
   * Callback when an operation type is selected
   */
  onAddOp: (op: Op) => void;
}

export function AddOpButton({onAddOp, ...dropdownProps}: AddOpButtonProps) {
  const menuItems: MenuItemProps[] = [
    {
      key: 'status_code',
      label: t('Status Code'),
      onAction: () => {
        const statusCodeOp: StatusCodeOp = {
          op: 'status_code_check',
          operator: {cmp: 'equals'},
          value: 200,
        };
        onAddOp(statusCodeOp);
      },
    },
    {
      key: 'json_path',
      label: t('JSON Path'),
      onAction: () => {
        const jsonPathOp: JsonPathOp = {
          op: 'json_path',
          value: '',
        };
        onAddOp(jsonPathOp);
      },
    },
    {
      key: 'header',
      label: t('Header'),
      onAction: () => {
        const headerOp: HeaderCheckOp = {
          op: 'header_check',
          key_op: {cmp: 'equals'},
          key_operand: {header_op: 'literal', value: ''},
          value_op: {cmp: 'equals'},
          value_operand: {header_op: 'literal', value: ''},
        };
        onAddOp(headerOp);
      },
    },
    {
      key: 'group',
      label: t('Logical Group'),
      onAction: () => {
        const andOp: AndOp = {
          op: 'and',
          children: [],
        };
        onAddOp(andOp);
      },
    },
  ];

  return (
    <DropdownMenu
      items={menuItems}
      size="sm"
      {...dropdownProps}
      triggerProps={{
        'aria-label': t('Add assertion'),
        showChevron: false,
        ...dropdownProps.triggerProps,
      }}
    />
  );
}
