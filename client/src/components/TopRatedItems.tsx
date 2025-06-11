import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import type { MenuItem } from '@shared/schema';

interface TopRatedItemsProps {
  onAddToCart: (item: MenuItem) => void;
}

// Mock data for top rated items - in a real app this would come from the API
const mockTopRatedItems = [
  {
    id: 1,
    name: "Salmão Grelhado com Legumes",
    rating: 4.8,
    reviewCount: 127,
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
    price: "45.90"
  },
  {
    id: 2,
    name: "Bruschetta de Tomate e Manjericão",
    rating: 4.7,
    reviewCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&h=600&fit=crop",
    price: "18.90"
  },
  {
    id: 3,
    name: "Petit Gateau",
    rating: 4.9,
    reviewCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
    price: "16.90"
  },
  {
    id: 4,
    name: "Bife Ancho Grelhado",
    rating: 4.6,
    reviewCount: 98,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
    price: "52.90"
  },
  {
    id: 5,
    name: "Spaghetti Carbonara",
    rating: 4.5,
    reviewCount: 76,
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop",
    price: "28.90"
  }
];

export function TopRatedItems({ onAddToCart }: TopRatedItemsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
  });

  const itemsPerView = 3;
  const maxIndex = Math.max(0, mockTopRatedItems.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleAddToCart = (topRatedItem: any) => {
    // Find the actual menu item by ID to ensure we have the complete data
    const menuItem = menuItems?.find(item => item.id === topRatedItem.id);
    if (menuItem) {
      onAddToCart(menuItem);
    }
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Itens Mais Avaliados
          </h2>
          <p className="text-gray-600">
            Experimente os pratos favoritos dos nossos clientes
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {mockTopRatedItems.map((item) => (
                <div
                  key={item.id}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 shadow-lg">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(item.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({item.reviewCount} avaliações)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}
                        </span>
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="bg-primary text-white hover:bg-orange-600"
                        >
                          Adicionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          {mockTopRatedItems.length > itemsPerView && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg"
                onClick={prevSlide}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        {mockTopRatedItems.length > itemsPerView && (
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}