import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface rounded-2xl border border-border shadow-sm
        ${hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
