import { useState } from "react";
import { Store, Package, ShoppingCart, TrendingUp, FileText, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card } from "./components/ui/card";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { StockList, StockItem } from "./components/StockList";
import { PurchaseForm, PurchaseTransaction } from "./components/PurchaseForm";
import { SaleForm, SaleTransaction } from "./components/SaleForm";
import { DailySummary } from "./components/DailySummary";

// Initial mock stock data
const initialStock: StockItem[] = [
  {
    id: "1",
    name: "Basmati Rice",
    variety: "Premium",
    quantity: 500,
    unit: "kg",
    pricePerUnit: 120,
    reorderLevel: 100
  },
  {
    id: "2",
    name: "Basmati Rice",
    variety: "Super",
    quantity: 300,
    unit: "kg",
    pricePerUnit: 95,
    reorderLevel: 100
  },
  {
    id: "3",
    name: "Sona Masoori",
    variety: "Regular",
    quantity: 450,
    unit: "kg",
    pricePerUnit: 65,
    reorderLevel: 150
  },
  {
    id: "4",
    name: "Ponni Rice",
    variety: "Boiled",
    quantity: 80,
    unit: "kg",
    pricePerUnit: 55,
    reorderLevel: 100
  },
  {
    id: "5",
    name: "Kolam Rice",
    variety: "Regular",
    quantity: 200,
    unit: "kg",
    pricePerUnit: 60,
    reorderLevel: 100
  },
  {
    id: "6",
    name: "Jasmine Rice",
    variety: "Premium",
    quantity: 150,
    unit: "kg",
    pricePerUnit: 110,
    reorderLevel: 50
  }
];

