import { useState, useEffect } from "react";
import { Plus, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

export interface PurchaseTransaction {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  date: Date;
  supplierName: string;
}

interface PurchaseFormProps {
  onSubmit: (purchase: Omit<PurchaseTransaction, 'id'>) => void;
  onUpdate?: (id: string, purchase: Omit<PurchaseTransaction, 'id'>) => void;
  availableItems: Array<{ id: string; name: string; variety: string }>;
  editingTransaction?: PurchaseTransaction;
  onCancelEdit?: () => void;
}

export function PurchaseForm({ onSubmit, onUpdate, availableItems, editingTransaction, onCancelEdit }: PurchaseFormProps) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [supplierName, setSupplierName] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (editingTransaction) {
      setSelectedItemId(editingTransaction.itemId);
      setQuantity(editingTransaction.quantity.toString());
      setPricePerUnit(editingTransaction.pricePerUnit.toString());
      setSupplierName(editingTransaction.supplierName);
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItemId || !quantity || !pricePerUnit || !supplierName) {
      toast.error("Please fill all fields");
      return;
    }

    const selectedItem = availableItems.find(item => item.id === selectedItemId);
    if (!selectedItem) return;

    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(pricePerUnit);
    
    const purchaseData = {
      itemId: selectedItemId,
      itemName: `${selectedItem.name} (${selectedItem.variety})`,
      quantity: quantityNum,
      pricePerUnit: priceNum,
      totalAmount: quantityNum * priceNum,
      date: editingTransaction?.date || new Date(),
      supplierName
    };

    if (editingTransaction && onUpdate) {
      onUpdate(editingTransaction.id, purchaseData);
      toast.success("Purchase updated successfully!");
    } else {
      onSubmit(purchaseData);
      toast.success("Purchase recorded successfully!");
    }

    // Reset form
    setSelectedItemId("");
    setQuantity("");
    setPricePerUnit("");
    setSupplierName("");
    
    if (onCancelEdit) onCancelEdit();
  };

  const handleCancel = () => {
    setSelectedItemId("");
    setQuantity("");
    setPricePerUnit("");
    setSupplierName("");
    if (onCancelEdit) onCancelEdit();
  };

  const calculateTotal = () => {
    const q = parseFloat(quantity) || 0;
    const p = parseFloat(pricePerUnit) || 0;
    return q * p;
  };

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          {editingTransaction ? 'Edit Purchase' : 'Record Purchase'}
        </CardTitle>
        <CardDescription>
          {editingTransaction ? 'Update purchase details' : 'Add new stock purchase to inventory'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">Select Item</Label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger id="item">
                <SelectValue placeholder="Choose rice variety" />
              </SelectTrigger>
              <SelectContent>
                {availableItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} ({item.variety})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier Name</Label>
            <Input
              id="supplier"
              type="text"
              placeholder="Enter supplier name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (kg)</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per kg (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
              />
            </div>
          </div>

          {quantity && pricePerUnit && (
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex justify-between items-center">
                <span className="text-emerald-700 dark:text-emerald-300">Total Amount:</span>
                <span className="font-semibold text-emerald-900 dark:text-emerald-100">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            {editingTransaction ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Purchase
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Purchase
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