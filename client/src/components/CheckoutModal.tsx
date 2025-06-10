import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { CartItem, CheckoutData, OrderResponse } from '@/lib/types';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  subtotal: number;
  onClose: () => void;
  onOrderSuccess: (order: OrderResponse) => void;
  getCartForCheckout: () => Array<{ menuItemId: number; quantity: number }>;
}

export function CheckoutModal({
  isOpen,
  cartItems,
  subtotal,
  onClose,
  onOrderSuccess,
  getCartForCheckout
}: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    addressNumber: '',
    complement: '',
    paymentMethod: 'card' as 'card' | 'pix' | 'cash',
  });
  const { toast } = useToast();

  if (!isOpen) return null;

  const deliveryFee = deliveryType === 'delivery' ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const checkoutData: CheckoutData = {
        ...formData,
        deliveryType,
        items: getCartForCheckout(),
      };

      // Remove empty address fields if pickup
      if (deliveryType === 'pickup') {
        delete checkoutData.address;
        delete checkoutData.addressNumber;
        delete checkoutData.complement;
      }

      const response = await apiRequest('POST', '/api/orders', checkoutData);
      const orderData = await response.json();

      onOrderSuccess(orderData);
      
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        addressNumber: '',
        complement: '',
        paymentMethod: 'card',
      });
      setDeliveryType('pickup');
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erro no checkout",
        description: "Não foi possível finalizar o pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-modal">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Finalizar Pedido</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-secondary">Informações do Cliente</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nome Completo</Label>
                  <Input
                    id="customerName"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Telefone</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customerEmail">E-mail</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>
            </div>

            {/* Delivery Options */}
            <div className="space-y-4">
              <h4 className="font-medium text-secondary">Opções de Entrega</h4>
              <RadioGroup value={deliveryType} onValueChange={(value: 'delivery' | 'pickup') => setDeliveryType(value)}>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                    <div className="font-medium">Entrega</div>
                    <div className="text-sm text-gray-500">Taxa: R$ 5,00 • Tempo: 30-45 min</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                    <div className="font-medium">Retirada no Local</div>
                    <div className="text-sm text-gray-500">Grátis • Tempo: 15-20 min</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Address (shown when delivery is selected) */}
            {deliveryType === 'delivery' && (
              <div className="space-y-4">
                <h4 className="font-medium text-secondary">Endereço de Entrega</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      required={deliveryType === 'delivery'}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressNumber">Número</Label>
                    <Input
                      id="addressNumber"
                      value={formData.addressNumber}
                      onChange={(e) => setFormData({ ...formData, addressNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={formData.complement}
                      onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-4">
              <h4 className="font-medium text-secondary">Forma de Pagamento</h4>
              <RadioGroup value={formData.paymentMethod} onValueChange={(value: 'card' | 'pix' | 'cash') => setFormData({ ...formData, paymentMethod: value })}>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Cartão de Crédito/Débito</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="cursor-pointer">PIX</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">Dinheiro</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-secondary">Resumo do Pedido</h4>
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxa de entrega:</span>
                <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white hover:bg-orange-600"
            >
              {isSubmitting ? (
                'Processando...'
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirmar Pedido
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