export default function App() {
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [purchases, setPurchases] = useState<PurchaseTransaction[]>([]);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseTransaction | undefined>();
  const [editingSale, setEditingSale] = useState<SaleTransaction | undefined>();
  const [activeTab, setActiveTab] = useState("stock");

  const handlePurchase = (purchase: Omit<PurchaseTransaction, 'id'>) => {
    // Add purchase to transactions
    const newPurchase: PurchaseTransaction = {
      ...purchase,
      id: Date.now().toString()
    };
    setPurchases([...purchases, newPurchase]);

    // Update stock
    setStock(stock.map(item => {
      if (item.id === purchase.itemId) {
        return {
          ...item,
          quantity: item.quantity + purchase.quantity
        };
      }
      return item;
    }));
  };

  const handleUpdatePurchase = (id: string, purchase: Omit<PurchaseTransaction, 'id'>) => {
    const oldPurchase = purchases.find(p => p.id === id);
    if (!oldPurchase) return;

    // Update purchases array
    setPurchases(purchases.map(p => p.id === id ? { ...purchase, id } : p));

    // Update stock: revert old purchase and apply new one
    setStock(stock.map(item => {
      let newQuantity = item.quantity;
      
      // Revert old purchase
      if (item.id === oldPurchase.itemId) {
        newQuantity -= oldPurchase.quantity;
      }
      
      // Apply new purchase
      if (item.id === purchase.itemId) {
        newQuantity += purchase.quantity;
      }
      
      return { ...item, quantity: newQuantity };
    }));

    setEditingPurchase(undefined);
  };

  const handleSale = (sale: Omit<SaleTransaction, 'id'>) => {
    // Add sale to transactions
    const newSale: SaleTransaction = {
      ...sale,
      id: Date.now().toString()
    };
    setSales([...sales, newSale]);

    // Update stock
    setStock(stock.map(item => {
      if (item.id === sale.itemId) {
        return {
          ...item,
          quantity: item.quantity - sale.quantity
        };
      }
      return item;
    }));
  };

  const handleUpdateSale = (id: string, sale: Omit<SaleTransaction, 'id'>) => {
    const oldSale = sales.find(s => s.id === id);
    if (!oldSale) return;

    // Update sales array
    setSales(sales.map(s => s.id === id ? { ...sale, id } : s));

    // Update stock: revert old sale and apply new one
    setStock(stock.map(item => {
      let newQuantity = item.quantity;
      
      // Revert old sale
      if (item.id === oldSale.itemId) {
        newQuantity += oldSale.quantity;
      }
      
      // Apply new sale
      if (item.id === sale.itemId) {
        newQuantity -= sale.quantity;
      }
      
      return { ...item, quantity: newQuantity };
    }));

    setEditingSale(undefined);
  };

  const handleDeletePurchase = (id: string) => {
    const purchase = purchases.find(p => p.id === id);
    if (!purchase) return;

    // Remove purchase from array
    setPurchases(purchases.filter(p => p.id !== id));

    // Revert stock change
    setStock(stock.map(item => {
      if (item.id === purchase.itemId) {
        return {
          ...item,
          quantity: item.quantity - purchase.quantity
        };
      }
      return item;
    }));

    toast.success("Purchase deleted successfully!");
  };

  const handleDeleteSale = (id: string) => {
    const sale = sales.find(s => s.id === id);
    if (!sale) return;

    // Remove sale from array
    setSales(sales.filter(s => s.id !== id));

    // Revert stock change
    setStock(stock.map(item => {
      if (item.id === sale.itemId) {
        return {
          ...item,
          quantity: item.quantity + sale.quantity
        };
      }
      return item;
    }));

    toast.success("Sale deleted successfully!");
  };

  const handleEditPurchaseFromSummary = (purchase: PurchaseTransaction) => {
    setEditingPurchase(purchase);
    setActiveTab("purchase");
  };

  const handleEditSaleFromSummary = (sale: SaleTransaction) => {
    setEditingSale(sale);
    setActiveTab("sale");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm shadow-lg">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-white">Rice Shop Management</h1>
              <p className="text-sm text-blue-100">Inventory & Sales Tracking System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-white dark:bg-slate-900 shadow-md">
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Stock</span>
            </TabsTrigger>
            <TabsTrigger value="purchase" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Purchase</span>
            </TabsTrigger>
            <TabsTrigger value="sale" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Sale</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Current Stock Inventory</h2>
                <p className="text-sm text-muted-foreground">View all available stock items</p>
              </div>
            </div>
            <StockList items={stock} />
          </TabsContent>

          <TabsContent value="purchase" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-4">
                  {editingPurchase ? 'Edit Purchase' : 'Add New Purchase'}
                </h2>
                <PurchaseForm 
                  onSubmit={handlePurchase}
                  onUpdate={handleUpdatePurchase}
                  editingTransaction={editingPurchase}
                  onCancelEdit={() => setEditingPurchase(undefined)}
                  availableItems={stock.map(item => ({
                    id: item.id,
                    name: item.name,
                    variety: item.variety
                  }))}
                />
              </div>
              <div>
                <h2 className="font-semibold mb-4">Recent Purchases</h2>
                <Card className="p-6">
                  {purchases.length > 0 ? (
                    <div className="space-y-4">
                      {purchases.slice(-5).reverse().map((purchase) => (
                        <div key={purchase.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                          <div className="flex-1">
                            <p className="font-medium">{purchase.itemName}</p>
                            <p className="text-sm text-muted-foreground">
                              {purchase.supplierName} • {purchase.quantity} kg
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(purchase.date).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right flex items-start gap-2">
                            <div>
                              <p className="font-semibold">₹{purchase.totalAmount.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">₹{purchase.pricePerUnit}/kg</p>
                            </div>
                            <button
                              onClick={() => setEditingPurchase(purchase)}
                              className="p-2 hover:bg-muted rounded-md transition-colors"
                              title="Edit purchase"
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No purchases recorded yet</p>
                      <p className="text-sm">Add your first purchase using the form</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sale" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-4">
                  {editingSale ? 'Edit Sale' : 'Record New Sale'}
                </h2>
                <SaleForm 
                  onSubmit={handleSale}
                  onUpdate={handleUpdateSale}
                  editingTransaction={editingSale}
                  onCancelEdit={() => setEditingSale(undefined)}
                  availableItems={stock.map(item => ({
                    id: item.id,
                    name: item.name,
                    variety: item.variety,
                    quantity: item.quantity
                  }))}
                />
              </div>
              <div>
                <h2 className="font-semibold mb-4">Recent Sales</h2>
                <Card className="p-6">
                  {sales.length > 0 ? (
                    <div className="space-y-4">
                      {sales.slice(-5).reverse().map((sale) => (
                        <div key={sale.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                          <div className="flex-1">
                            <p className="font-medium">{sale.itemName}</p>
                            <p className="text-sm text-muted-foreground">
                              {sale.customerName || 'Walk-in Customer'} • {sale.quantity} kg
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(sale.date).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right flex items-start gap-2">
                            <div>
                              <p className="font-semibold text-green-600">₹{sale.totalAmount.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">₹{sale.pricePerUnit}/kg</p>
                            </div>
                            <button
                              onClick={() => setEditingSale(sale)}
                              className="p-2 hover:bg-muted rounded-md transition-colors"
                              title="Edit sale"
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No sales recorded yet</p>
                      <p className="text-sm">Record your first sale using the form</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div>
              <h2 className="font-semibold mb-2">Daily Summary Report</h2>
              <p className="text-sm text-muted-foreground mb-6">View transactions and stock status for the day</p>
            </div>
            <DailySummary 
              purchases={purchases}
              sales={sales}
              currentStock={stock}
              selectedDate={new Date()}
              onEditPurchase={handleEditPurchaseFromSummary}
              onEditSale={handleEditSaleFromSummary}
              onDeletePurchase={handleDeletePurchase}
              onDeleteSale={handleDeleteSale}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}