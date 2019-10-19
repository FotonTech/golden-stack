import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import theme from './theme';

const App = ({ children, ...props }: { children: React.ReactNode }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <ThemeProvider theme={theme}>
      <>{children}</>
    </ThemeProvider>
  );
};

export default App;
