import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* SVG Illustration */}
        <div className="flex justify-center mb-8">
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="dark:text-slate-600"
          >
            <circle
              cx="150"
              cy="150"
              r="140"
              className="fill-slate-100 dark:fill-slate-800"
              stroke="currentColor"
              strokeWidth="2"
            />
            <text
              x="150"
              y="180"
              fontSize="120"
              fontWeight="bold"
              textAnchor="middle"
              className="fill-slate-900 dark:fill-slate-100"
              fontFamily="system-ui"
            >
              404
            </text>
            <circle cx="100" cy="100" r="8" className="fill-blue-400" />
            <circle cx="200" cy="80" r="6" className="fill-orange-400" />
            <circle cx="220" cy="150" r="5" className="fill-green-400" />
          </svg>
        </div>

        {/* Content */}
        <div className="text-center">
          {/* Main Title */}
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tighter">
            {t('pages.notFound.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 font-medium">
            {t('pages.notFound.subtitle')}
          </p>

          {/* Description */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 mb-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {t('pages.notFound.description')}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Vérifiez l'URL ou retournez à la page d'accueil.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              {t('pages.notFound.buttons.dashboard')}
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {t('pages.notFound.buttons.home')}
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {t('pages.notFound.buttons.back')}
            </button>
          </div>

          {/* Additional Help */}
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>
              {t('pages.notFound.needHelp')}{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                {t('pages.notFound.buttons.support')}
              </a>
            </p>
          </div>
        </div>

        {/* Footer Decoration */}
        <div className="mt-12 text-center text-xs text-slate-400 dark:text-slate-600">
          <p>{t('pages.notFound.errorCode')}</p>
        </div>
      </div>
    </div>
  );
}
