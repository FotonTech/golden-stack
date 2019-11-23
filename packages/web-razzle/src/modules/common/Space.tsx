// eslint-disable-next-line
import styled, { FlattenInterpolation, ThemeProps } from 'styled-components';

export interface Props {
  width?: number;
  height?: number;
  css?: FlattenInterpolation<ThemeProps<any>>;
}

const Space = styled.div<Props>`
  ${p => (p.width ? `width: ${p.width.toFixed()}px;` : '')}
  ${p => (p.height ? `height: ${p.height.toFixed()}px;` : '')}
  ${p => p.css || ''}
`;

export default Space;
