import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/CategoryTabs';
import { MenuSection } from '@/components/MenuSection';
import { CartOverlay } from '@/components/CartOverlay';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { TopRatedItems } from '@/components/TopRatedItems';
import { ReviewModal } from '@/components/ReviewModal';
import { Footer } from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { Skeleton } from '@/components/ui/skeleton';
import type { MenuItem, StoreSettings } from '@shared/schema';
import type { OrderResponse } from '@/lib/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('entradas');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    menuItem: MenuItem | null;
  }>({ isOpen: false, menuItem: null });
  const [orderConfirmation, setOrderConfirmation] = useState<{
    isOpen: boolean;
    data: OrderResponse | null;
  }>({ isOpen: false, data: null });

  const {
    cartItems,
    isCartOpen,
    addToCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    getTotalItems,
    getSubtotal,
    getCartForCheckout,
  } = useCart();

  const { data: menuItems, isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
  });

  const { data: storeSettings } = useQuery<StoreSettings>({
    queryKey: ['/api/store-settings'],
  });

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    
    if (!searchQuery.trim()) return menuItems;
    
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [menuItems, searchQuery]);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    
    filteredItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    
    return grouped;
  }, [filteredItems]);

  // Auto-scroll to category when activeCategory changes
  useEffect(() => {
    if (activeCategory && !searchQuery) {
      const element = document.getElementById(`section-${activeCategory}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }
  }, [activeCategory, searchQuery]);

  const handleProceedToCheckout = () => {
    closeCart();
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (orderData: OrderResponse) => {
    setIsCheckoutOpen(false);
    setOrderConfirmation({ isOpen: true, data: orderData });
    clearCart();
  };

  const handleCloseOrderConfirmation = () => {
    setOrderConfirmation({ isOpen: false, data: null });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar menu</h2>
          <p className="text-gray-600">Não foi possível carregar os itens do menu. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={openCart}
        cartItemCount={getTotalItems()}
      />
      
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary">
              Resultados para "{searchQuery}"
            </h2>
            <p className="text-gray-600 mt-2">
              {filteredItems.length} {filteredItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-12">
            {['entradas', 'principais', 'massas', 'sobremesas', 'bebidas'].map(category => (
              <div key={category} className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-10 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          // Show filtered results
          filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuSection
                  key={item.id}
                  title={item.category}
                  items={[item]}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum item encontrado para sua busca.</p>
            </div>
          )
        ) : (
          // Show all categories
          ['entradas', 'principais', 'massas', 'sobremesas', 'bebidas'].map(category => (
            itemsByCategory[category] ? (
              <MenuSection
                key={category}
                title={category}
                items={itemsByCategory[category]}
                onAddToCart={addToCart}
              />
            ) : null
          ))
        )}
      </main>

      {/* Seção de Itens Mais Avaliados */}
      <TopRatedItems onAddToCart={addToCart} />

      {/* Rodapé */}
      <Footer />

      <CartOverlay
        isOpen={isCartOpen}
        cartItems={cartItems}
        onClose={closeCart}
        onUpdateQuantity={updateQuantity}
        onProceedToCheckout={handleProceedToCheckout}
        subtotal={getSubtotal()}
        checkoutEnabled={storeSettings?.allowCheckout === 1}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cartItems={cartItems}
        subtotal={getSubtotal()}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        getCartForCheckout={getCartForCheckout}
      />

      <OrderConfirmation
        isOpen={orderConfirmation.isOpen}
        orderData={orderConfirmation.data}
        onClose={handleCloseOrderConfirmation}
      />

      <ReviewModal
        isOpen={reviewModal.isOpen}
        menuItem={reviewModal.menuItem}
        onClose={() => setReviewModal({ isOpen: false, menuItem: null })}
      />
    </div>
  );
}
