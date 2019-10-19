import hoistStatics from 'hoist-non-react-statics';
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GraphQLTaggedNode, QueryRenderer, Variables } from 'react-relay';

import Environment from './Environment';

interface Config<Props = any> {
  query: GraphQLTaggedNode;
  queriesParams?: (props: Props) => object | null;
  variables?: Variables;
  loadingView?: boolean;
  getFragmentProps?: (props: Props) => object;
}

export default function createQueryRenderer<Props = any>(
  FragmentComponent: React.ComponentType<Props>,
  Component: React.ComponentType<Props>,
  config: Config<Props>,
): React.ComponentType<Props> {
  const { query, queriesParams, getFragmentProps } = config;

  class QueryRendererWrapper extends React.PureComponent<Props> {
    render() {
      const variables = queriesParams ? queriesParams(this.props) : config.variables;

      return (
        <QueryRenderer
          environment={Environment}
          query={query}
          variables={variables || {}}
          render={({ error, props, retry }) => {
            if (error) {
              return (
                <View>
                  <Text>{error.toString()}</Text>
                  <TouchableOpacity onPress={retry}>
                    <Text>Retry</Text>
                  </TouchableOpacity>
                </View>
              );
            }

            if (props) {
              const fragmentProps = getFragmentProps ? getFragmentProps(props) : { query: props };
              return <FragmentComponent {...this.props} {...fragmentProps} />;
            }

            if (config.loadingView !== undefined) {
              return config.loadingView;
            }

            return (
              <View>
                <Text>Loading...</Text>
              </View>
            );
          }}
        />
      );
    }
  }

  return hoistStatics(QueryRendererWrapper, Component);
}
