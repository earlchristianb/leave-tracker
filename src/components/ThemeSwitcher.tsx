"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Switch from "./Switch";
const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const lightTheme = "light";
  const darkTheme = "dark";
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const isLightTheme = theme === lightTheme;
  const displayTheme = isLightTheme ? darkTheme : lightTheme;
  const displayIcon = () => {
    return isLightTheme ? (
      <FontAwesomeIcon icon={faSun} className="text-xl text-yellow-300" />
    ) : (
      <FontAwesomeIcon icon={faMoon} className="text-xl" />
    );
  };

  return (
    <div className="bg-background text-primary-green space-y-2 text-center">
      The current theme is: {theme}
      <br />
      <div className="flex w-full items-center justify-center space-x-2">
        <Switch
          value={isLightTheme}
          handleSwitch={() => setTheme(displayTheme)}
        />
        {displayIcon()}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
