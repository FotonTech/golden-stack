import React from 'react';
import styled, { css } from 'styled-components';

import CommonText from './CommonText';
import Space from './Space';

const Wrapper = styled.div<{ css?: any }>`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  ${p => p.css || null}
`;

const textCss = css`
  text-align: center;
`;

const NotFound = () => {
  return (
    <Wrapper>
      <Space height={20} />
      <CommonText color="primaryTitle" textSize="subsectionSize" textCss={textCss} weight="bold">
        Page not found
      </CommonText>
      <Space height={20} />
      <CommonText color="primaryText" textSize="textSize" textCss={textCss}>
        Looks like this page does not exist
      </CommonText>
    </Wrapper>
  );
};

export default NotFound;
