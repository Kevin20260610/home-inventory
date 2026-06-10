import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('home-inventory-install-dismissed');

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      if (!dismissed) {
        setVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setVisible(false);
      setInstallEvent(null);
    }
  };

  const handleClose = () => {
    localStorage.setItem('home-inventory-install-dismissed', 'true');
    setVisible(false);
  };

  if (!visible || !installEvent) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 lg:hidden animate-slide-up">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Smartphone className="text-primary" size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-text-primary">安装到手机桌面</p>
            <p className="mt-1 text-sm text-text-secondary">
              像手机 App 一样打开，离线也能查看已缓存页面。
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="gap-2" onClick={handleInstall}>
                <Download size={16} />
                安装
              </Button>
              <Button size="sm" variant="ghost" onClick={handleClose}>
                稍后
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-text-secondary hover:bg-background"
            aria-label="关闭安装提示"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
