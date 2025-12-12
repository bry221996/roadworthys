import { Material } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface MaterialCardProps {
  material: Material;
  onAddToCart?: (material: Material) => void;
}

export default function MaterialCard({ material, onAddToCart }: MaterialCardProps) {
  const price = useMemo(() => parseFloat(material.price), [material.price]);

  const isInventoried = useMemo(
    () => material.item_is_inventoried === '1' || material.item_is_inventoried === 'true',
    [material.item_is_inventoried]
  );

  const inStock = useMemo(
    () => !isInventoried || material.quantity_in_stock > 0,
    [isInventoried, material.quantity_in_stock]
  );

  const stockDisplay = useMemo(() => {
    if (!isInventoried) {
      return {
        text: 'Always Available',
        className: 'text-green-600'
      };
    }
    if (material.quantity_in_stock > 0) {
      return {
        text: `${material.quantity_in_stock} available`,
        className: 'text-green-600'
      };
    }
    return {
      text: 'Out of stock',
      className: 'text-red-600'
    };
  }, [isInventoried, material.quantity_in_stock]);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{material.name}</CardTitle>
        <CardDescription className="text-xs">
          Item #{material.item_number}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {material.item_description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {material.item_description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price:</span>
            <span className="text-lg font-bold text-blue-600">
              ${price.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Stock:</span>
            <span className={`text-sm font-medium ${stockDisplay.className}`}>
              {stockDisplay.text}
            </span>
          </div>

          {material.barcode && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Barcode:</span>
              <span className="text-xs font-mono">{material.barcode}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button
          className="w-full"
          onClick={() => onAddToCart?.(material)}
          disabled={!inStock}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}