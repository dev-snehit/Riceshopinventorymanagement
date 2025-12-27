import { useState, useEffect } from "react";
import { ShoppingCart, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

export interface SaleTransaction {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  date: Date;
  customerName?: string;
}

interface SaleFormProps {
  onSubmit: (sale: Omit<SaleTransaction, 'id'>) => void;
  onUpdate?: (id: string, sale: Omit<SaleTransaction, 'id'>) => void;
  availableItems: Array<{ id: string; name: string; variety: string; quantity: number }>;
  editingTransaction?: SaleTransaction;
  onCancelEdit?: () => void;
}

export function SaleForm({ onSubmit, onUpdate, availableItems, editingTransaction, onCancelEdit }: SaleFormProps) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [customerName, setCustomerName] = useState("");

  const selectedItem = availableItems.find(item => item.id === selectedItemId);
  const maxQuantity = selectedItem?.quantity || 0;

  // Populate form when editing
  useEffect(() => {
    if (editingTransaction) {
      setSelectedItemId(editingTransaction.itemId);
      setQuantity(editingTransaction.quantity.toString());
      setPricePerUnit(editingTransaction.pricePerUnit.toString());
      setCustomerName(editingTransaction.customerName || "");
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItemId || !quantity || !pricePerUnit) {
      toast.error("Please fill all required fields");
      return;
    }

    const quantityNum = parseFloat(quantity);
    
    // When editing, check if new quantity is valid
    if (!editingTransaction && quantityNum > maxQuantity) {
      toast.error(`Insufficient stock! Available: ${maxQuantity} kg`);
      return;
    }

    // When editing, add back the old quantity to available stock before checking
    if (editingTransaction) {
      const availableWithOld = editingTransaction.itemId === selectedItemId 
        ? maxQuantity + editingTransaction.quantity 
        : maxQuantity;
      
      if (quantityNum > availableWithOld) {
        toast.error(`Insufficient stock! Available: ${availableWithOld} kg`);
        return;
      }
    }

    if (!selectedItem) return;

    const priceNum = parseFloat(pricePerUnit);
    
    const saleData = {
      itemId: selectedItemId,
      itemName: `${selectedItem.name} (${selectedItem.variety})`,
      quantity: quantityNum,
      pricePerUnit: priceNum,
      totalAmount: quantityNum * priceNum,
      date: editingTransaction?.date || new Date(),
      customerName: customerName || undefined
    };

    if (editingTransaction && onUpdate) {
      onUpdate(editingTransaction.id, saleData);
      toast.success("Sale updated successfully!");
    } else {
      onSubmit(saleData);
      toast.success("Sale recorded successfully!");
    }

    // Reset form
    setSelectedItemId("");
    setQuantity("");
    setPricePerUnit("");
    setCustomerName("");
    
    if (onCancelEdit) onCancelEdit();
  };

  const handleCancel = () => {
    setSelectedItemId("");
    setQuantity("");
    setPricePerUnit("");
    setCustomerName("");
    if (onCancelEdit) onCancelEdit();
  };

  const calculateTotal = () => {
    const q = parseFloat(quantity) || 0;
    const p = parseFloat(pricePerUnit) || 0;
    return q * p;
  };

  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
          {editingTransaction ? 'Edit Sale' : 'Record Sale'}
        </CardTitle>
        <CardDescription>
          {editingTransaction ? 'Update sale details' : 'Register a sale transaction'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sale-item">Select Item</Label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger id="sale-item">
                <SelectValue placeholder="Choose rice variety" />
              </SelectTrigger>
              <SelectContent>
                {availableItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} ({item.variety}) - Available: {item.quantity} kg
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name (Optional)</Label>
            <Input
              id="customer"
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale-quantity">Quantity (kg)</Label>
              <Input
                id="sale-quantity"
                type="number"
                step="0.01"
                placeholder="0.00"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {selectedItem && (
                <p className="text-xs text-muted-foreground">
                  Available: {maxQuantity} kg
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale-price">Selling Price per kg (₹)</Label>
              <Input
                id="sale-price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
              />
            </div>
          </div>

          {quantity && pricePerUnit && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex justify-between items-center">
                <span className="text-green-700 dark:text-green-300">Total Amount:</span>
                <span className="font-semibold text-green-900 dark:text-green-100">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            {editingTransaction ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Sale
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Record Sale
              </>
            )}
          </Button>

          {editingTransaction && (
            <Button type="button" variant="outline" className="w-full border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={handleCancel}>
              Cancel Edit
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}