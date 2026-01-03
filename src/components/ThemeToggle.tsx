'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react'; 

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light")


  const handleTheme = () => {
    const body = document.getElementsByTagName("body")[0];

    if (theme === "dark") {
        body.classList.remove("light");
        body.classList.add("dark")
    } else {
        body.classList.remove("dark");
        body.classList.add("light")
    };
  }

  useEffect(() => {
    handleTheme()
  }, [theme])



  return (
    <button
      onClick={() =>setTheme( prev => prev === 'dark' ? "light" : "dark" )}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
    </button>
  );
}