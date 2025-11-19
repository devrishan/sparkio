"use client";

import { useEffect, useState } from "react";
import { Package, Plus, ShoppingBag, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface UserProduct {
  id: number;
  product_name: string;
  store_name: string;
  category_name: string;
  order_id: string | null;
  transaction_id: string | null;
  order_date: string | null;
  amount_paid: number;
  payment_method: string;
  product_link: string | null;
  notes: string | null;
  status: string;
  proof_count: number;
  created_at: string;
}

interface ProductsResponse {
  success: boolean;
  products: UserProduct[];
}

export function MemberProductsClient() {
  const { toast } = useToast();
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/member/user-products.php");
      const data: ProductsResponse = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "used":
        return "bg-success/10 text-success border-success/20";
      case "suggested":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
          <p className="text-muted-foreground">
            Add your orders once and reuse them for multiple tasks
          </p>
        </div>
        <Button onClick={() => {
          toast({
            title: "Coming soon",
            description: "Product addition form will be available shortly",
          });
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No products yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first product to start earning rewards
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="spark-border">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                  {product.proof_count > 0 && (
                    <Badge variant="outline" className="bg-muted/20 text-muted-foreground">
                      {product.proof_count} files
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-1">{product.product_name}</CardTitle>
                <CardDescription>{product.store_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{product.category_name}</span>
                </div>

                {product.order_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Date(product.order_date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-success" />
                  <span className="text-lg font-bold text-success">₹{product.amount_paid}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {product.payment_method.toUpperCase()}
                  </span>
                </div>

                {product.order_id && (
                  <p className="text-xs text-muted-foreground">
                    Order ID: {product.order_id}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Use in Task
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Suggest
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
