interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export default function Badge({ children, color = '#4A7C59', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${className}
      `}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      {children}
    </span>
  );
}
