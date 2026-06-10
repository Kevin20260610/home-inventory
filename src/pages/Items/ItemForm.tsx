import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, Button, Input, Select } from '@/components/ui';
import { useItemsStore } from '@/stores/itemsStore';
import { useLocationsStore } from '@/stores/locationsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';

export default function ItemForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const items = useItemsStore((state) => state.items);
  const addItem = useItemsStore((state) => state.addItem);
  const updateItem = useItemsStore((state) => state.updateItem);
  const locations = useLocationsStore((state) => state.locations);
  const getHouses = useLocationsStore((state) => state.getHouses);
  const getRooms = useLocationsStore((state) => state.getRooms);
  const categories = useCategoriesStore((state) => state.categories);

  const existingItem = isEditing ? items.find((i) => i.id === id) : undefined;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    locationId: '',
    quantity: 1,
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingItem) {
      setFormData({
        name: existingItem.name,
        description: existingItem.description,
        categoryId: existingItem.categoryId,
        locationId: existingItem.locationId,
        quantity: existingItem.quantity,
        imageUrl: existingItem.imageUrl,
      });
    }
  }, [existingItem]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = '请输入物品名称';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = '请选择分类';
    }
    if (!formData.locationId) {
      newErrors.locationId = '请选择存放位置';
    }
    if (formData.quantity < 1) {
      newErrors.quantity = '数量必须大于0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && id) {
      updateItem(id, formData);
      navigate(`/items/${id}`);
    } else {
      addItem(formData);
      navigate('/items');
    }
  };

  const houses = getHouses();

  // Find the full path for the current location when editing
  const currentLocation = locations.find((l) => l.id === formData.locationId);
  const currentRoom = currentLocation?.type !== 'house' && currentLocation?.parentId
    ? locations.find((l) => l.id === currentLocation.parentId)
    : null;
  const currentHouse = currentRoom?.parentId
    ? locations.find((l) => l.id === currentRoom.parentId)
    : currentLocation?.type === 'house'
    ? currentLocation
    : null;

  // Get rooms for the selected house
  const selectedHouseId = currentHouse?.id || '';
  const rooms = selectedHouseId ? getRooms(selectedHouseId) : [];

  // Get furniture for the selected room
  const selectedRoomId = currentRoom?.id || '';
  const furniture = selectedRoomId
    ? locations.filter((l) => l.parentId === selectedRoomId)
    : [];

  // Get the actual location id (could be house, room, or furniture)
  const actualLocationId = furniture.length > 0 && currentLocation?.parentId
    ? formData.locationId
    : currentRoom?.id || currentHouse?.id || '';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={isEditing ? `/items/${id}` : '/items'}
          className="p-2 rounded-xl hover:bg-surface transition-colors"
        >
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-2xl font-display font-bold text-text-primary">
          {isEditing ? '编辑物品' : '添加物品'}
        </h1>
      </div>

      {/* Form */}
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="物品名称"
            placeholder="请输入物品名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-primary">
              物品描述
            </label>
            <textarea
              placeholder="请输入物品描述（可选）"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="分类"
              options={[
                { value: '', label: '请选择分类' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              error={errors.categoryId}
            />

            <Select
              label="住宅"
              options={[
                { value: '', label: '请选择住宅' },
                ...houses.map((h) => ({ value: h.id, label: h.name })),
              ]}
              value={currentHouse?.id || ''}
              onChange={(e) => {
                const houseId = e.target.value;
                setFormData((prev) => ({ ...prev, locationId: houseId }));
              }}
            />
          </div>

          {/* Room selector */}
          <Select
            label="房间"
            options={[
              { value: '', label: currentHouse?.id ? '请选择房间' : '请先选择住宅' },
              ...rooms.map((r) => ({ value: r.id, label: r.name })),
            ]}
            value={currentRoom?.id || ''}
            onChange={(e) => {
              const roomId = e.target.value;
              setFormData((prev) => ({ ...prev, locationId: roomId }));
            }}
            disabled={!currentHouse?.id || rooms.length === 0}
          />

          {/* Furniture selector */}
          <Select
            label="具体位置"
            options={[
              { value: '', label: currentRoom?.id ? '请选择具体位置' : '请先选择房间' },
              ...furniture.map((f) => ({ value: f.id, label: f.name })),
            ]}
            value={formData.locationId}
            onChange={(e) =>
              setFormData({ ...formData, locationId: e.target.value })
            }
            error={errors.locationId}
            disabled={!currentRoom?.id || furniture.length === 0}
          />

          <Input
            label="数量"
            type="number"
            min={1}
            placeholder="1"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
            }
            error={errors.quantity}
          />

          <div className="flex gap-3 pt-4">
            <Link to={isEditing ? `/items/${id}` : '/items'}>
              <Button type="button" variant="outline">
                取消
              </Button>
            </Link>
            <Button type="submit" className="gap-2">
              <Save size={18} />
              保存
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
