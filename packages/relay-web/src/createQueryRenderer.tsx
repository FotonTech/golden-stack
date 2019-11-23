import hoistStatics from 'hoist-non-react-statics';
import * as React from 'react';
import { QueryRenderer, GraphQLTaggedNode, Variables } from 'react-relay';

import Environment from './Environment';

interface Config {
  query: GraphQLTaggedNode;
  queriesParams?: (props: any) => object | null;
  variables?: Variables;
  loadingView?: React.ReactNode | null;
  getFragmentProps?: (fragmentProps: object) => object;
  shouldUpdate?: boolean;
  isLoading?: boolean;
}

export default function createQueryRenderer(
  FragmentComponent: React.ComponentType<any>,
  Component: React.ComponentType<any> | null,
  config: Config,
): React.ComponentType<any> {
  const { query, queriesParams } = config;

  const getVariables = props => (queriesParams ? queriesParams(props) : config.variables);

  class QueryRendererWrapper extends React.Component<any> {
    state = {};

    shouldComponentUpdate(nProps) {
      const { location, shouldUpdate } = this.props;
      const { location: nLocation } = nProps;

      if (shouldUpdate) {
        return true;
      }

      if (!location || !nLocation) {
        return true;
      }

      const diffPathname = location.pathname !== nLocation.pathname;

      // update only if the pathname changes
      if (diffPathname) {
        return true;
      }

      return false;
    }

    static getDerivedStateFromProps(props) {
      const newVariables = getVariables(props);

      return {
        variables: newVariables,
      };
    }

    render() {
      const { variables } = this.state;

      return (
        <QueryRenderer
          environment={Environment}
          query={query}
          variables={variables}
          render={({ error, props, retry }) => {
            if (error) {
              return (
                <div>
                  <span>{error.toString()}</span>
                  <button onClick={retry}>Retry</button>
                </div>
              );
            }

            if (props) {
              const fragmentProps = config.getFragmentProps ? config.getFragmentProps(props) : { query: props };

              return <FragmentComponent {...this.props} {...fragmentProps} isLoading={false} />;
            }

            if (config.loadingView !== undefined) {
              return config.loadingView;
            }

            if (config.isLoading) {
              return <FragmentComponent {...this.props} query={{}} isLoading={true} />;
            }

            return <span>Loading...</span>;
          }}
        />
      );
    }
  }

  return Component ? hoistStatics(QueryRendererWrapper, Component) : QueryRendererWrapper;
}
