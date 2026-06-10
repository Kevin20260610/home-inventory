import { useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { Card, Button, Input, Modal, EmptyState } from '@/components/ui';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useItemsStore } from '@/stores/itemsStore';
import { Category } from '@/types';
import { getIconByName } from '@/utils/icon';

const iconOptions = [
  'tv', 'shirt', 'book-open', 'apple', 'wrench',
  'sparkles', 'file-text', 'box',
];

const colorOptions = [
  '#4A7C59', '#E8A87C', '#C38D9E', '#85DCBA',
  '#F0A500', '#00B4D8', '#90BE6D', '#9B9B9B',
];

export default function Categories() {
  const categories = useCategoriesStore((state) => state.categories);
  const addCategory = useCategoriesStore((state) => state.addCategory);
  const updateCategory = useCategoriesStore((state) => state.updateCategory);
  const deleteCategory = useCategoriesStore((state) => state.deleteCategory);
  const items = useItemsStore((state) => state.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    icon: 'box',
    color: '#4A7C59',
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', icon: 'box', color: '#4A7C59' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (category: Category) => {
    deleteCategory(category.id);
    setDeleteTarget(null);
  };

  const getItemCount = (categoryId: string) => {
    return items.filter((item) => item.categoryId === categoryId).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            分类管理
          </h1>
          <p className="text-text-secondary mt-1">
            管理物品分类
          </p>
        </div>
        <Button className="gap-2" onClick={openAddModal}>
          <Plus size={18} />
          添加分类
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Card>
          <EmptyState
            icon="inbox"
            title="还没有分类"
            description="添加第一个分类开始管理"
            action={{ label: '添加分类', onClick: openAddModal }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => {
            const IconComponent = getIconByName(category.icon);
            const itemCount = getItemCount(category.id);

            return (
              <Card
                key={category.id}
                className="p-4 group"
                hover
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <IconComponent size={28} style={{ color: category.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate">
                      {category.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {itemCount} 件物品
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => openEditModal(category)}
                  >
                    <Edit2 size={14} />
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-error hover:bg-error/10"
                    onClick={() => setDeleteTarget(category)}
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? '编辑分类' : '添加分类'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>保存</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="分类名称"
            placeholder="例如：电器、衣物"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              图标
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((iconName) => {
                const IconComponent = getIconByName(iconName);
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconName })}
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center transition-all
                      ${formData.icon === iconName
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'hover:bg-background'
                      }
                    `}
                    style={{ backgroundColor: `${formData.color}20` }}
                  >
                    <IconComponent size={20} style={{ color: formData.color }} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              颜色
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`
                    w-8 h-8 rounded-full transition-all
                    ${formData.color === color
                      ? 'ring-2 ring-offset-2 ring-primary'
                      : 'hover:scale-110'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="删除分类"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              取消
            </Button>
            <Button variant="danger" onClick={() => deleteTarget && handleDelete(deleteTarget)}>
              删除
            </Button>
          </>
        }
      >
        <p className="text-text-secondary">
          确定要删除 "{deleteTarget?.name}" 分类吗？此操作无法撤销。
        </p>
      </Modal>
    </div>
  );
}
