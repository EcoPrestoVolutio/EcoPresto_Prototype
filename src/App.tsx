import { ThemeContext, useThemeState } from './hooks/useTheme';
import { MaterialsEnergyContext, useMaterialsEnergyState } from './hooks/useMaterialsEnergy';
import { Calculator } from './pages/Calculator';

export default function App() {
  const themeValue = useThemeState();
  const meValue = useMaterialsEnergyState();

  return (
    <ThemeContext.Provider value={themeValue}>
      <MaterialsEnergyContext.Provider value={meValue}>
        <Calculator />
      </MaterialsEnergyContext.Provider>
    </ThemeContext.Provider>
  );
}
