import { formatTransactionId } from './formatters';

const auditEventTypeMap = {
  TRANSACTION_CREATED: {
    streamType: 'CREATED',
    label: 'Transaction event emitted',
    description: 'A transaction-created domain event entered the processing pipeline.'
  },
  RULE_EVALUATED: {
    streamType: 'RULE_TRIGGERED',
    label: 'Rule execution observed',
    description: 'Drools evaluated the transaction and emitted rule telemetry.'
  },
  STATUS_CHANGED: {
    streamType: 'LIFECYCLE',
    label: 'Lifecycle transition detected',
    description: 'The transaction lifecycle moved between operational states.'
  },
  TRANSACTION_DELETED: {
    streamType: 'DELETED',
    label: 'Transaction deletion event emitted',
    description: 'A transaction deletion event was recorded.'
  },
  MANUAL_OVERRIDE: {
    streamType: 'OVERRIDE',
    label: 'Manual override recorded',
    description: 'An operator override was added to the transaction history.'
  },
  TRANSACTION_VIEWED: {
    streamType: 'VIEWED',
    label: 'Audit view recorded',
    description: 'A transaction detail view was captured for auditability.'
  }
};

export function mapAuditEventToOperationalEvent(event, correlationId = '') {
  const metadata = auditEventTypeMap[event.eventType] || {
    streamType: event.eventType || 'EVENT',
    label: 'Operational event observed',
    description: event.eventDescription || 'A transaction event was observed.'
  };

  return {
    id: `audit-${event.id}`,
    type: metadata.streamType,
    label: metadata.label,
    description: event.eventDescription || metadata.description,
    transactionId: event.transactionId,
    transactionLabel: formatTransactionId(event.transactionId),
    user: event.performedBy || 'system',
    role: event.performedByRole || 'SYSTEM',
    timestamp: event.createdAt,
    ruleTriggered: event.ruleTriggered,
    previousStatus: event.previousStatus,
    newStatus: event.newStatus,
    correlationId
  };
}

export function mapTransactionToOperationalEvent(transaction, correlationId = '') {
  return {
    id: `transaction-${transaction.id}`,
    type: transaction.status === 'FLAGGED' ? 'FLAGGED' : 'CREATED',
    label:
      transaction.status === 'FLAGGED'
        ? 'Flagged transaction event emitted'
        : 'Transaction event emitted',
    description:
      transaction.status === 'FLAGGED'
        ? 'Risk rules classified this transaction as flagged.'
        : 'A transaction was persisted and made available to operations.',
    transactionId: transaction.id,
    transactionLabel: formatTransactionId(transaction.id),
    user: transaction.userId,
    role: 'TRANSACTION_SUBJECT',
    timestamp: transaction.createdAt,
    ruleTriggered: transaction.status === 'FLAGGED' ? 'Risk rule matched' : '',
    previousStatus: null,
    newStatus: transaction.status,
    correlationId
  };
}

export function sortOperationalEvents(events) {
  return [...events].sort((first, second) => {
    const firstTime = new Date(first.timestamp || 0).getTime();
    const secondTime = new Date(second.timestamp || 0).getTime();
    return secondTime - firstTime;
  });
}

export function summarizeOperationalEvents(events) {
  return {
    eventsProcessed: events.length,
    rulesTriggered: events.filter((event) => event.type === 'RULE_TRIGGERED').length,
    flaggedEvents: events.filter((event) => event.type === 'FLAGGED').length,
    lifecycleTransitions: events.filter((event) => event.type === 'LIFECYCLE').length
  };
}
