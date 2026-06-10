import { useState } from 'react';
import { Plus, Edit2, Trash2, Home, Building, Armchair, LucideIcon } from 'lucide-react';
import { Card, Button, Input, Select, Modal, EmptyState } from '@/components/ui';
import { useLocationsStore } from '@/stores/locationsStore';
import { useItemsStore } from '@/stores/itemsStore';
import { Location, LocationType } from '@/types';

const locationTypeLabels: Record<LocationType, string> = {
  house: '住宅',
  room: '房间',
  cabinet: '柜子',
  drawer: '抽屉',
  shelf: '架子',
  box: '箱子',
};

const locationTypeIcons: Record<LocationType, LucideIcon> = {
  house: Home,
  room: Building,
  cabinet: Armchair,
  drawer: Armchair,
  shelf: Armchair,
  box: Armchair,
};

export default function Locations() {
  const locations = useLocationsStore((state) => state.locations);
  const addLocation = useLocationsStore((state) => state.addLocation);
  const updateLocation = useLocationsStore((state) => state.updateLocation);
  const deleteLocation = useLocationsStore((state) => state.deleteLocation);
  const getHouses = useLocationsStore((state) => state.getHouses);
  const getRooms = useLocationsStore((state) => state.getRooms);
  const items = useItemsStore((state) => state.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'house' as LocationType,
    parentId: undefined as string | undefined,
    color: '#4A7C59',
  });

  const houses = getHouses();

  const openAddModal = (parentId?: string, type: LocationType = 'house') => {
    setEditingLocation(null);
    setFormData({ name: '', type, parentId, color: '#4A7C59' });
    setIsModalOpen(true);
  };

  const openEditModal = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      type: location.type,
      parentId: location.parentId,
      color: location.color,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingLocation) {
      updateLocation(editingLocation.id, formData);
    } else {
      addLocation(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (location: Location) => {
    deleteLocation(location.id);
    setDeleteTarget(null);
  };

  const getItemCount = (locationId: string) => {
    return items.filter((item) => item.locationId === locationId).length;
  };

  const getChildItemCount = (locationId: string) => {
    const directCount = getItemCount(locationId);
    const childLocations = locations.filter((l) => l.parentId === locationId);
    const childCount = childLocations.reduce((sum, child) => sum + getChildItemCount(child.id), 0);
    return directCount + childCount;
  };

  const renderLocation = (location: Location, depth = 0) => {
    const childLocations = locations.filter((l) => l.parentId === location.id);
    const itemCount = getChildItemCount(location.id);
    const IconComponent = locationTypeIcons[location.type];

    return (
      <div key={location.id} className="animate-slide-up" style={{ animationDelay: `${depth * 50}ms` }}>
        <Card className="p-4 flex items-center gap-4 group" hover>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${location.color}20` }}
          >
            <IconComponent size={24} color={location.color} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-text-primary truncate">
              {location.name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-text-secondary">
                {locationTypeLabels[location.type]}
              </span>
              <span className="text-xs text-text-secondary">
                {itemCount} 件物品
              </span>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {location.type === 'house' && (
              <Button variant="ghost" size="sm" onClick={() => openAddModal(location.id, 'room')}>
                <Plus size={16} />
              </Button>
            )}
            {location.type === 'room' && (
              <Button variant="ghost" size="sm" onClick={() => openAddModal(location.id, 'cabinet')}>
                <Plus size={16} />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => openEditModal(location)}>
              <Edit2 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-error hover:bg-error/10"
              onClick={() => setDeleteTarget(location)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </Card>

        {childLocations.length > 0 && (
          <div className="ml-8 mt-2 space-y-2 border-l-2 border-border pl-4">
            {childLocations.map((child) => renderLocation(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Get available parent types based on what we're adding
  const getAvailableTypes = () => {
    if (!editingLocation) {
      return [
        { value: 'house', label: '住宅' },
        { value: 'room', label: '房间' },
        { value: 'cabinet', label: '柜子' },
        { value: 'drawer', label: '抽屉' },
        { value: 'shelf', label: '架子' },
        { value: 'box', label: '箱子' },
      ];
    }
    return [
      { value: 'house', label: '住宅' },
      { value: 'room', label: '房间' },
      { value: 'cabinet', label: '柜子' },
      { value: 'drawer', label: '抽屉' },
      { value: 'shelf', label: '架子' },
      { value: 'box', label: '箱子' },
    ];
  };

  // Get available parents based on selected type
  const getAvailableParents = () => {
    if (formData.type === 'house') {
      return [{ value: '', label: '无（顶级）' }];
    }
    if (formData.type === 'room') {
      return [
        { value: '', label: '无（顶级）' },
        ...houses.map((h) => ({ value: h.id, label: h.name })),
      ];
    }
    // For furniture, show rooms only
    const rooms = locations.filter((l) => l.type === 'room');
    return rooms.map((r) => ({ value: r.id, label: r.name }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            位置管理
          </h1>
          <p className="text-text-secondary mt-1">
            管理住宅、房间和家具位置
          </p>
        </div>
        <Button className="gap-2" onClick={() => openAddModal()}>
          <Plus size={18} />
          添加位置
        </Button>
      </div>

      {/* Locations Tree */}
      {houses.length === 0 ? (
        <Card>
          <EmptyState
            icon="inbox"
            title="还没有位置"
            description="添加第一个住宅开始管理"
            action={{ label: '添加住宅', onClick: () => openAddModal() }}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {houses.map((house) => renderLocation(house))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLocation ? '编辑位置' : '添加位置'}
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
            label="位置名称"
            placeholder="例如：自住房、客厅、电视柜"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            label="位置类型"
            options={getAvailableTypes()}
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as LocationType, parentId: undefined })
            }
          />
          {formData.type !== 'house' && (
            <Select
              label="所属位置"
              options={getAvailableParents()}
              value={formData.parentId || ''}
              onChange={(e) =>
                setFormData({ ...formData, parentId: e.target.value || undefined })
              }
            />
          )}
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="删除位置"
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
          确定要删除 "{deleteTarget?.name}" 吗？此操作无法撤销。
        </p>
      </Modal>
    </div>
  );
}
