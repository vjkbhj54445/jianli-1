'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from '@/components/ui/drawer';
import { getOrCreateAnonId, clearProjectData, getProjectStorageKeys } from '@/infra/storage';
import { getPrivacySettings, setTelemetryEnabled, isTelemetryEnabled } from '@/infra/privacy';
import { useMediaQuery } from '@/hooks/use-media-query';
import { trackEvent } from '@/lib/analytics';

export default function PrivacySettings() {
  const [anonId, setAnonId] = useState<string>('');
  const [telemetryEnabled, setTelemetryState] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setIsClient(true);
    setAnonId(getOrCreateAnonId());
    setTelemetryState(isTelemetryEnabled());
  }, []);

  const handleTelemetryChange = (enabled: boolean) => {
    setTelemetryState(enabled);
    setTelemetryEnabled(enabled);
    trackEvent('click_privacy_setting', { action: enabled ? 'enable' : 'disable' });
  };

  const handleClearData = () => {
    clearProjectData();
    setAnonId(getOrCreateAnonId()); // 重新生成新的匿名ID
    setTelemetryState(isTelemetryEnabled());
    trackEvent('click_clear_data');
    window.location.reload(); // 刷新页面以更新状态
  };

  const handleResetAnonId = () => {
    clearProjectData();
    setAnonId(getOrCreateAnonId());
    trackEvent('click_reset_anon_id');
  };

  if (!isClient) {
    return null;
  }

  const content = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="telemetry-switch" className="text-base">
            遥测数据
          </Label>
          <Switch
            id="telemetry-switch"
            checked={telemetryEnabled}
            onCheckedChange={handleTelemetryChange}
          />
        </div>
        <p className="text-sm text-gray-600">
          启用后可以发送匿名使用数据以帮助我们改进产品。默认关闭。
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-base">匿名ID</div>
        <div className="p-3 bg-gray-100 rounded-md break-all font-mono text-sm">
          {anonId}
        </div>
        <p className="text-sm text-gray-600">
          此ID用于标识您的设备，不会关联到您的真实身份。
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-base">数据清除</div>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleClearData}
          >
            清除所有项目数据
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleResetAnonId}
          >
            重置匿名ID
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          您可以清除本项目保存的所有本地数据，包括匿名ID和设置。
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-base">当前存储的键值</div>
        <div className="p-3 bg-gray-100 rounded-md max-h-32 overflow-y-auto text-sm">
          {getProjectStorageKeys().map((key, index) => (
            <div key={index} className="font-mono">{key}</div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">隐私设置</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>隐私设置</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">隐私设置</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>隐私设置</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  );
}