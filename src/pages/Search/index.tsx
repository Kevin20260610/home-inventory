import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Package } from 'lucide-react';
import { Card, Badge, EmptyState } from '@/components/ui';
import { useItemsStore } from '@/stores/itemsStore';
import { useLocationsStore } from '@/stores/locationsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { getIconByName } from '@/utils/icon';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const items = useItemsStore((state) => state.items);
  const locations = useLocationsStore((state) => state.locations);
  const categories = useCategoriesStore((state) => state.categories);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(lowerQuery);
      const matchesDesc = item.description.toLowerCase().includes(lowerQuery);
      const category = categories.find((c) => c.id === item.categoryId);
      const matchesCategory = category?.name.toLowerCase().includes(lowerQuery);
      const location = locations.find((l) => l.id === item.locationId);
      const matchesLocation = location?.name.toLowerCase().includes(lowerQuery);

      return matchesName || matchesDesc || matchesCategory || matchesLocation;
    });
  }, [query, items, categories, locations]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">
          搜索物品
        </h1>
        <p className="text-text-secondary mt-1">
          输入关键词查找物品
        </p>
      </div>

      {/* Search Input */}
      <Card className="p-4">
        <div className="relative">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
            size={20}
          />
          <input
            type="text"
            placeholder="搜索物品名称、描述、分类或位置..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-4 py-3 text-lg rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </Card>

      {/* Results */}
      {query.trim() === '' ? (
        <Card className="p-12 text-center">
          <SearchIcon className="mx-auto text-text-secondary mb-4" size={48} />
          <p className="text-text-secondary">
            输入关键词开始搜索
          </p>
        </Card>
      ) : results.length === 0 ? (
        <Card>
          <EmptyState
            icon="package"
            title="没有找到结果"
            description={`没有找到与 "${query}" 相关的物品`}
          />
        </Card>
      ) : (
        <div>
          <p className="text-sm text-text-secondary mb-4">
            找到 {results.length} 个相关物品
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => {
              const category = categories.find((c) => c.id === item.categoryId);
              const location = locations.find((l) => l.id === item.locationId);
              const CategoryIcon = category ? getIconByName(category.icon) : Package;

              return (
                <Card
                  key={item.id}
                  className="p-4 cursor-pointer"
                  hover
                  onClick={() => navigate(`/items/${item.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${category?.color}20` }}
                    >
                      <CategoryIcon
                        size={28}
                        style={{ color: category?.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text-primary truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-text-secondary truncate">
                        {location?.name || '未指定位置'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {category && (
                          <Badge color={category.color}>
                            {category.name}
                          </Badge>
                        )}
                        <span className="text-xs text-text-secondary">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
