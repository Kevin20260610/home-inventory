import { Package, MapPin, Tags, Clock } from 'lucide-react';
import { Card } from '@/components/ui';
import { useItemsStore } from '@/stores/itemsStore';
import { useLocationsStore } from '@/stores/locationsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui';
import { getIconByName } from '@/utils/icon';

export default function Dashboard() {
  const items = useItemsStore((state) => state.items);
  const locations = useLocationsStore((state) => state.locations);
  const categories = useCategoriesStore((state) => state.categories);

  const rootLocations = locations.filter((l) => l.parentId === undefined);
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: '物品总数',
      value: items.length,
      icon: Package,
      color: 'bg-primary',
    },
    {
      label: '房间数',
      value: rootLocations.length,
      icon: MapPin,
      color: 'bg-secondary',
    },
    {
      label: '分类数',
      value: categories.length,
      icon: Tags,
      color: 'bg-accent',
    },
    {
      label: '最近添加',
      value: recentItems.length,
      icon: Clock,
      color: 'bg-warning',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">
          欢迎回家
        </h1>
        <p className="text-text-secondary mt-1">
          今天是 {new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="p-6"
            hover
          >
            <div
              className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}
            >
              <stat.icon className="text-white" size={24} />
            </div>
            <p className="text-3xl font-display font-bold text-text-primary">
              {stat.value}
            </p>
            <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Recent Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-text-primary">
            最近添加
          </h2>
          <Link
            to="/items"
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            查看全部
          </Link>
        </div>

        {recentItems.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-text-secondary">还没有添加任何物品</p>
            <Link
              to="/items/new"
              className="inline-block mt-4 text-primary hover:text-primary/80 font-medium"
            >
              立即添加
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentItems.map((item) => {
              const category = categories.find((c) => c.id === item.categoryId);
              const location = locations.find((l) => l.id === item.locationId);
              const CategoryIcon = category ? getIconByName(category.icon) : Package;

              return (
                <Link to={`/items/${item.id}`} key={item.id}>
                  <Card className="p-4" hover>
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${category?.color}20` }}
                      >
                        <CategoryIcon
                          size={24}
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
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-display font-semibold text-text-primary mb-4">
          快捷操作
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/items/new">
            <Card className="p-4 text-center" hover>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Package className="text-primary" size={24} />
              </div>
              <p className="text-sm font-medium text-text-primary">添加物品</p>
            </Card>
          </Link>
          <Link to="/locations">
            <Card className="p-4 text-center" hover>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="text-secondary" size={24} />
              </div>
              <p className="text-sm font-medium text-text-primary">管理位置</p>
            </Card>
          </Link>
          <Link to="/categories">
            <Card className="p-4 text-center" hover>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Tags className="text-accent" size={24} />
              </div>
              <p className="text-sm font-medium text-text-primary">管理分类</p>
            </Card>
          </Link>
          <Link to="/search">
            <Card className="p-4 text-center" hover>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="text-warning" size={24} />
              </div>
              <p className="text-sm font-medium text-text-primary">搜索物品</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
