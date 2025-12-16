import {OrganizationFixture} from 'sentry-fixture/organization';

import {render, screen} from 'sentry-test/reactTestingLibrary';

import {DataConditionGroupLogicType} from 'sentry/types/workflowEngine/dataConditions';
import type {MetricDetector} from 'sentry/types/workflowEngine/detectors';
import {Dataset, EventTypes} from 'sentry/views/alerts/rules/metric/types';
import {DetectorLink} from 'sentry/views/detectors/components/detectorLink';

describe('DetectorLink', () => {
  const organization = OrganizationFixture();

  const mockDetector: MetricDetector = {
    id: 'detector-1',
    name: 'Test Detector',
    type: 'metric_issue',
    projectId: '1',
    enabled: true,
    dateCreated: '2024-01-01T00:00:00Z',
    dataSources: [
      {
        id: 'ds-1',
        queryType: 'snuba_query',
        queryObj: {
          snubaQuery: {
            dataset: Dataset.ERRORS,
            aggregate: 'count()',
            environment: 'production',
            query: 'error.type:ZeroDivisionError',
            eventTypes: [EventTypes.ERROR],
          },
        },
      },
    ],
    conditionGroup: {
      id: 'cg-1',
      logicType: DataConditionGroupLogicType.ALL,
      conditions: [],
    },
    config: {
      detectionType: 'static',
    },
  };

  it('preserves page filters in detector link', () => {
    render(<DetectorLink detector={mockDetector} />, {
      organization,
      initialRouterConfig: {
        location: {
          pathname: '/',
          query: {
            start: '2024-01-01T00:00:00Z',
            end: '2024-01-31T23:59:59Z',
            statsPeriod: '14d',
            environment: 'production',
            otherParam: 'should-not-be-included',
          },
        },
      },
    });

    const link = screen.getByRole('link', {name: /test detector/i});
    expect(link).toHaveAttribute(
      'href',
      '/organizations/org-slug/monitors/detector-1/?end=2024-01-31T23%3A59%3A59Z&environment=production&start=2024-01-01T00%3A00%3A00Z&statsPeriod=14d'
    );
  });

  it('does not include query params when filters are not set', () => {
    render(<DetectorLink detector={mockDetector} />, {
      organization,
      initialRouterConfig: {
        location: {
          pathname: '/',
          query: {},
        },
      },
    });

    const link = screen.getByRole('link', {name: /test detector/i});
    expect(link).toHaveAttribute('href', '/organizations/org-slug/monitors/detector-1/');
  });

  it('renders disabled detector without link for issue_stream type', () => {
    const issueStreamDetector = {
      ...mockDetector,
      type: 'issue_stream' as const,
    };

    render(<DetectorLink detector={issueStreamDetector} />, {
      organization,
    });

    expect(screen.getByText(/all issues in/i)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
