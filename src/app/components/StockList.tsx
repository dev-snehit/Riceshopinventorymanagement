import { Package, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export interface StockItem {
  id: string;
  name: string;
  variety: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  reorderLevel: number;
}

interface StockListProps {
  items: StockItem[];
}

export function StockList({ items }: StockListProps) {
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
  const lowStockItems = items.filter(item => item.quantity <= item.reorderLevel);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-blue-900 dark:text-blue-100">{items.length} Varieties</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">In stock</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Stock Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-green-900 dark:text-green-100">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400">Current inventory value</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Low Stock Alert</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-orange-900 dark:text-orange-100">{lowStockItems.length} Items</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">Below reorder level</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isLowStock = item.quantity <= item.reorderLevel;
          
          return (
            <Card key={item.id} className={isLowStock ? "border-orange-400 bg-orange-50/50 dark:bg-orange-950/20" : "hover:shadow-lg transition-shadow"}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                      {item.variety}
                    </CardDescription>
                  </div>
                  {isLowStock && (
                    <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">Low Stock</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-950/30 rounded">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium text-blue-700 dark:text-blue-300">{item.quantity} {item.unit}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-purple-50 dark:bg-purple-950/30 rounded">
                    <span className="text-muted-foreground">Price per {item.unit}:</span>
                    <span className="font-medium text-purple-700 dark:text-purple-300">₹{item.pricePerUnit}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-green-50 dark:bg-green-950/30 rounded">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span className="font-semibold text-green-700 dark:text-green-300">₹{(item.quantity * item.pricePerUnit).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground text-sm">Reorder Level:</span>
                    <span className="text-sm text-amber-600 dark:text-amber-400">{item.reorderLevel} {item.unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}