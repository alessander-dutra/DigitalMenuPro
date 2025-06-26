import { useState } from 'react';
import { Search, ShoppingCart, Settings, Clock, CreditCard, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdminSettingsModal } from './AdminSettingsModal';
import { useQuery } from '@tanstack/react-query';
import type { StoreSettings } from '@shared/schema';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  cartItemCount: number;
}

export function Header({ searchQuery, onSearchChange, onCartClick, cartItemCount }: HeaderProps) {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch store settings for status
  const { data: storeSettings } = useQuery<StoreSettings>({
    queryKey: ['/api/store-settings'],
  });

  // Check if store is open based on current time
  const isStoreOpen = () => {
    if (!storeSettings?.openingTime || !storeSettings?.closingTime) return true;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const [openHour, openMinute] = storeSettings.openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = storeSettings.closingTime.split(':').map(Number);
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const storeOpen = isStoreOpen();

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      setIsAdminModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogin = () => {
    // Senha padrão para admin (em um sistema real seria mais seguro)
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      setIsAdminModalOpen(true);
      setAdminPassword('');
    } else {
      alert('Senha incorreta! Use: admin123');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Store Status Bar */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {storeSettings?.openingTime && storeSettings?.closingTime 
                    ? `${storeSettings.openingTime} - ${storeSettings.closingTime}`
                    : 'Horário: 24h'
                  }
                </span>
                <Badge variant={storeOpen ? "default" : "destructive"} className="ml-2">
                  {storeOpen ? "ABERTO" : "FECHADO"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Aceitamos:</span>
                <div className="flex space-x-1">
                  {storeSettings?.paymentMethods?.includes('card') && (
                    <Badge variant="outline" className="text-xs">Cartão</Badge>
                  )}
                  {storeSettings?.paymentMethods?.includes('pix') && (
                    <Badge variant="outline" className="text-xs">PIX</Badge>
                  )}
                  {storeSettings?.paymentMethods?.includes('cash') && (
                    <Badge variant="outline" className="text-xs">Dinheiro</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAdminAccess}
              className="text-gray-600 hover:text-primary"
              title={isAuthenticated ? "Configurações Administrativas" : "Login Admin"}
            >
              {isAuthenticated ? <Settings className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </Button>
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">Sabor Digital</h1>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-600">Restaurante Gourmet</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar pratos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          {/* Cart Button */}
          <Button
            onClick={onCartClick}
            className="relative bg-primary text-white hover:bg-orange-600"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>{cartItemCount}</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <AdminSettingsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Acesso Administrativo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha do Administrador
              </label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Digite a senha de administrador"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsLoginModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleLogin} className="bg-primary text-white">
                Entrar
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Senha padrão: admin123
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
