import { useState } from 'react';
import { Search, ShoppingCart, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminSettingsModal } from './AdminSettingsModal';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  cartItemCount: number;
}

export function Header({ searchQuery, onSearchChange, onCartClick, cartItemCount }: HeaderProps) {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAdminModalOpen(true)}
              className="text-gray-600 hover:text-primary"
            >
              <Settings className="h-5 w-5" />
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
    </header>
  );
}
