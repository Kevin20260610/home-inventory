import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, Edit2 } from 'lucide-react';
import { Card, Button, Badge, EmptyState, Select, Modal } from '@/components/ui';
import { useItemsStore } from '@/stores/itemsStore';
import { useLocationsStore } from '@/stores/locationsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { getIconByName } from '@/utils/icon';
import { Item } from '@/types';

export default function ItemsList() {
  const navigate = useNavigate();
  const items = useItemsStore((state) => state.items);
  const deleteItem = useItemsStore((state) => state.deleteItem);
  const locations = useLocationsStore((state) => state.locations);
  const categories = useCategoriesStore((state) => state.categories);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState<Item | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || item.categoryId === categoryFilter;
      const matchesLocation = !locationFilter || item.locationId === locationFilter;
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [items, search, categoryFilter, locationFilter]);

  const handleDelete = (item: Item) => {
    deleteItem(item.id);
    setDeleteModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            物品管理
          </h1>
          <p className="text-text-secondary mt-1">
            共 {items.length} 件物品
          </p>
        </div>
        <Link to="/items/new">
          <Button className="gap-2">
            <Plus size={18} />
            添加物品
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              size={18}
            />
            <input
              type="text"
              placeholder="搜索物品名称或描述..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="flex gap-4">
            <Select
              options={[
                { value: '', label: '全部分类' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-40"
            />
            <Select
              options={[
                { value: '', label: '全部位置' },
                ...locations
                  .filter((l) => l.parentId === undefined)
                  .map((l) => ({ value: l.id, label: l.name })),
              ]}
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </Card>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <EmptyState
            icon="package"
            title="没有找到物品"
            description={search || categoryFilter || locationFilter ? '尝试调整筛选条件' : '开始添加你的第一个物品'}
            action={
              !search && !categoryFilter && !locationFilter
                ? { label: '添加物品', onClick: () => navigate('/items/new') }
                : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => {
            const category = categories.find((c) => c.id === item.categoryId);
            const location = locations.find((l) => l.id === item.locationId);
            const CategoryIcon = category ? getIconByName(category.icon) : LucideIcons.Package;

            return (
              <Card
                key={item.id}
                className="p-4 group"
                hover
                onClick={() => navigate(`/items/${item.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${category?.color}20` }}
                  >
                    <CategoryIcon size={28} style={{ color: category?.color }} />
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
                        <Badge color={category.color}>{category.name}</Badge>
                      )}
                      <span className="text-xs text-text-secondary">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/items/${item.id}/edit`);
                    }}
                  >
                    <Edit2 size={14} />
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-error hover:bg-error/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal(item);
                    }}
                  >
                    <Trash2 size={14} />
                    删除
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="删除物品"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>
              取消
            </Button>
            <Button variant="danger" onClick={() => deleteModal && handleDelete(deleteModal)}>
              删除
            </Button>
          </>
        }
      >
        <p className="text-text-secondary">
          确定要删除 "{deleteModal?.name}" 吗？此操作无法撤销。
        </p>
      </Modal>
    </div>
  );
}

import * as LucideIcons from 'lucide-react';
