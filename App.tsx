
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainApp from './components/MainApp';
import { SunIcon, MoonIcon } from './components/Icons';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('resq-ai-loggedin');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }

    const storedTheme = localStorage.getItem('resq-ai-theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('resq-ai-theme', theme);
  }, [theme]);

  const handleLoginSuccess = () => {
    localStorage.setItem('resq-ai-loggedin', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('resq-ai-loggedin');
    setIsLoggedIn(false);
  };
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
          <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
          >
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </button>
          {isLoggedIn && (
            <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                aria-label="Logout"
            >
                Logout
            </button>
          )}
      </div>
      
      {isLoggedIn ? (
        <MainApp />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
