"use client";

import { useMemo, useState } from "react";
import { AppWindow, CreditCard, Share2, Edit, Plus, X, ToggleLeft, ToggleRight, Package, IndianRupee, Eye, EyeOff } from "lucide-react";

import { SectionCard, StatusPill, StatCard } from "@/components/dashboard";
import { cn } from "@/lib/utils";

type ProductCategory = "App" | "UPI" | "Social" | "Referral";

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  reward: number;
  minReward?: number;
  maxReward?: number;
  stock: number | "unlimited";
  claimed: number;
  visible: boolean;
  notes?: string;
}

const ADMIN_PRODUCTS: Product[] = [
  {
    id: "PROD-001",
    name: "GlowFit Premium Install",
    category: "App",
    reward: 150,
    minReward: 120,
    maxReward: 180,
    stock: 500,
    claimed: 342,
    visible: true,
    notes: "Android 11+ required, must open app for 2 minutes",
  },
  {
    id: "PROD-002",
    name: "Navi UPI Recharge",
    category: "UPI",
    reward: 290,
    minReward: 220,
    maxReward: 360,
    stock: 300,
    claimed: 287,
    visible: true,
  },
  {
    id: "PROD-003",
    name: "WhatsApp Status Blast",
    category: "Social",
    reward: 52,
    minReward: 25,
    maxReward: 80,
    stock: "unlimited",
    claimed: 156,
    visible: true,
  },
  {
    id: "PROD-004",
    name: "KineticPay Streak",
    category: "App",
    reward: 115,
    minReward: 90,
    maxReward: 140,
    stock: 200,
    claimed: 198,
    visible: false,
  },
  {
    id: "PROD-005",
    name: "Lumos Wallet Top-up",
    category: "UPI",
    reward: 260,
    minReward: 200,
    maxReward: 320,
    stock: 400,
    claimed: 89,
    visible: true,
  },
  {
    id: "PROD-006",
    name: "Referral Bonus Tier 1",
    category: "Referral",
    reward: 50,
    stock: "unlimited",
    claimed: 1240,
    visible: true,
  },
];

const getCategoryIcon = (category: ProductCategory) => {
  switch (category) {
    case "App":
      return <AppWindow className="h-4 w-4 text-orange-300" />;
    case "UPI":
      return <CreditCard className="h-4 w-4 text-blue-300" />;
    case "Social":
      return <Share2 className="h-4 w-4 text-purple-300" />;
    case "Referral":
      return <Share2 className="h-4 w-4 text-emerald-300" />;
  }
};

