import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, X, Save, AlertCircle } from 'lucide-react';
import { useRestaurantContext } from '@/hooks/restaurant/useRestaurantContext';
import { menuService } from '@/services/menu/menu.tsx';

interface MenuItem {
  food_id: string;
  restaurant_id: string;
  name: string;
  categories?: string[];
  price: number;
  description?: string;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  image_url?: string;
  is_favorited?: boolean;
}

interface CategoryGroup {
  name: string;
  description: string;
}

const RestaurantMenu = () => {
  const navigate = useNavigate();
  const { selectedRestaurant } = useRestaurantContext();

  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await menuService.getCategories();
        setCategoryGroups(cats);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    categories: [],
    price: 0,
    description: '',
    status: 'AVAILABLE',
    image_url: 'https://via.placeholder.com/150',
  });

  useEffect(() => {
    // Fetch menu items for selectedRestaurant from backend
    const fetchMenu = async () => {
      if (selectedRestaurant) {
        try {
          const items = await menuService.getRestaurantMenu(
            selectedRestaurant.restaurant_id,
          );
          setMenuItems(items);
        } catch (error) {
          console.error('Failed to fetch menu:', error);
        }
      } else {
        setMenuItems([]);
      }
    };
    fetchMenu();
  }, [selectedRestaurant]);

  if (!selectedRestaurant) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='ml-64 flex flex-1 items-center justify-center'>
          <Card className='max-w-md p-8 text-center'>
            <AlertCircle size={48} className='mx-auto mb-4 text-orange-500' />
            <h3 className='mb-2 text-xl font-bold text-gray-900'>
              No Restaurant Selected
            </h3>
            <p className='mb-6 text-gray-600'>
              Please select a restaurant to manage the menu
            </p>
            <button
              onClick={() => navigate('/restaurant/settings')}
              className='rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600'
            >
              Select Restaurant
            </button>
          </Card>
        </main>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Deterministic fallback image based on item ID
  const getFallbackImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    const images = [
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
      'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      'https://images.pexels.com/photos/247685/pexels-photo-247685.jpeg',
    ];
    const index = hash % images.length;
    return images[index];
  };

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) =>
          (item.categories || []).includes(selectedCategory),
        );

  // Sort by rating (highest first)
  const sortedItems = filteredItems;

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      categories: item.categories || [],
      price: item.price,
      description: item.description || '',
      status: item.status,
      image_url: item.image_url || 'https://via.placeholder.com/150',
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      categories: [],
      price: 0,
      description: '',
      status: 'AVAILABLE',
      image_url: 'https://via.placeholder.com/150',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const saveMenuItem = async () => {
      if (!selectedRestaurant) return;
      try {
        if (editingItem) {
          await menuService.updateMenuItem(
            selectedRestaurant.restaurant_id,
            editingItem.food_id,
            {
              name: formData.name || '',
              categories: formData.categories,
              price: formData.price || 0,
              description: formData.description,
              status: formData.status,
            },
          );
        } else {
          await menuService.createMenuItem({
            restaurant_id: selectedRestaurant.restaurant_id,
            name: formData.name || '',
            price: formData.price || 0,
            description: formData.description,
            status: formData.status,
          });
        }
        // Refetch menu after change
        const items = await menuService.getRestaurantMenu(
          selectedRestaurant.restaurant_id,
        );
        setMenuItems(items);
        setIsModalOpen(false);
      } catch (error) {
        let errorMessage = 'Failed to save menu item.';
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        console.error(error);
      }
    };
    saveMenuItem();
  };

  const handleDelete = (id: string) => {
    const deleteMenuItem = async () => {
      if (!selectedRestaurant) return;
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await menuService.deleteMenuItem(
            selectedRestaurant.restaurant_id,
            id,
          );
          const items = await menuService.getRestaurantMenu(
            selectedRestaurant.restaurant_id,
          );
          setMenuItems(items);
        } catch (error) {
          let errorMessage = 'Failed to delete menu item.';
          if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          toast.error(errorMessage);
          console.error(error);
        }
      }
    };
    deleteMenuItem();
  };

  const toggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.food_id === id
          ? {
              ...item,
              status: item.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE',
            }
          : item,
      ),
    );
  };

  const toggleCategory = (category: string) => {
    const currentCategories = formData.categories || [];
    if (currentCategories.includes(category)) {
      setFormData({
        ...formData,
        categories: currentCategories.filter((c) => c !== category),
      });
    } else {
      setFormData({
        ...formData,
        categories: [...currentCategories, category],
      });
    }
  };

  // Group items by category for display
  const groupedItems: { [key: string]: MenuItem[] } = {};
  if (selectedCategory === 'all') {
    categoryGroups.forEach((group) => {
      groupedItems[group.name] = menuItems.filter((item) =>
        (item.categories || []).includes(group.name),
      );
    });
  } else {
    groupedItems[selectedCategory] = filteredItems;
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='ml-64 flex-1'>
        <div className='container mx-auto max-w-7xl px-6 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <div className='mb-4'>
              <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                Menu Management
              </h1>
              <p className='text-gray-600'>
                Manage your restaurant's menu items and categories
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className='flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600'
            >
              <Plus size={20} />
              Add New Food
            </button>
          </div>

          {/* Category Filter */}
          <div className='mb-6 flex flex-wrap gap-2'>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-lg px-4 py-2 font-medium capitalize transition ${
                selectedCategory === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Items ({menuItems.length})
            </button>
            {categoryGroups.map((group) => (
              <button
                key={group.name}
                onClick={() => setSelectedCategory(group.name)}
                className={`rounded-lg px-4 py-2 font-medium transition ${
                  selectedCategory === group.name
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>

          {/* Menu Items - Sorted by Rating */}
          <div className='mb-4 flex items-center justify-between'></div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {sortedItems.map((item) => (
              <Card key={item.food_id} className='overflow-hidden'>
                <img
                  src={item.image_url || getFallbackImage(item.food_id)}
                  alt={item.name}
                  className='h-48 w-full bg-orange-100 object-cover'
                />
                <div className='p-4'>
                  <div className='mb-2 flex items-start justify-between'>
                    <div className='flex-1'>
                      <h3 className='text-left text-lg font-bold text-gray-900'>
                        {item.name}
                      </h3>
                      <div className='mt-1 flex items-center gap-2'>
                        {/* Rating and reviewCount removed, not present in MenuItem */}
                      </div>
                      <div className='mt-2 flex flex-wrap gap-1'>
                        {(item.categories || []).map((cat) => (
                          <span
                            key={cat}
                            className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700'
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEdit(item)}
                        className='rounded p-1 text-blue-500 hover:bg-blue-50'
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.food_id)}
                        className='rounded p-1 text-red-500 hover:bg-red-50'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <p className='mb-3 text-left text-sm text-gray-600'>
                    {item.description}
                  </p>

                  <div className='flex items-center justify-between'>
                    <span className='text-xl font-bold text-gray-900'>
                      {formatCurrency(item.price)}
                    </span>
                    <button
                      onClick={() => toggleAvailability(item.food_id)}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        item.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {item.status === 'AVAILABLE'
                        ? 'Available'
                        : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {sortedItems.length === 0 && (
            <Card className='p-8 text-center'>
              <p className='text-gray-600'>No items found in this category.</p>
            </Card>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <Card className='w-full max-w-md px-3 py-4'>
            <div className='sticky top-0 z-10 flex items-center justify-between py-2 pr-2 pl-4'>
              <h2 className='text-xl font-bold text-gray-900'>
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>

            <div className='max-h-[70vh] overflow-y-scroll p-4'>
              <div className='space-y-4 text-left'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Food Name
                  </label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                    placeholder='Enter food name'
                  />
                </div>

                {editingItem ? (
                  <div>
                    <label className='mb-2 block text-sm font-medium text-gray-700'>
                      Categories (select multiple)
                    </label>
                    <div className='max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3'>
                      {categoryGroups.map((group) => (
                        <label
                          key={group.name}
                          className='flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50'
                        >
                          <input
                            type='checkbox'
                            checked={
                              formData.categories?.includes(group.name) || false
                            }
                            onChange={() => toggleCategory(group.name)}
                            className='h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500'
                          />
                          <div>
                            <div className='text-sm font-medium text-gray-900'>
                              {group.name}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className='mt-2 flex gap-2'>
                      <input
                        type='text'
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className='flex-1 rounded-lg border px-3 py-2'
                        placeholder='New category name...'
                      />
                      <button
                        type='button'
                        className='rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600'
                        disabled={!newCategoryName.trim() || addingCategory}
                        onClick={async () => {
                          setAddingCategory(true);
                          try {
                            const res = await menuService.addCategory(
                              newCategoryName.trim(),
                              newCategoryDesc.trim() || undefined,
                            );
                            setCategoryGroups((prev) => [...prev, res]);
                            setNewCategoryName('');
                            setNewCategoryDesc('');
                          } catch (err) {
                            let errorMessage = 'Failed to add category.';
                            if (err?.response?.data?.message) {
                              errorMessage = err.response.data.message;
                            } else if (err?.message) {
                              errorMessage = err.message;
                            }
                            toast.error(errorMessage);
                          }
                          setAddingCategory(false);
                        }}
                      >
                        Add Category
                      </button>
                    </div>
                    {formData.categories && formData.categories.length > 0 && (
                      <div className='mt-2 flex flex-wrap gap-1'>
                        {formData.categories.map((cat) => (
                          <span
                            key={cat}
                            className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700'
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )}

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Price (VND)
                  </label>
                  <input
                    type='number'
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='Enter price'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='Enter description'
                    rows={3}
                  />
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={formData.status === 'AVAILABLE'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.checked ? 'AVAILABLE' : 'UNAVAILABLE',
                      })
                    }
                    className='h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500'
                  />
                  <label className='text-md font-medium text-gray-700'>
                    Available for order
                  </label>
                </div>
              </div>

              <div className='mt-6 flex gap-2'>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='flex-1 rounded-lg border px-4 py-2 font-medium text-gray-700 hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600'
                  disabled={
                    !formData.name ||
                    (editingItem &&
                      (!formData.categories ||
                        formData.categories.length === 0))
                  }
                >
                  <Save size={18} />
                  Save
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
