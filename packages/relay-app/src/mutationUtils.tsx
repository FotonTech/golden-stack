import { ConnectionHandler, RecordSourceSelectorProxy } from 'relay-runtime';
// eslint-disable-next-line import/no-unresolved
import Toast from 'react-native-root-toast';

import { isScalar } from './utils';

interface ListRecordRemoveUpdaterOptions {
  parentId: string;
  itemId: string;
  parentFieldName: string;
  store: RecordSourceSelectorProxy;
}

interface ListRecordAddUpdaterOptions {
  parentId: string;
  item: object;
  type: string;
  parentFieldName: string;
  store: RecordSourceSelectorProxy;
}

interface OptimisticConnectionUpdaterOptions {
  parentId: string;
  store: RecordSourceSelectorProxy;
  connectionName: string;
  item: object;
  customNode: any | null;
  itemType: string;
}

interface ConnectionDeleteEdgeUpdaterOptions {
  parentId?: string;
  connectionName: string;
  nodeId: string;
  store: RecordSourceSelectorProxy;
  filters?: object;
}

export function listRecordRemoveUpdater({ parentId, itemId, parentFieldName, store }: ListRecordRemoveUpdaterOptions) {
  const parentProxy = store.get(parentId);
  const items = parentProxy.getLinkedRecords(parentFieldName);

  parentProxy.setLinkedRecords(
    items.filter(record => record._dataID !== itemId),
    parentFieldName,
  );
}

export function listRecordAddUpdater({ parentId, item, type, parentFieldName, store }: ListRecordAddUpdaterOptions) {
  const node = store.create(item.id, type);

  Object.keys(item).forEach(key => {
    node.setValue(item[key], key);
  });

  const parentProxy = store.get(parentId);
  const items = parentProxy.getLinkedRecords(parentFieldName);

  parentProxy.setLinkedRecords([...items, node], parentFieldName);
}

interface ConnectionUpdaterParams {
  store: RecordSourceSelectorProxy;
  parentId: string;
  connectionName: string;
  edge: any;
  before?: boolean;
  filters?: object;
  cursor?: string;
}
export function connectionUpdater({
  store,
  parentId,
  connectionName,
  edge,
  before,
  filters,
  cursor,
}: ConnectionUpdaterParams) {
  if (edge) {
    if (!parentId) {
      // eslint-disable-next-line no-console
      console.log('maybe you forgot to pass a parentId: ');
      return;
    }

    const parentProxy = store.get(parentId);

    const connection = ConnectionHandler.getConnection(parentProxy, connectionName, filters);

    if (!connection) {
      // eslint-disable-next-line no-console
      console.log('maybe this connection is not in relay store yet:', connectionName);
      return;
    }

    const newEndCursorOffset = connection.getValue('endCursorOffset');
    connection.setValue(newEndCursorOffset + 1, 'endCursorOffset');

    const newCount = connection.getValue('count');
    connection.setValue(newCount + 1, 'count');

    if (before) {
      ConnectionHandler.insertEdgeBefore(connection, edge, cursor);
    } else {
      ConnectionHandler.insertEdgeAfter(connection, edge, cursor);
    }
  }
}

export function optimisticConnectionUpdater({
  parentId,
  store,
  connectionName,
  item,
  customNode,
  itemType,
}: OptimisticConnectionUpdaterOptions) {
  const node = customNode || store.create(item.id, itemType);

  !customNode &&
    Object.keys(item).forEach(key => {
      if (isScalar(item[key])) {
        node.setValue(item[key], key);
      } else {
        node.setLinkedRecord(item[key], key);
      }
    });

  const edge = store.create('client:newEdge:' + node._dataID.match(/[^:]+$/)[0], `${itemType}Edge`);
  edge.setLinkedRecord(node, 'node');

  connectionUpdater({ store, parentId, connectionName, edge });
}

export function connectionDeleteEdgeUpdater({
  parentId,
  connectionName,
  nodeId,
  store,
  filters,
}: ConnectionDeleteEdgeUpdaterOptions) {
  const parentProxy = parentId === null ? store.getRoot() : store.get(parentId);
  const connection = ConnectionHandler.getConnection(parentProxy, connectionName, filters);

  if (!connection) {
    // eslint-disable-next-line no-console
    console.log(
      `Connection ${connectionName} not found on ${parentId}, maybe this connection is not in relay store yet`,
    );
    return;
  }

  const newCount = connection.getValue('count');
  connection.setValue(newCount - 1, 'count');

  ConnectionHandler.deleteNode(connection, nodeId);
}

interface MutationCallbackResult {
  onCompleted: (response: any) => void;
  onError: () => void;
}

interface MutationCallbackArgs {
  mutationName: string;
  successMessage?: string | ((response: any) => string);
  errorMessage: string;
  afterCompleted?: (response: any) => void;
  afterError?: () => void;
}

export const getMutationCallbacks = ({
  mutationName,
  successMessage,
  errorMessage,
  afterCompleted,
  afterError,
}: MutationCallbackArgs): MutationCallbackResult => {
  const showToast = (message: string) => {
    return Toast.show(message, { duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM });
  };

  return {
    onCompleted: (response: any) => {
      const data = response[mutationName];

      if (!data || data.error) {
        showToast(data.error || errorMessage);
        afterError && afterError();
        return;
      }

      successMessage && showToast(typeof successMessage === 'function' ? successMessage(response) : successMessage);
      afterCompleted && afterCompleted(response);
    },
    onError: () => {
      showToast(errorMessage);
      afterError && afterError();
    },
  };
};
