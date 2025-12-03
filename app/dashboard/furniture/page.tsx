"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Home,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sofa,
  Sparkles,
  Table,
  Trash2,
  X,
} from "lucide-react";

import { SectionCard, StatCard, StatusPill, type StatusTone } from "@/components/dashboard";
import { cn } from "@/lib/utils";

type FurnitureCategory = "Chair" | "Table" | "Decor" | "Storage" | "All";

interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  cost: number;
  stock: number;
  image: string;
  description: string;
  deliveryRegion?: string;
  redemptionLimit?: number;
}

const FURNITURE_ITEMS: FurnitureItem[] = [
  {
    id: "FURN-001",
    name: "Ergonomic Office Chair",
    category: "Chair",
    cost: 1200,
    stock: 15,
    image: "/furniture/chair-1.jpg",
    description: "Comfortable ergonomic office chair with lumbar support. Perfect for long work sessions.",
    deliveryRegion: "All India",
    redemptionLimit: 1,
  },
  {
    id: "FURN-002",
    name: "Modern Coffee Table",
    category: "Table",
    cost: 1800,
    stock: 8,
    image: "/furniture/table-1.jpg",
    description: "Sleek modern coffee table with glass top. Fits perfectly in any living room.",
    deliveryRegion: "Metro cities",
    redemptionLimit: 1,
  },
  {
    id: "FURN-003",
    name: "Wall Art Set",
    category: "Decor",
    cost: 450,
    stock: 25,
    image: "/furniture/decor-1.jpg",
    description: "Set of 3 framed wall art pieces. Add personality to any room.",
    deliveryRegion: "All India",
    redemptionLimit: 2,
  },
  {
    id: "FURN-004",
    name: "Storage Cabinet",
    category: "Storage",
    cost: 2200,
    stock: 3,
    image: "/furniture/storage-1.jpg",
    description: "Spacious storage cabinet with multiple shelves. Organize your space efficiently.",
    deliveryRegion: "All India",
    redemptionLimit: 1,
  },
  {
    id: "FURN-005",
    name: "Dining Chair Set (4)",
    category: "Chair",
    cost: 1600,
    stock: 12,
    image: "/furniture/chair-2.jpg",
    description: "Set of 4 modern dining chairs. Comfortable and stylish.",
    deliveryRegion: "All India",
    redemptionLimit: 1,
  },
  {
    id: "FURN-006",
    name: "Side Table",
    category: "Table",
    cost: 650,
    stock: 20,
    image: "/furniture/table-2.jpg",
    description: "Compact side table perfect for bedrooms or living rooms.",
    deliveryRegion: "All India",
    redemptionLimit: 2,
  },
  {
    id: "FURN-007",
    name: "Desk Lamp",
    category: "Decor",
    cost: 350,
    stock: 0,
    image: "/furniture/decor-2.jpg",
    description: "Modern LED desk lamp with adjustable brightness. Out of stock.",
    deliveryRegion: "All India",
    redemptionLimit: 1,
  },
  {
    id: "FURN-008",
    name: "Bookshelf",
    category: "Storage",
    cost: 1400,
    stock: 5,
    image: "/furniture/storage-2.jpg",
    description: "5-tier bookshelf with adjustable shelves. Display your collection beautifully.",
    deliveryRegion: "Metro cities",
    redemptionLimit: 1,
  },
];

const redemptionHistory = [
  {
    id: "RED-001",
    itemName: "Ergonomic Office Chair",
    redemptionDate: "Aug 20, 2024",
    status: "Delivered",
    receiptUrl: "#",
  },
  {
    id: "RED-002",
    itemName: "Wall Art Set",
    redemptionDate: "Aug 18, 2024",
    status: "Shipped",
    receiptUrl: "#",
  },
  {
    id: "RED-003",
    itemName: "Side Table",
    redemptionDate: "Aug 15, 2024",
    status: "Processing",
    receiptUrl: "#",
  },
];

const getCategoryIcon = (category: FurnitureCategory) => {
  switch (category) {
    case "Chair":
      return <Sofa className="h-4 w-4" />;
    case "Table":
      return <Table className="h-4 w-4" />;
    case "Storage":
      return <Package className="h-4 w-4" />;
    case "Decor":
      return <Sparkles className="h-4 w-4" />;
    default:
      return <Home className="h-4 w-4" />;
  }
};

interface CartItem {
  item: FurnitureItem;
  quantity: number;
}

const getStockStatus = (stock: number): { label: string; tone: StatusTone } => {
  if (stock === 0) {
    return { label: "Out of Stock", tone: "pending" };
  }
  if (stock < 5) {
    return { label: "Low Stock", tone: "warning" };
  }
  return { label: "Available", tone: "success" };
};

