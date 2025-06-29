import React from 'react';
import { Svg, Circle, Rect, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';

// This component ensures SVG components are loaded and available
export const SVGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Make sure SVG components are available globally
  React.useEffect(() => {
    if (typeof global !== 'undefined') {
      global.Svg = Svg;
      global.Circle = Circle;
      global.Rect = Rect;
      global.Path = Path;
      global.G = G;
      global.Defs = Defs;
      global.LinearGradient = LinearGradient;
      global.Stop = Stop;
    }
  }, []);

  return <>{children}</>;
};