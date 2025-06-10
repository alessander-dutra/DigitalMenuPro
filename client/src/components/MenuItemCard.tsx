import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { MenuItem } from '@shared/schema';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(item);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  return (
    <Card className="menu-item-card">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-secondary mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={!item.available || isAdding}
            className={`add-to-cart-btn ${
              isAdding ? 'bg-green-500 hover:bg-green-600' : ''
            }`}
          >
            {isAdding ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Adicionado!
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
