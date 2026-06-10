import { Package, Inbox } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: 'package' | 'inbox';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
}: EmptyStateProps) {
  const Icon = icon === 'package' ? Package : Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center mb-4">
        <Icon className="text-text-secondary" size={32} />
      </div>
      <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
