import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, MapPin, Tags, Calendar, Home, Building, Armchair } from 'lucide-react';
import { Card, Button, Badge, EmptyState } from '@/components/ui';
import { useItemsStore } from '@/stores/itemsStore';
import { useLocationsStore } from '@/stores/locationsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { getIconByName } from '@/utils/icon';
import { LocationType } from '@/types';
import { LucideIcon } from 'lucide-react';

const locationTypeIcons: Record<LocationType, LucideIcon> = {
  house: Home,
  room: Building,
  cabinet: Armchair,
  drawer: Armchair,
  shelf: Armchair,
  box: Armchair,
};

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const items = useItemsStore((state) => state.items);
  const deleteItem = useItemsStore((state) => state.deleteItem);
  const locations = useLocationsStore((state) => state.locations);
  const categories = useCategoriesStore((state) => state.categories);

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="animate-fade-in">
        <Card>
          <EmptyState
            icon="package"
            title="物品不存在"
            description="该物品可能已被删除"
            action={{ label: '返回列表', onClick: () => navigate('/items') }}
          />
        </Card>
      </div>
    );
  }

  const category = categories.find((c) => c.id === item.categoryId);
  const location = locations.find((l) => l.id === item.locationId);
  const CategoryIcon = category ? getIconByName(category.icon) : MapPin;

  const getLocationPath = () => {
    const path: { name: string; type: LocationType }[] = [];
    let currentLocation = location;
    while (currentLocation) {
      path.unshift({ name: currentLocation.name, type: currentLocation.type });
      currentLocation = locations.find((l) => l.id === currentLocation?.parentId);
    }
    return path;
  };

  const handleDelete = () => {
    deleteItem(item.id);
    navigate('/items');
  };

  const locationPath = getLocationPath();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/items"
          className="p-2 rounded-xl hover:bg-surface transition-colors"
        >
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-text-primary">
            {item.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/items/${item.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit2 size={16} />
              编辑
            </Button>
          </Link>
          <Button variant="danger" className="gap-2" onClick={handleDelete}>
            <Trash2 size={16} />
            删除
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${category?.color}20` }}
              >
                <CategoryIcon size={40} style={{ color: category?.color }} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-display font-semibold text-text-primary">
                  {item.name}
                </h2>
                {item.description && (
                  <p className="text-text-secondary mt-2">{item.description}</p>
                )}
                <div className="flex items-center gap-3 mt-4">
                  {category && (
                    <Badge color={category.color} className="text-sm px-3 py-1">
                      {category.name}
                    </Badge>
                  )}
                  <span className="text-text-secondary">
                    数量: {item.quantity}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Location Info */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2">
              <MapPin size={16} />
              存放位置
            </h3>
            <div className="space-y-2">
              {locationPath.map((level, index) => {
                const IconComponent = locationTypeIcons[level.type];
                return (
                  <div key={index} className="flex items-center gap-3">
                    {index > 0 && (
                      <span className="text-text-secondary/50 ml-4">↓</span>
                    )}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--background)' }}
                    >
                      <IconComponent size={16} className="text-text-secondary" />
                    </div>
                    <span className="text-text-primary font-medium">
                      {level.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2">
              <Calendar size={16} />
              添加时间
            </h3>
            <p className="text-text-primary">
              {new Date(item.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              {new Date(item.createdAt).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2">
              <Tags size={16} />
              分类信息
            </h3>
            {category && (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <CategoryIcon size={20} style={{ color: category.color }} />
                </div>
                <div>
                  <p className="font-medium text-text-primary">{category.name}</p>
                  <p className="text-xs text-text-secondary">分类</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
