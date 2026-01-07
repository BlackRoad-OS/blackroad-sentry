export type MetricType = 'install_size' | 'download_size' | 'total_insights';

export type MeasurementType = 'absolute' | 'absolute_diff' | 'relative_diff';

export type UnitType = 'MB' | '%';

export interface StatusCheckFilter {
  key: string;
  value: string;
  negated?: boolean;
}

export interface StatusCheckRule {
  filters: StatusCheckFilter[];
  id: string;
  measurement: MeasurementType;
  metric: MetricType;
  unit: UnitType;
  value: number;
}

export interface StatusCheckConfig {
  enabled: boolean;
  rules: StatusCheckRule[];
}

export const METRIC_OPTIONS: Array<{label: string; value: MetricType}> = [
  {label: 'Install/Uncompressed Size', value: 'install_size'},
  {label: 'Download Size', value: 'download_size'},
  {label: 'Total Insights', value: 'total_insights'},
];

export const MEASUREMENT_OPTIONS: Array<{label: string; value: MeasurementType}> = [
  {label: 'Absolute Size', value: 'absolute'},
  {label: 'Absolute Diff', value: 'absolute_diff'},
  {label: 'Relative Diff', value: 'relative_diff'},
];

export const FILTER_KEY_OPTIONS = [
  {label: 'build.platform', value: 'build.platform'},
  {label: 'build.package', value: 'build.package'},
  {label: 'build.build_configuration', value: 'build.build_configuration'},
  {label: 'build.branch', value: 'build.branch'},
];

export function getMetricLabel(metric: MetricType): string {
  return METRIC_OPTIONS.find(o => o.value === metric)?.label ?? metric;
}

export function getMeasurementLabel(measurement: MeasurementType): string {
  return MEASUREMENT_OPTIONS.find(o => o.value === measurement)?.label ?? measurement;
}

export function getUnitForMeasurement(measurement: MeasurementType): UnitType {
  return measurement === 'relative_diff' ? '%' : 'MB';
}
