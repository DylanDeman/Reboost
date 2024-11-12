// src/components/Layout.jsx
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../components/navbar';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/Theme.context'; // 👈

export default function Layout() {
  const { theme, textTheme } = useContext(ThemeContext); // 👈
  return (
    <div className={`container-xl bg-${theme} text-${textTheme}`}>
      {/* 👈 */}
      <Navbar />
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}
