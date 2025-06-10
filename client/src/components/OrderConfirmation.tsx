import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { OrderResponse } from '@/lib/types';

interface OrderConfirmationProps {
  isOpen: boolean;
  orderData: OrderResponse | null;
  onClose: () => void;
}

export function OrderConfirmation({ isOpen, orderData, onClose }: OrderConfirmationProps) {
  if (!isOpen || !orderData) return null;

  return (
    <div className="order-confirmation">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-secondary mb-2">Pedido Confirmado!</h3>
          <p className="text-gray-600 mb-4">Seu pedido foi recebido e está sendo preparado.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">Número do pedido:</div>
            <div className="font-mono text-lg font-semibold">{orderData.orderNumber}</div>
          </div>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p><strong>Tempo estimado:</strong> {orderData.estimatedTime}</p>
            <p><strong>Status:</strong> {orderData.status === 'preparing' ? 'Preparando' : orderData.status}</p>
            <p><strong>Total:</strong> R$ {parseFloat(orderData.total).toFixed(2).replace('.', ',')}</p>
          </div>
          <Button
            onClick={onClose}
            className="w-full bg-primary text-white hover:bg-orange-600"
          >
            Continuar Navegando
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
