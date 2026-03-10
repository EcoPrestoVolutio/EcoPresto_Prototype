import { ThemeContext, useThemeState } from './hooks/useTheme';
import { Calculator } from './pages/Calculator';

export default function App() {
  const themeValue = useThemeState();

  return (
    <ThemeContext.Provider value={themeValue}>
      <Calculator />
    </ThemeContext.Provider>
  );
}
