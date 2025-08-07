import React, { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ModuleLoadingSkeleton } from './ModuleLoadingSkeleton';

interface ModuleRendererProps {
  activeModule: string;
  user: any;
  moduleComponents: Record<string, React.ComponentType<any>>;
}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({
  activeModule,
  user,
  moduleComponents
}) => {
  const Component = moduleComponents[activeModule as keyof typeof moduleComponents];

  if (!Component) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Módulo no encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          El módulo "{activeModule}" no está disponible o aún no ha sido implementado.
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">
            Error al cargar el módulo
          </h3>
          <p className="text-red-600 dark:text-red-400 text-sm">
            Ha ocurrido un error al cargar el módulo "{activeModule}". 
            Por favor, recarga la página o contacta al soporte técnico.
          </p>
        </div>
      }
    >
      <Suspense fallback={<ModuleLoadingSkeleton />}>
        <Component user={user} />
      </Suspense>
    </ErrorBoundary>
  );
};