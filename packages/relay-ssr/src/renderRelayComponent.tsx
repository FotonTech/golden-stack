import React from 'react';
import { Environment } from 'relay-runtime';
import { RouterState } from 'found';

interface RenderRelayComponent extends RouterState {
  Component: React.ComponentType<any> | null;
  environment: Environment;
  error: Error;
  props: {};
  resolving: boolean;
  retry: () => void;
  variables: {};
}

export default function renderRelayComponent({
  Component,
  environment,
  error,
  match,
  props,
  resolving,
  retry,
  variables,
}: RenderRelayComponent) {
  if (error) {
    return (
      <div>
        <span>{error.toString()}</span>
        <br />
        <button onClick={retry}>Retry</button>
      </div>
    );
  }

  if (props) {
    return <Component query={props} match={match} />;
  }

  return (
    <div>
      <span>Loading...</span>
    </div>
  );
}
