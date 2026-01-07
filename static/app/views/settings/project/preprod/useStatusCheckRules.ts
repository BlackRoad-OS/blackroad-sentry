import {useCallback, useMemo} from 'react';

import {addLoadingMessage, addSuccessMessage} from 'sentry/actionCreators/indicator';
import {t} from 'sentry/locale';
import type {Project} from 'sentry/types/project';
import {useUpdateProject} from 'sentry/utils/project/useUpdateProject';

import type {StatusCheckRule} from './types';

const ENABLED_KEY = 'sentry:preprod_size_status_checks_enabled';
const RULES_KEY = 'sentry:preprod_size_status_checks_rules';

export function useStatusCheckRules(project: Project) {
  const updateProject = useUpdateProject(project);

  const enabled = project.options?.[ENABLED_KEY] === true;
  const rulesJson = project.options?.[RULES_KEY] as string | undefined;
  const rules: StatusCheckRule[] = useMemo(() => {
    if (!rulesJson) {
      return [];
    }
    try {
      return JSON.parse(rulesJson);
    } catch {
      return [];
    }
  }, [rulesJson]);

  const config = {enabled, rules};

  const setEnabled = useCallback(
    (value: boolean) => {
      addLoadingMessage(t('Saving...'));
      updateProject.mutate(
        {
          options: {
            [ENABLED_KEY]: value,
            [RULES_KEY]: rulesJson ?? '[]',
          },
        },
        {
          onSuccess: () => {
            addSuccessMessage(
              value ? t('Status checks enabled.') : t('Status checks disabled.')
            );
          },
        }
      );
    },
    [updateProject, rulesJson]
  );

  const saveRules = useCallback(
    (newRules: StatusCheckRule[], successMessage?: string) => {
      addLoadingMessage(t('Saving...'));
      updateProject.mutate(
        {
          options: {
            [ENABLED_KEY]: enabled,
            [RULES_KEY]: JSON.stringify(newRules),
          },
        },
        {
          onSuccess: () => {
            if (successMessage) {
              addSuccessMessage(successMessage);
            }
          },
        }
      );
    },
    [updateProject, enabled]
  );

  const addRule = useCallback(
    (rule: StatusCheckRule) => {
      saveRules([...rules, rule], t('Status check rule created.'));
    },
    [rules, saveRules]
  );

  const updateRule = useCallback(
    (id: string, updates: Partial<StatusCheckRule>) => {
      const newRules = rules.map(r => (r.id === id ? {...r, ...updates} : r));
      saveRules(newRules, t('Status check rule saved.'));
    },
    [rules, saveRules]
  );

  const deleteRule = useCallback(
    (id: string) => {
      const newRules = rules.filter(r => r.id !== id);
      saveRules(newRules, t('Status check rule deleted.'));
    },
    [rules, saveRules]
  );

  const createEmptyRule = useCallback((): StatusCheckRule => {
    return {
      id: crypto.randomUUID(),
      metric: 'install_size',
      measurement: 'absolute',
      value: 0,
      unit: 'MB',
      filters: [],
    };
  }, []);

  return {
    config,
    setEnabled,
    addRule,
    updateRule,
    deleteRule,
    createEmptyRule,
  };
}
