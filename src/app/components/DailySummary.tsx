import { format } from "date-fns";
import { Calendar, TrendingDown, TrendingUp, DollarSign, Pencil, Trash2, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState } from "react";
import { PurchaseTransaction } from "./PurchaseForm";
import { SaleTransaction } from "./SaleForm";
import { StockItem } from "./StockList";

interface DailySummaryProps {
  purchases: PurchaseTransaction[];
  sales: SaleTransaction[];
  currentStock: StockItem[];
  selectedDate: Date;
  onEditPurchase?: (purchase: PurchaseTransaction) => void;
  onDeletePurchase?: (id: string) => void;
  onEditSale?: (sale: SaleTransaction) => void;
  onDeleteSale?: (id: string) => void;
}

export function DailySummary({ 
  purchases, 
  sales, 
  currentStock, 
  selectedDate,
  onEditPurchase,
  onDeletePurchase,
  onEditSale,
  onDeleteSale
}: DailySummaryProps) {
  const [deletingPurchaseId, setDeletingPurchaseId] = useState<string | null>(null);
  const [deletingSaleId, setDeletingSaleId] = useState<string | null>(null);

  const dayPurchases = purchases.filter(p => 
    format(p.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );
  
  const daySales = sales.filter(s => 
    format(s.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const totalPurchaseAmount = dayPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalSaleAmount = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalPurchaseQty = dayPurchases.reduce((sum, p) => sum + p.quantity, 0);
  const totalSaleQty = daySales.reduce((sum, s) => sum + s.quantity, 0);
  
  const netProfit = totalSaleAmount - totalPurchaseAmount;

  const handleDeletePurchase = () => {
    if (deletingPurchaseId && onDeletePurchase) {
      onDeletePurchase(deletingPurchaseId);
      setDeletingPurchaseId(null);
    }
  };

  const handleDeleteSale = () => {
    if (deletingSaleId && onDeleteSale) {
      onDeleteSale(deletingSaleId);
      setDeletingSaleId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <h2 className="font-semibold">Summary for {format(selectedDate, 'MMMM dd, yyyy')}</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Purchases</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-blue-900 dark:text-blue-100">₹{totalPurchaseAmount.toLocaleString()}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">{totalPurchaseQty.toFixed(2)} kg bought</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-green-900 dark:text-green-100">₹{totalSaleAmount.toLocaleString()}</div>
            <p className="text-xs text-green-600 dark:text-green-400">{totalSaleQty.toFixed(2)} kg sold</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900 border-emerald-200 dark:border-emerald-800' : 'from-red-50 to-rose-100 dark:from-red-950 dark:to-rose-900 border-red-200 dark:border-red-800'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Net Profit</CardTitle>
            <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
          </CardHeader>
          <CardContent>
            <div className={`font-semibold ${netProfit >= 0 ? 'text-emerald-900 dark:text-emerald-100' : 'text-red-900 dark:text-red-100'}`}>
              ₹{netProfit.toLocaleString()}
            </div>
            <p className={`text-xs ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {netProfit >= 0 ? 'Profit' : 'Loss'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-purple-900 dark:text-purple-100">{dayPurchases.length + daySales.length}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {dayPurchases.length} purchases, {daySales.length} sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Transactions */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Purchase Transactions
          </CardTitle>
          <CardDescription>All purchases made on this day</CardDescription>
        </CardHeader>
        <CardContent>
          {dayPurchases.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price/kg</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dayPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{format(purchase.date, 'HH:mm')}</TableCell>
                    <TableCell>{purchase.itemName}</TableCell>
                    <TableCell>{purchase.supplierName}</TableCell>
                    <TableCell className="text-right">{purchase.quantity} kg</TableCell>
                    <TableCell className="text-right">₹{purchase.pricePerUnit}</TableCell>
                    <TableCell className="text-right">₹{purchase.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEditPurchase && (
                          <button
                            onClick={() => onEditPurchase(purchase)}
                            className="p-2 hover:bg-muted rounded-md transition-colors"
                            title="Edit purchase"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        )}
                        {onDeletePurchase && (
                          <button
                            onClick={() => setDeletingPurchaseId(purchase.id)}
                            className="p-2 hover:bg-muted rounded-md transition-colors"
                            title="Delete purchase"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No purchases recorded for this day
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sale Transactions */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            Sale Transactions
          </CardTitle>
          <CardDescription>All sales made on this day</CardDescription>
        </CardHeader>
        <CardContent>
          {daySales.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price/kg</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daySales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{format(sale.date, 'HH:mm')}</TableCell>
                    <TableCell>{sale.itemName}</TableCell>
                    <TableCell>{sale.customerName || '—'}</TableCell>
                    <TableCell className="text-right">{sale.quantity} kg</TableCell>
                    <TableCell className="text-right">₹{sale.pricePerUnit}</TableCell>
                    <TableCell className="text-right">₹{sale.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEditSale && (
                          <button
                            onClick={() => onEditSale(sale)}
                            className="p-2 hover:bg-muted rounded-md transition-colors"
                            title="Edit sale"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        )}
                        {onDeleteSale && (
                          <button
                            onClick={() => setDeletingSaleId(sale.id)}
                            className="p-2 hover:bg-muted rounded-md transition-colors"
                            title="Delete sale"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No sales recorded for this day
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Closing Stock */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Closing Stock Summary
          </CardTitle>
          <CardDescription>Current inventory status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price/kg</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStock.map((item) => {
                const isLowStock = item.quantity <= item.reorderLevel;
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.variety}</TableCell>
                    <TableCell className="text-right">{item.quantity} kg</TableCell>
                    <TableCell className="text-right">₹{item.pricePerUnit}</TableCell>
                    <TableCell className="text-right">
                      ₹{(item.quantity * item.pricePerUnit).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {isLowStock ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : (
                        <Badge variant="outline">In Stock</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Purchase Confirmation Dialog */}
      <AlertDialog open={!!deletingPurchaseId} onOpenChange={() => setDeletingPurchaseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this purchase transaction? This will revert the stock changes and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePurchase} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Sale Confirmation Dialog */}
      <AlertDialog open={!!deletingSaleId} onOpenChange={() => setDeletingSaleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sale</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sale transaction? This will revert the stock changes and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSale} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}