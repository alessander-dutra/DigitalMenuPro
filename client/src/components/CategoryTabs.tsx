import { Leaf, Utensils, UtensilsCrossed, IceCream, Wine } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'entradas', name: 'Entradas', icon: Leaf },
  { id: 'principais', name: 'Pratos Principais', icon: Utensils },
  { id: 'massas', name: 'Massas', icon: UtensilsCrossed },
  { id: 'sobremesas', name: 'Sobremesas', icon: IceCream },
  { id: 'bebidas', name: 'Bebidas', icon: Wine },
];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <nav className="bg-white border-b sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto py-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => onCategoryChange(category.id)}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium ${
                  isActive 
                    ? 'category-tab-active' 
                    : 'category-tab-inactive'
                }`}
              >
                <IconComponent className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
