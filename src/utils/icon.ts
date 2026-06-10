import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  tv: LucideIcons.Tv,
  shirt: LucideIcons.Shirt,
  'book-open': LucideIcons.BookOpen,
  apple: LucideIcons.Apple,
  wrench: LucideIcons.Wrench,
  sparkles: LucideIcons.Sparkles,
  'file-text': LucideIcons.FileText,
  box: LucideIcons.Box,
};

export function getIconByName(name: string): LucideIcon {
  return iconMap[name] || LucideIcons.Package;
}
