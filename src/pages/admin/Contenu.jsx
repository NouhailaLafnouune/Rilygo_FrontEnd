import React from "react";
import { useTranslation } from 'react-i18next';

export default function ContentPlaceholder() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">{t('pages.content.title')}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {t('pages.content.subtitle')}
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex min-h-[180px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-base font-semibold text-slate-900">
              {t('pages.content.comingSoon')}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {t('pages.content.soon')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
