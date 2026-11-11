import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n.js'

// Apply saved theme on app load
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
  htmlElement.classList.add('dark');
  htmlElement.style.colorScheme = 'dark';
} else if (savedTheme === 'light') {
  htmlElement.classList.remove('dark');
  htmlElement.style.colorScheme = 'light';
} else if (savedTheme === 'auto') {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    htmlElement.classList.add('dark');
    htmlElement.style.colorScheme = 'dark';
  } else {
    htmlElement.classList.remove('dark');
    htmlElement.style.colorScheme = 'light';
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)