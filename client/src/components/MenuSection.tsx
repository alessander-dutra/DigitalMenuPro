import type { MenuItem } from '@shared/schema';
import { MenuItemCard } from './MenuItemCard';

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const categoryTitles: Record<string, string> = {
  entradas: 'Entradas',
  principais: 'Pratos Principais',
  massas: 'Massas',
  sobremesas: 'Sobremesas',
  bebidas: 'Bebidas',
};

export function MenuSection({ title, items, onAddToCart }: MenuSectionProps) {
  if (items.length === 0) return null;

  // Get the display name for the category
  const displayTitle = categoryTitles[title] || title;

  return (
    <section className="mb-12 scroll-mt-36" id={`section-${title}`}>
      <div className="bg-gradient-to-r from-orange-50 to-transparent p-4 rounded-lg mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {displayTitle}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
