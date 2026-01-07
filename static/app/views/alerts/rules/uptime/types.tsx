import type {Actor, ObjectStatus} from 'sentry/types/core';

export enum UptimeMonitorStatus {
  OK = 1,
  FAILED = 2,
}

export enum UptimeMonitorMode {
  MANUAL = 1,
  AUTO_DETECTED_ONBOARDING = 2,
  AUTO_DETECTED_ACTIVE = 3,
}

export interface UptimeRule {
  body: string | null;
  downtimeThreshold: number;
  environment: string | null;
  headers: Array<[key: string, value: string]>;
  id: string;
  intervalSeconds: number;
  method: string;
  mode: UptimeMonitorMode;
  name: string;
  owner: Actor;
  projectSlug: string;
  recoveryThreshold: number;
  status: ObjectStatus;
  timeoutMs: number;
  traceSampling: boolean;
  uptimeStatus: UptimeMonitorStatus;
  url: string;
}

export interface UptimeCheck {
  checkStatus: CheckStatus;
  checkStatusReason: CheckStatusReason | null;
  durationMs: number;
  environment: string;
  httpStatusCode: number | null;
  projectUptimeSubscriptionId: number;
  region: string;
  regionName: string;
  scheduledCheckTime: string;
  timestamp: string;
  traceId: string;
  uptimeCheckId: string;
}

export interface UptimeSummary {
  avgDurationUs: number;
  downtimeChecks: number;
  failedChecks: number;
  missedWindowChecks: number;
  totalChecks: number;
}

export enum CheckStatusReason {
  FAILURE = 'failure',
  TIMEOUT = 'timeout',
  DNS_ERROR = 'dns_error',
  TLS_ERROR = 'tls_error',
  CONNECTION_ERROR = 'connection_error',
  REDIRECT_ERROR = 'redirect_error',
}

export enum CheckStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  FAILURE_INCIDENT = 'failure_incident',
  MISSED_WINDOW = 'missed_window',
}

type StatsBucket = {
  [CheckStatus.SUCCESS]: number;
  [CheckStatus.FAILURE]: number;
  [CheckStatus.FAILURE_INCIDENT]: number;
  [CheckStatus.MISSED_WINDOW]: number;
};

export type CheckStatusBucket = [timestamp: number, stats: StatsBucket];

// Uptime Assertion Types (matching Rust types from uptime-checker)

export type Assertion = {
  root: Op;
};

export type Comparison =
  | {cmp: 'always'}
  | {cmp: 'never'}
  | {cmp: 'less_than'}
  | {cmp: 'greater_than'}
  | {cmp: 'equals'}
  | {cmp: 'not_equal'};

export type GlobPattern = {
  value: string;
};

export type HeaderOperand =
  | {header_op: 'none'}
  | {header_op: 'literal'; value: string}
  | {header_op: 'glob'; pattern: GlobPattern};

export interface AndOp {
  children: Op[];
  op: 'and';
}

export interface OrOp {
  children: Op[];
  op: 'or';
}

export interface NotOp {
  op: 'not';
  operand: Op;
}

export interface StatusCodeOp {
  op: 'status_code_check';
  operator: Comparison;
  value: number;
}

export interface JsonPathOp {
  op: 'json_path';
  value: string;
}

export interface HeaderCheckOp {
  key_op: Comparison;
  key_operand: HeaderOperand;
  op: 'header_check';
  value_op: Comparison;
  value_operand: HeaderOperand;
}

export type GroupOp = AndOp | OrOp;
export type Op = GroupOp | NotOp | StatusCodeOp | JsonPathOp | HeaderCheckOp;