export default function FurnitureCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<FurnitureCategory>("All");
  const [costRange, setCostRange] = useState<"all" | "low" | "medium" | "high">("all");
  const [availability, setAvailability] = useState<"all" | "available" | "low" | "out">("all");
  const [sortBy, setSortBy] = useState<"newest" | "lowest" | "popular">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null);
  const [activeTab, setActiveTab] = useState<"catalog" | "history">("catalog");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [upiForm, setUpiForm] = useState({ upiId: "aditir@upi", note: "" });
  const [checkoutResult, setCheckoutResult] = useState<string | null>(null);

  const categories: FurnitureCategory[] = ["All", "Chair", "Table", "Decor", "Storage"];

  const filteredItems = useMemo(() => {
    let filtered = FURNITURE_ITEMS.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      // Cost range filter
      if (costRange === "low" && item.cost >= 1000) return false;
      if (costRange === "medium" && (item.cost < 1000 || item.cost >= 2000)) return false;
      if (costRange === "high" && item.cost < 2000) return false;

      // Availability filter
      if (availability === "available" && item.stock === 0) return false;
      if (availability === "low" && item.stock >= 5) return false;
      if (availability === "out" && item.stock > 0) return false;

      return true;
    });

    // Sort
    const sorted = [...filtered];
    if (sortBy === "lowest") {
      sorted.sort((a, b) => a.cost - b.cost);
    } else if (sortBy === "popular") {
      // Mock popularity based on stock (lower stock = more popular)
      sorted.sort((a, b) => a.stock - b.stock);
    }
    // "newest" is default order

    return sorted;
  }, [selectedCategory, costRange, availability, sortBy, searchQuery]);

  const totalItems = FURNITURE_ITEMS.length;
  const availableItems = FURNITURE_ITEMS.filter((item) => item.stock > 0).length;
  const lowStockItems = FURNITURE_ITEMS.filter((item) => item.stock > 0 && item.stock < 5).length;
  const totalRedemptions = redemptionHistory.length;
  const cartTotal = cartItems.reduce((sum, entry) => sum + entry.item.cost * entry.quantity, 0);

  const addToCart = (item: FurnitureItem) => {
    if (item.stock === 0) return;
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.item.id === item.id
            ? { ...entry, quantity: Math.min(entry.quantity + 1, item.redemptionLimit ?? 3) }
            : entry
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((entry) => entry.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((entry) =>
        entry.item.id === itemId
          ? {
              ...entry,
              quantity: Math.max(
                1,
                Math.min(quantity, entry.item.redemptionLimit ?? entry.item.stock ?? 5)
              ),
            }
          : entry
      )
    );
  };

  const handleCheckout = (event: React.FormEvent) => {
    event.preventDefault();
    if (cartItems.length === 0) return;

    setCheckoutResult(
      `UPI request of ₹${cartTotal.toLocaleString()} sent to ${upiForm.upiId}. Redemption will reflect in your cart history shortly.`
    );
    setCartItems([]);
    setCheckoutOpen(false);
    setTimeout(() => setCheckoutResult(null), 6000);
  };

  const summaryStats = [
    {
      label: "Total items",
      value: totalItems.toString(),
      hint: `${availableItems} available`,
      icon: <ShoppingBag className="h-4 w-4 text-orange-300" />,
      accent: "from-orange-500/10 via-orange-500/0 to-transparent",
    },
    {
      label: "Low stock",
      value: lowStockItems.toString(),
      hint: "Requires attention",
      icon: <Package className="h-4 w-4 text-yellow-300" />,
      accent: "from-yellow-500/10 via-yellow-500/0 to-transparent",
    },
    {
      label: "Your redemptions",
      value: totalRedemptions.toString(),
      hint: "All time",
      icon: <Home className="h-4 w-4 text-emerald-300" />,
      accent: "from-emerald-500/10 via-emerald-500/0 to-transparent",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Furniture catalog</p>
            <h1 className="text-3xl font-semibold text-white">Redeemable Furniture</h1>
            <p className="text-sm text-muted-foreground">
              Use your earnings to unlock home essentials and upgrade your space.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
            onClick={() => setActiveTab("catalog")}
            aria-label="Open furniture cart"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-orange-300" />
              {cartItems.length > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
                  {cartItems.length}
                </span>
              )}
            </div>
            Cart total: ₹{cartTotal.toLocaleString()}
          </button>
        </div>
        {checkoutResult && (
          <div
            aria-live="polite"
            className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            {checkoutResult}
          </div>
        )}
      </header>

      <section className="grid gap-4 md:grid-cols-3">
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab("catalog")}
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-semibold transition",
            activeTab === "catalog"
              ? "border-orange-500 text-orange-200"
              : "border-transparent text-white/70 hover:text-white"
          )}
        >
          Catalog
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-semibold transition",
            activeTab === "history"
              ? "border-orange-500 text-orange-200"
              : "border-transparent text-white/70 hover:text-white"
          )}
        >
          Redemption History
        </button>
      </div>

      {activeTab === "catalog" ? (
        <>
          {/* Filters */}
          <SectionCard title="Filters" subtitle="Refine your search">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm focus-within:border-white/30">
                  <Search className="h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                    className="bg-transparent text-white placeholder:text-white/50 focus:outline-none"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="text-xs text-white/70">Category:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition",
                      selectedCategory === cat
                        ? "border-orange-500/70 bg-orange-500/15 text-white"
                        : "border-white/10 text-white/70 hover:text-white"
                    )}
                  >
                    {cat !== "All" && getCategoryIcon(cat)}
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="text-xs text-white/70">Cost:</span>
                {(["all", "low", "medium", "high"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setCostRange(range)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition capitalize",
                      costRange === range
                        ? "border-orange-500/70 bg-orange-500/15 text-white"
                        : "border-white/10 text-white/70 hover:text-white"
                    )}
                  >
                    {range === "all" ? "All" : range === "low" ? "< ₹1000" : range === "medium" ? "₹1000-2000" : "> ₹2000"}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="text-xs text-white/70">Availability:</span>
                {(["all", "available", "low", "out"] as const).map((avail) => (
                  <button
                    key={avail}
                    onClick={() => setAvailability(avail)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition capitalize",
                      availability === avail
                        ? "border-orange-500/70 bg-orange-500/15 text-white"
                        : "border-white/10 text-white/70 hover:text-white"
                    )}
                  >
                    {avail === "all" ? "All" : avail === "available" ? "Available" : avail === "low" ? "Low Stock" : "Out of Stock"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-white/70">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="rounded-xl border border-white/10 bg-[#050712] px-4 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="newest" className="bg-[#050712]">Newest</option>
                  <option value="lowest" className="bg-[#050712]">Lowest Cost</option>
                  <option value="popular" className="bg-[#050712]">Most Popular</option>
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Furniture Grid */}
          <SectionCard title="Furniture Catalog" subtitle={`${filteredItems.length} items found`}>
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-[#050507] px-6 py-10 text-center">
                <ShoppingBag className="h-12 w-12 text-white/30" />
                <p className="text-white">No items found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item.stock);
                  return (
                    <div
                      key={item.id}
                      className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                    >
                      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-white/5">
                        <div className="flex h-full items-center justify-center">
                          {getCategoryIcon(item.category)}
                        </div>
                        {item.stock === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <span className="text-sm font-semibold text-white">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          <StatusPill label={item.category} tone="brand" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-orange-400">₹{item.cost}</span>
                          <StatusPill label={stockStatus.label} tone={stockStatus.tone} />
                        </div>
                        <p className="text-xs text-white/60">Stock: {item.stock} units</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            disabled={item.stock === 0}
                            className={cn(
                              "flex-1 rounded-xl border px-4 py-2 text-xs font-semibold transition",
                              item.stock === 0
                                ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                                : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                            )}
                          >
                            Details
                          </button>
                          <button
                            onClick={() => addToCart(item)}
                            disabled={item.stock === 0}
                            className={cn(
                              "flex-1 rounded-xl border px-4 py-2 text-xs font-semibold transition",
                              item.stock === 0
                                ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                                : "border-orange-500/40 bg-orange-500/10 text-orange-200 hover:border-orange-500 hover:bg-orange-500/20"
                            )}
                          >
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Your cart"
            subtitle={cartItems.length === 0 ? "Add furniture to begin checkout" : undefined}
            actions={
              cartItems.length > 0 ? (
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1 text-xs font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Proceed to UPI checkout
                </button>
              ) : null
            }
          >
            {cartItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-white/60">
                Your cart is empty. Add furniture items to see them here.
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((entry) => (
                  <div
                    key={entry.item.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-white">{entry.item.name}</p>
                      <p className="text-xs text-white/60">
                        ₹{entry.item.cost.toLocaleString()} · {entry.item.category}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs">
                        Qty
                        <input
                          type="number"
                          min={1}
                          max={entry.item.redemptionLimit ?? entry.item.stock ?? 5}
                          value={entry.quantity}
                          onChange={(event) => updateQuantity(entry.item.id, Number(event.target.value))}
                          className="w-12 rounded bg-[#050507] px-2 py-1 text-center text-white outline-none"
                        />
                      </label>
                      <span className="text-sm font-semibold text-white">
                        ₹{(entry.item.cost * entry.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(entry.item.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="text-sm text-white/70">Total</span>
                  <span className="text-2xl font-bold text-orange-400">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            )}
          </SectionCard>
        </>
      ) : (
        <SectionCard title="Redemption History" subtitle="Track your furniture redemptions">
          {redemptionHistory.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-[#050507] px-6 py-10 text-center">
              <ShoppingBag className="h-12 w-12 text-white/30" />
              <p className="text-white">No redemptions yet</p>
              <p className="text-sm text-muted-foreground">Redeem items from the catalog to see them here</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Redemption Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#090C12]">
                  {redemptionHistory.map((redemption) => {
                    const statusTone: Record<string, StatusTone> = {
                      Delivered: "success",
                      Shipped: "info",
                      Processing: "pending",
                    };
                    return (
                      <tr key={redemption.id} className="text-sm text-muted-foreground">
                        <td className="px-4 py-4 font-semibold text-white">{redemption.itemName}</td>
                        <td className="px-4 py-4">{redemption.redemptionDate}</td>
                        <td className="px-4 py-4">
                          <StatusPill label={redemption.status} tone={statusTone[redemption.status]} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => alert("Download receipt (Demo only)")}
                            className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Receipt
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {/* Item Detail Slide-Over */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-2xl transform bg-[#090C12] p-6 shadow-2xl transition-transform duration-300",
          selectedItem ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedItem && (
          <div className="flex h-full flex-col space-y-6 overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">{selectedItem.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Item ID: {selectedItem.id}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/5">
              <div className="flex h-full items-center justify-center">
                {getCategoryIcon(selectedItem.category)}
              </div>
            </div>

            <SectionCard className="bg-white/5" title="Description">
              <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
            </SectionCard>

            <SectionCard className="bg-white/5" title="Pricing & Availability">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reward Cost</span>
                  <span className="text-2xl font-bold text-orange-400">₹{selectedItem.cost}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available Stock</span>
                  <span className="font-semibold text-white">{selectedItem.stock} units</span>
                </div>
                {selectedItem.redemptionLimit && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Redemption Limit</span>
                    <span className="font-semibold text-white">{selectedItem.redemptionLimit} per user</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Delivery Region</span>
                  <span className="font-semibold text-white">{selectedItem.deliveryRegion || "All India"}</span>
                </div>
                <div className="mt-4">
                  <StatusPill
                    label={getStockStatus(selectedItem.stock).label}
                    tone={getStockStatus(selectedItem.stock).tone}
                  />
                </div>
              </div>
            </SectionCard>

            <div className="mt-auto flex gap-3">
              <button
                onClick={() => addToCart(selectedItem)}
                disabled={selectedItem.stock === 0}
                className={cn(
                  "flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                  selectedItem.stock === 0
                    ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                    : "border-orange-500/40 bg-orange-500/10 text-orange-200 hover:border-orange-500 hover:bg-orange-500/20"
                )}
              >
                {selectedItem.stock === 0 ? "Out of Stock" : "Add to cart"}
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
          aria-hidden="true"
        />
      )}

      {/* Checkout Modal */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10 opacity-0 transition duration-200",
          checkoutOpen && "opacity-100"
        )}
        style={{ pointerEvents: checkoutOpen ? "auto" : "none" }}
        aria-hidden={!checkoutOpen}
      >
        <div
          className={cn(
            "w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b0f18] p-6 text-white shadow-2xl transition-all",
            checkoutOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">UPI checkout</p>
              <h3 className="text-2xl font-semibold">Confirm redemption</h3>
            </div>
            <button
              onClick={() => setCheckoutOpen(false)}
              className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
              aria-label="Close checkout"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form className="mt-6 space-y-4 text-sm" onSubmit={handleCheckout}>
            <label className="space-y-2">
              <span>UPI ID</span>
              <input
                value={upiForm.upiId}
                onChange={(event) => setUpiForm((prev) => ({ ...prev, upiId: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                required
              />
              <p className="text-xs text-muted-foreground">Example: aditir@upi</p>
            </label>
            <label className="space-y-2">
              <span>Note (optional)</span>
              <input
                value={upiForm.note}
                onChange={(event) => setUpiForm((prev) => ({ ...prev, note: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                placeholder="Add a reference note"
              />
            </label>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Total amount</span>
                <span className="text-xl font-bold text-orange-400">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={cartItems.length === 0}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                cartItems.length === 0
                  ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                  : "border-orange-500/40 bg-orange-500/10 text-orange-200 hover:border-orange-500 hover:bg-orange-500/20"
              )}
            >
              Confirm UPI redemption
            </button>
            <p className="text-xs text-muted-foreground">
              This is a mock flow. No real payments will be processed.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

