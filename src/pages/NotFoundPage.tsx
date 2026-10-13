import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-purple-100 flex items-center justify-center mx-auto text-purple-800">
        <Compass className="w-8 h-8 animate-spin" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">404 - Off Route</h1>
        <p className="text-xs text-slate-500">
          The requested campus page or coordinate could not be found.
        </p>
      </div>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Return to Campus Home</span>
        </Link>
      </div>
    </div>
  );
};
