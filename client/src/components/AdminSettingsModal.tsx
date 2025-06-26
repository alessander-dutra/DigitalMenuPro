import { useState, useEffect } from 'react';
import { X, Settings, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PrinterSelector } from '@/components/PrinterSelector';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { StoreSettings, MenuItem, InsertMenuItem } from '@shared/schema';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  available: number;
  productionPrinter: string;
}

export function AdminSettingsModal({ isOpen, onClose }: AdminSettingsModalProps) {
  const [activeTab, setActiveTab] = useState("store");
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuFormData, setMenuFormData] = useState<MenuItemFormData>({
    name: '',
    description: '',
    price: '',
    category: 'entradas',
    imageUrl: '',
    available: 1,
    productionPrinter: '',
  });

  const { toast } = useToast();

  // Fetch store settings
  const { data: storeSettings, isLoading: settingsLoading } = useQuery<StoreSettings>({
    queryKey: ['/api/store-settings'],
    enabled: isOpen,
  });

  // Fetch menu items for admin management
  const { data: menuItems, isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
    enabled: isOpen && activeTab === 'menu',
  });

  const [settingsData, setSettingsData] = useState<Partial<StoreSettings>>({});

  useEffect(() => {
    if (storeSettings) {
      setSettingsData(storeSettings);
    }
  }, [storeSettings]);

  // Update store settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<StoreSettings>) => {
      const response = await apiRequest('PUT', '/api/store-settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/store-settings'] });
      toast({
        title: "Configurações atualizadas",
        description: "As configurações da loja foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    },
  });

  // Create menu item mutation
  const createMenuItemMutation = useMutation({
    mutationFn: async (data: InsertMenuItem) => {
      const response = await apiRequest('POST', '/api/admin/menu-items', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      setIsMenuFormOpen(false);
      resetMenuForm();
      toast({
        title: "Item criado",
        description: "O item foi adicionado ao cardápio com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o item.",
        variant: "destructive",
      });
    },
  });

  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertMenuItem> }) => {
      const response = await apiRequest('PUT', `/api/admin/menu-items/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      setIsMenuFormOpen(false);
      setEditingItem(null);
      resetMenuForm();
      toast({
        title: "Item atualizado",
        description: "O item foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive",
      });
    },
  });

  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/menu-items/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      toast({
        title: "Item removido",
        description: "O item foi removido do cardápio.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível remover o item.",
        variant: "destructive",
      });
    },
  });

  const resetMenuForm = () => {
    setMenuFormData({
      name: '',
      description: '',
      price: '',
      category: 'entradas',
      imageUrl: '',
      available: 1,
      productionPrinter: '',
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setMenuFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      available: item.available,
      productionPrinter: item.productionPrinter || '',
    });
    setIsMenuFormOpen(true);
  };

  const handleSubmitMenuItem = () => {
    if (editingItem) {
      updateMenuItemMutation.mutate({
        id: editingItem.id,
        data: menuFormData,
      });
    } else {
      createMenuItemMutation.mutate(menuFormData);
    }
  };

  const handleSubmitSettings = () => {
    updateSettingsMutation.mutate(settingsData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Administrativas
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="store">Configurações da Loja</TabsTrigger>
            <TabsTrigger value="menu">Gerenciar Cardápio</TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="space-y-6">
            {settingsLoading ? (
              <div>Carregando configurações...</div>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Loja</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="storeName">Nome da Loja</Label>
                        <Input
                          id="storeName"
                          value={settingsData.storeName || ''}
                          onChange={(e) => setSettingsData({ ...settingsData, storeName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="storePhone">Telefone</Label>
                        <Input
                          id="storePhone"
                          value={settingsData.storePhone || ''}
                          onChange={(e) => setSettingsData({ ...settingsData, storePhone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="storeEmail">E-mail</Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        value={settingsData.storeEmail || ''}
                        onChange={(e) => setSettingsData({ ...settingsData, storeEmail: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeAddress">Endereço</Label>
                      <Textarea
                        id="storeAddress"
                        value={settingsData.storeAddress || ''}
                        onChange={(e) => setSettingsData({ ...settingsData, storeAddress: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Operação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isOpen"
                        checked={settingsData.isOpen === 1}
                        onCheckedChange={(checked) => setSettingsData({ ...settingsData, isOpen: checked ? 1 : 0 })}
                      />
                      <Label htmlFor="isOpen">Loja Aberta</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="openingTime">Horário de Abertura</Label>
                        <Input
                          id="openingTime"
                          type="time"
                          value={settingsData.openingTime || ''}
                          onChange={(e) => setSettingsData({ ...settingsData, openingTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="closingTime">Horário de Fechamento</Label>
                        <Input
                          id="closingTime"
                          type="time"
                          value={settingsData.closingTime || ''}
                          onChange={(e) => setSettingsData({ ...settingsData, closingTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allowPickup"
                        checked={settingsData.allowPickup === 1}
                        onCheckedChange={(checked) => setSettingsData({ ...settingsData, allowPickup: checked ? 1 : 0 })}
                      />
                      <Label htmlFor="allowPickup">Permitir Retirada na Loja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allowCheckout"
                        checked={settingsData.allowCheckout === 1}
                        onCheckedChange={(checked) => setSettingsData({ ...settingsData, allowCheckout: checked ? 1 : 0 })}
                      />
                      <Label htmlFor="allowCheckout">Permitir Checkout (Desmarque para modo apenas visualização)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allowScheduling"
                        checked={settingsData.allowScheduling === 1}
                        onCheckedChange={(checked) => setSettingsData({ ...settingsData, allowScheduling: checked ? 1 : 0 })}
                      />
                      <Label htmlFor="allowScheduling">Permitir Agendamento de Pedidos</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Entrega e Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="deliveryTime">Tempo de Entrega</Label>
                        <Input
                          id="deliveryTime"
                          value={settingsData.deliveryTime || ''}
                          onChange={(e) => setSettingsData({ ...settingsData, deliveryTime: e.target.value })}
                          placeholder="30-45 min"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickupTime">Tempo de Retirada</Label>
                        <Input
                          id="pickupTime"
                          value={settingsData.pickupTime || ''}
                          onChange={(e) => setSettingsData({ ...settingsData, pickupTime: e.target.value })}
                          placeholder="15-20 min"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                        <Input
                          id="deliveryFee"
                          type="number"
                          step="0.01"
                          value={settingsData.deliveryFee || ''}
                          onChange={(e) => setSettingsData({ ...settingsData, deliveryFee: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="paymentMethods">Formas de Pagamento (separadas por vírgula)</Label>
                      <Input
                        id="paymentMethods"
                        value={settingsData.paymentMethods || ''}
                        onChange={(e) => setSettingsData({ ...settingsData, paymentMethods: e.target.value })}
                        placeholder="card,pix,cash"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleSubmitSettings}
                  disabled={updateSettingsMutation.isPending}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateSettingsMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Gerenciar Itens do Cardápio</h3>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  resetMenuForm();
                  setIsMenuFormOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>
            </div>

            {menuLoading ? (
              <div>Carregando cardápio...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems?.map((item) => (
                  <Card key={item.id} className="relative">
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditItem(item)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteMenuItemMutation.mutate(item.id)}
                        disabled={deleteMenuItemMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600 truncate">{item.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-primary">R$ {parseFloat(item.price).toFixed(2)}</span>
                        <span className={`text-xs px-2 py-1 rounded ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.available ? 'Disponível' : 'Indisponível'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Menu Item Form Modal */}
            <Dialog open={isMenuFormOpen} onOpenChange={setIsMenuFormOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Editar Item' : 'Adicionar Item'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="itemName">Nome do Item</Label>
                    <Input
                      id="itemName"
                      value={menuFormData.name}
                      onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemDescription">Descrição</Label>
                    <Textarea
                      id="itemDescription"
                      value={menuFormData.description}
                      onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemPrice">Preço (R$)</Label>
                      <Input
                        id="itemPrice"
                        type="number"
                        step="0.01"
                        value={menuFormData.price}
                        onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemCategory">Categoria</Label>
                      <Select
                        value={menuFormData.category}
                        onValueChange={(value) => setMenuFormData({ ...menuFormData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entradas">Entradas</SelectItem>
                          <SelectItem value="principais">Pratos Principais</SelectItem>
                          <SelectItem value="massas">Massas</SelectItem>
                          <SelectItem value="sobremesas">Sobremesas</SelectItem>
                          <SelectItem value="bebidas">Bebidas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="itemImageUrl">URL da Imagem</Label>
                    <Input
                      id="itemImageUrl"
                      value={menuFormData.imageUrl}
                      onChange={(e) => setMenuFormData({ ...menuFormData, imageUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <PrinterSelector
                      value={menuFormData.productionPrinter}
                      onValueChange={(printer) => setMenuFormData({ ...menuFormData, productionPrinter: printer })}
                      label="Impressora de Produção"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="itemAvailable"
                      checked={menuFormData.available === 1}
                      onCheckedChange={(checked) => setMenuFormData({ ...menuFormData, available: checked ? 1 : 0 })}
                    />
                    <Label htmlFor="itemAvailable">Disponível</Label>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsMenuFormOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSubmitMenuItem}
                      disabled={createMenuItemMutation.isPending || updateMenuItemMutation.isPending}
                    >
                      {editingItem ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}