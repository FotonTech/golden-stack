import React from 'react';
import { useRelayEnvironment } from 'react-relay/hooks';
import { commitMutation, Disposable, MutationParameters } from 'relay-runtime';

const { useState, useRef, useCallback, useEffect } = React;

export default function useMutation<T extends MutationParameters>(mutation) {
  const environment = useRelayEnvironment();
  const [isPending, setPending] = useState(false);
  const requestRef = useRef<Disposable | null>(null);
  const mountedRef = useRef(false);
  const execute = useCallback(
    (config = { variables: {} }) => {
      if (requestRef.current != null) {
        return;
      }
      const request = commitMutation<T>(environment, {
        ...config,
        onCompleted: () => {
          if (!mountedRef.current) {
            return;
          }
          requestRef.current = null;
          setPending(false);
          config.onCompleted && config.onCompleted();
        },
        onError: error => {
          // eslint-disable-next-line no-console
          console.log(error);
          if (!mountedRef.current) {
            return;
          }
          requestRef.current = null;
          setPending(false);
          config.onError && config.onError(error);
        },
        mutation,
      });
      requestRef.current = request;
      setPending(true);
    },
    [mutation, environment],
  );
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return [isPending, execute];
}
