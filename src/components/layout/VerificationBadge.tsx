import React from 'react';
import { VerificationStatus } from '../../types/campus';
import { CheckCircle2, AlertCircle, HelpCircle, Sparkles } from 'lucide-react';

interface Props {
  status: VerificationStatus;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const VerificationBadge: React.FC<Props> = ({
  status,
  size = 'md',
  showLabel = true,
}) => {
  const getDetails = () => {
    switch (status) {
      case 'verified':
        return {
          label: 'Verified Audit',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
          tooltip: 'Physically inspected on-site by campus accessibility auditors.',
        };
      case 'approximate':
        return {
          label: 'Approximate Survey',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertCircle className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
          tooltip: 'Derived from official NAAC site-plans; exact coordinates need on-ground verification.',
        };
      case 'unverified':
        return {
          label: 'Unverified',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <HelpCircle className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
          tooltip: 'Unverified report or placeholder. Exercise caution.',
        };
      case 'demo':
      default:
        return {
          label: 'Demonstration Data',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Sparkles className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
          tooltip: 'Simulated demonstration item to illustrate system functionality.',
        };
    }
  };

  const { label, bg, icon, tooltip } = getDetails();

  return (
    <span
      title={tooltip}
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full transition-colors ${bg} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {icon}
      {showLabel && <span>{label}</span>}
    </span>
  );
};
