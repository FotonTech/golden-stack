import React, { useMemo } from 'react';

export const composeFragmentsToComponent = (
  componentName: string,
  ...fragments: React.ComponentType<any>[]
): React.FunctionComponent<any> => {
  function ComposedComponent({ __fragmentOwner, __fragments, __id, ...props }) {
    const query = useMemo(
      () => ({
        __fragmentOwner,
        __fragments,
        __id,
      }),
      [__fragmentOwner, __fragments, __id],
    );

    return fragments.map((Component, index) => <Component key={index} query={query} {...props} />);
  }
  ComposedComponent.displayName = componentName;
  return (ComposedComponent as unknown) as React.FunctionComponent<any>;
};
