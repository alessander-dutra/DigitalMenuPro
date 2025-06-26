import { X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/lib/types';

interface CartOverlayProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (menuItemId: number, quantity: number) => void;
  onProceedToCheckout: () => void;
  subtotal: number;
  checkoutEnabled?: boolean;
}

export function CartOverlay({
  isOpen,
  cartItems,
  onClose,
  onUpdateQuantity,
  onProceedToCheckout,
  subtotal,
  checkoutEnabled = true
}: CartOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-panel">
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold">Seu Pedido</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Seu carrinho está vazio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center space-x-4 py-4 border-b">
                    <img
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-secondary">{item.menuItem.name}</h4>
                      <p className="text-sm text-gray-500">
                        R$ {parseFloat(item.menuItem.price).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full bg-primary text-white hover:bg-orange-600"
                        onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">
                  R$ {subtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <Button
                onClick={checkoutEnabled ? onProceedToCheckout : undefined}
                disabled={!checkoutEnabled}
                className={`w-full ${checkoutEnabled 
                  ? 'bg-primary text-white hover:bg-orange-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {checkoutEnabled ? 'Finalizar Pedido' : 'Checkout Desabilitado (Modo Visualização)'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