const getStockStatus = (product: Product): { label: string; tone: StatusPill["tone"] } => {
  if (product.stock === "unlimited") {
    return { label: "Unlimited", tone: "success" };
  }
  const available = product.stock - product.claimed;
  if (available === 0) {
    return { label: "Out of stock", tone: "pending" };
  }
  if (available < 10) {
    return { label: "Low stock", tone: "danger" };
  }
  return { label: "In stock", tone: "success" };
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(ADMIN_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({ ...product });
  };

  const handleSave = () => {
    if (selectedProduct) {
      setProducts(
        products.map((p) => (p.id === selectedProduct.id ? { ...p, ...editForm } as Product : p))
      );
      setSelectedProduct(null);
      setEditForm({});
    }
  };

  const handleCreate = () => {
    const newProduct: Product = {
      id: `PROD-${Date.now()}`,
      name: editForm.name || "New Product",
      category: editForm.category || "App",
      reward: editForm.reward || 100,
      minReward: editForm.minReward,
      maxReward: editForm.maxReward,
      stock: editForm.stock || 100,
      claimed: 0,
      visible: editForm.visible ?? true,
      notes: editForm.notes,
    };
    setProducts([...products, newProduct]);
    setIsCreating(false);
    setEditForm({});
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => {
    if (p.stock === "unlimited") return sum;
    return sum + (p.stock - p.claimed);
  }, 0);
  const totalClaimed = products.reduce((sum, p) => sum + p.claimed, 0);
  const visibleProducts = products.filter((p) => p.visible).length;

  const summaryStats = [
    {
      label: "Total products",
      value: totalProducts.toString(),
      hint: `${visibleProducts} visible`,
      icon: <Package className="h-4 w-4 text-orange-300" />,
      accent: "from-orange-500/10 via-orange-500/0 to-transparent",
    },
    {
      label: "Total stock",
      value: totalStock.toLocaleString(),
      hint: `${totalClaimed.toLocaleString()} claimed`,
      icon: <IndianRupee className="h-4 w-4 text-blue-300" />,
      accent: "from-blue-500/10 via-blue-500/0 to-transparent",
    },
    {
      label: "Low stock items",
      value: products.filter((p) => {
        if (p.stock === "unlimited") return false;
        return p.stock - p.claimed < 10;
      }).length.toString(),
      hint: "Requires attention",
      icon: <Package className="h-4 w-4 text-yellow-300" />,
      accent: "from-yellow-500/10 via-yellow-500/0 to-transparent",
    },
    {
      label: "Avg. reward",
      value: `₹${Math.round(products.reduce((sum, p) => sum + p.reward, 0) / products.length)}`,
      hint: "Per product",
      icon: <IndianRupee className="h-4 w-4 text-emerald-300" />,
      accent: "from-emerald-500/10 via-emerald-500/0 to-transparent",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Product management</p>
        <h1 className="text-3xl font-semibold text-white">Manage rewards and inventory tiers</h1>
        <p className="text-sm text-muted-foreground">Edit product rewards, stock levels, and visibility settings.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            icon={stat.icon}
            accent={stat.accent}
          />
        ))}
      </section>

      <SectionCard
        title="Products inventory"
        subtitle="Manage product rewards, stock, and visibility."
        actions={
          <button
            type="button"
            onClick={() => {
              setIsCreating(true);
              setEditForm({
                name: "",
                category: "App",
                reward: 100,
                stock: 100,
                visible: true,
              });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Create product
          </button>
        }
      >
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Reward</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090C12]">
              {products.map((product) => {
                const stockStatus = getStockStatus(product);
                const available = product.stock === "unlimited" ? "∞" : product.stock - product.claimed;
                const total = product.stock === "unlimited" ? "∞" : product.stock;
                return (
                  <tr key={product.id} className="text-sm text-muted-foreground transition hover:bg-white/5">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(product.category)}
                        <span className="font-semibold text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill label={product.category} tone="brand" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">₹{product.reward}</span>
                        {product.minReward && product.maxReward && (
                          <span className="text-xs text-white/60">₹{product.minReward} – ₹{product.maxReward}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="group relative">
                        <span className="font-semibold text-white">
                          {available} / {total}
                        </span>
                        <div className="absolute left-0 top-full z-10 mt-2 hidden w-48 rounded-xl border border-white/10 bg-[#050509] p-2 text-xs text-white/80 shadow-xl group-hover:block">
                          <p className="font-semibold text-white">Stock details:</p>
                          <p className="mt-1">
                            {product.claimed} claimed / {total === "∞" ? "Unlimited" : total} available
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill label={stockStatus.label} tone={stockStatus.tone} />
                    </td>
                    <td className="px-4 py-4">
                      {product.visible ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">
                          <Eye className="h-3 w-3" />
                          Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-2 py-1 text-xs text-white/50">
                          <EyeOff className="h-3 w-3" />
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Edit/Create Slide-over */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-2xl transform bg-[#090C12] p-6 shadow-2xl transition-transform duration-300",
          (selectedProduct || isCreating) ? "translate-x-0" : "translate-x-full"
        )}
      >
        {(selectedProduct || isCreating) && (
          <div className="flex h-full flex-col space-y-6 overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {isCreating ? "Create product" : "Edit product"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isCreating ? "Add a new product to inventory" : `Product ID: ${selectedProduct?.id}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setIsCreating(false);
                  setEditForm({});
                }}
                className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <SectionCard className="bg-white/5" title="Product details">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs text-white/60">Product name</label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    disabled={!isCreating}
                    className={cn(
                      "w-full rounded-xl border border-white/10 bg-[#050712] px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none",
                      !isCreating && "opacity-50 cursor-not-allowed"
                    )}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/60">Category</label>
                  <select
                    value={editForm.category || "App"}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as ProductCategory })}
                    className="w-full rounded-xl border border-white/10 bg-[#050712] px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="App" className="bg-[#050712]">App</option>
                    <option value="UPI" className="bg-[#050712]">UPI</option>
                    <option value="Social" className="bg-[#050712]">Social</option>
                    <option value="Referral" className="bg-[#050712]">Referral</option>
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs text-white/60">Reward amount (₹)</label>
                    <input
                      type="number"
                      value={editForm.reward || ""}
                      onChange={(e) => setEditForm({ ...editForm, reward: parseInt(e.target.value, 10) || 0 })}
                      className="w-full rounded-xl border border-white/10 bg-[#050712] px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs text-white/60">Reward tier (optional)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={editForm.minReward || ""}
                        onChange={(e) => setEditForm({ ...editForm, minReward: parseInt(e.target.value, 10) || undefined })}
                        className="w-full rounded-xl border border-white/10 bg-[#050712] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={editForm.maxReward || ""}
                        onChange={(e) => setEditForm({ ...editForm, maxReward: parseInt(e.target.value, 10) || undefined })}
                        className="w-full rounded-xl border border-white/10 bg-[#050712] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard className="bg-white/5" title="Inventory & visibility">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs text-white/60">Stock</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      {editForm.stock === "unlimited" ? (
                        <input
                          type="text"
                          value="Unlimited"
                          disabled
                          className="w-full rounded-xl border border-white/10 bg-[#050712] px-4 py-3 text-sm text-white/50 cursor-not-allowed"
                        />
                      ) : (
                        <input
                          type="number"
                          value={editForm.stock || ""}
                          onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value, 10) || 0 })}
                          className="w-full rounded-xl border border-white/10 bg-[#050712] px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                          placeholder="100"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({
                          ...editForm,
                          stock: editForm.stock === "unlimited" ? 100 : "unlimited",
                        });
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border px-4 py-3 text-xs transition",
                        editForm.stock === "unlimited"
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/40 hover:text-white"
                      )}
                    >
                      {editForm.stock === "unlimited" ? (
                        <>
                          <ToggleRight className="h-4 w-4" />
                          Unlimited
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4" />
                          Limited
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/60">Visibility</label>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, visible: !editForm.visible })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition",
                      editForm.visible
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/40 hover:text-white"
                    )}
                  >
                    <span>{editForm.visible ? "Visible to users" : "Hidden from users"}</span>
                    {editForm.visible ? (
                      <ToggleRight className="h-4 w-4 text-emerald-300" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-white/40" />
                    )}
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/60">Notes (optional)</label>
                  <textarea
                    value={editForm.notes || ""}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-[#050712] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-orange-500 focus:outline-none"
                    placeholder="Add internal notes or requirements..."
                  />
                </div>
              </div>
            </SectionCard>

            <div className="mt-auto flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setIsCreating(false);
                  setEditForm({});
                }}
                className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={isCreating ? handleCreate : handleSave}
                className="flex-1 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
              >
                {isCreating ? "Create product" : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </div>

      {(selectedProduct || isCreating) && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setSelectedProduct(null);
            setIsCreating(false);
            setEditForm({});
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
