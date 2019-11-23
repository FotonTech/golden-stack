import React from 'react';
import styled, { css, DefaultTheme, ThemeProps, FlattenInterpolation } from 'styled-components';

import theme from '../../theme';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  span?: boolean;
  center?: boolean;
  bold?: boolean;
  weight?: string;
  textSize?: 'subtitleSize' | 'sectionSize' | 'subsectionSize' | 'titleSize' | 'textSize' | 'subtextSize' | 'iconSize';
  textCss?: FlattenInterpolation<ThemeProps<DefaultTheme>>;
}

const commonStyle = css<Props>`
  margin: 0px;
  font-weight: ${props => (props.textSize === 'titleSize' || props.bold ? 'bold' : 'normal')};
  color: ${props => props.theme[`${props.color}`]};
  margin: 0px;
  ${p => p.textCss};
  font-size: ${props => props.theme[`${props.textSize}`]}px;
  ${p =>
    p.weight &&
    `
    font-weight: ${p.weight}
  `};
  ${props => props.onClick && `cursor: pointer;`};
  ${props => props.center && `text-align: center;`};
`;

const CustomText = styled.p`
  ${commonStyle}
`;

const CustomSpan = styled.span`
  ${commonStyle}
`;

const CommonText = ({ span, ...props }: Props) => {
  return span ? <CustomSpan {...props} /> : <CustomText theme={theme} {...props} />;
};

export default CommonText;
