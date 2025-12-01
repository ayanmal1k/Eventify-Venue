import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Changed from true to false to default to light mode

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    // Only set to dark mode if system explicitly prefers dark mode
    setIsDarkMode(colorScheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      // Dark Mode Colors
      background: '#1F1B24',
      cardBackground: '#2D2833',
      primary: '#c5a149', // Golden Field
      primaryDark: '#b8943d', // Darker Golden Field
      text: '#F9F9ED', // Ivory instead of pure white
      textSecondary: '#9CA3AF',
      textTertiary: '#E6D4A3', // Light golden tint
      border: 'rgba(197, 161, 73, 0.2)', // Golden Field with opacity
      dot: '#c5a149', // Golden Field
      gradient1: '#2d2419', // Dark golden brown
      gradient2: '#4a3f2c', // Medium golden brown
      gradient3: '#6a5a3e', // Light golden brown
    } : {
      // Light Mode Colors
      background: '#F9F9ED', // Ivory background
      cardBackground: '#F9F9ED', // Ivory card background
      primary: '#c5a149', // Golden Field
      primaryDark: '#b8943d', // Darker Golden Field
      text: '#1F2937',
      textSecondary: '#6B7280',
      textTertiary: '#c5a149', // Golden Field
      border: 'rgba(197, 161, 73, 0.3)', // Golden Field with opacity
      dot: '#E6D4A3', // Light golden tint
      gradient1: '#F5F2E8', // Very light ivory
      gradient2: '#ECE6D4', // Light ivory-gold
      gradient3: '#E6D4A3', // Light golden tint
    },
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
