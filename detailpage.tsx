import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

type MenuData = {
  name?: string;
  price?: string; // e.g. "25.000" or "25000"
  image?: any;
  description?: string;
};

type Props = {
  data?: MenuData;
  goBack?: () => void;
  onAddToCart?: (payload: any) => void;
  onBuyNow?: (payload: any) => void;
};

const toppingPrices: { [k: string]: number } = {
  "Extra Shot": 5000,
  "Whipped Cream": 3000,
  Caramel: 3000,
  Chocolate: 3000,
};

export default function DetailMenu({ data, goBack, onAddToCart, onBuyNow }: Props) {
  const baseName = data?.name ?? "Unknown Coffee";
  const basePriceStr = data?.price ?? "25000";

  const normalizePrice = (p: string) =>
    Number(p.replace(/\./g, "").replace(/[^0-9]/g, "")) || 25000;
  const basePriceNum = normalizePrice(basePriceStr);

  const [size, setSize] = useState<"S" | "M" | "L">("M");
  const [sugar, setSugar] = useState<"No" | "Less" | "Normal" | "Extra">("Normal");
  const [temp, setTemp] = useState<"Hot" | "Iced">("Hot");
  const [qty, setQty] = useState<number>(1);
  const [toppings, setToppings] = useState<{ [k: string]: boolean }>({
    "Extra Shot": false,
    "Whipped Cream": false,
    Caramel: false,
    Chocolate: false,
  });

  const sizeMultiplier = { S: 0.9, M: 1, L: 1.3 };

  const toppingsTotal = useMemo(
    () =>
      Object.entries(toppings).reduce(
        (sum, [k, v]) => (v ? sum + (toppingPrices[k] ?? 0) : sum),
        0
      ),
    [toppings]
  );

  const unitPrice = Math.round(basePriceNum * (sizeMultiplier[size] ?? 1) + toppingsTotal);
  const totalPrice = unitPrice * qty;

  const currency = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  function toggleTopping(key: string) {
    setToppings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleAddToCart() {
    const payload = {
      name: baseName,
      size,
      sugar,
      temp,
      toppings: Object.keys(toppings).filter((k) => toppings[k]),
      qty,
      unitPrice,
      totalPrice,
    };
    if (onAddToCart) onAddToCart(payload);
    else Alert.alert("Added to cart", JSON.stringify(payload, null, 2));
  }

  function handleBuyNow() {
    const payload = {
      name: baseName,
      size,
      sugar,
      temp,
      toppings: Object.keys(toppings).filter((k) => toppings[k]),
      qty,
      unitPrice,
      totalPrice,
    };
    if (onBuyNow) onBuyNow(payload);
    else Alert.alert("Order placed", `Total: Rp ${currency(totalPrice)}`);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Menu</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Image */}
      <View style={styles.imageWrap}>
        {data?.image ? (
          <Image source={data.image} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.name}>{baseName}</Text>
        <Text style={styles.desc}>{data?.description ?? "Premium handcrafted coffee made to perfection."}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Unit price:</Text>
          <Text style={styles.value}>Rp {currency(basePriceNum)}</Text>
        </View>
      </View>

      {/* Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.optionRow}>
          {(["S", "M", "L"] as const).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.optionBtn, size === s && styles.optionBtnActive]}
              onPress={() => setSize(s)}
            >
              <Text style={[styles.optionText, size === s && styles.optionTextActive]}>
                {s === "S" ? "Small" : s === "M" ? "Medium" : "Large"}
              </Text>
              <Text style={[styles.optionSub, size === s && styles.optionSubActive]}>
                x{(sizeMultiplier[s] ?? 1).toFixed(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sugar</Text>
        <View style={styles.optionRow}>
          {(["No", "Less", "Normal", "Extra"] as const).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.optionBtnSmall, sugar === s && styles.optionBtnActiveSmall]}
              onPress={() => setSugar(s)}
            >
              <Text style={[styles.optionTextSmall, sugar === s && styles.optionTextActiveSmall]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temperature</Text>
        <View style={styles.optionRow}>
          {(["Hot", "Iced"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.optionBtnSmall, temp === t && styles.optionBtnActiveSmall]}
              onPress={() => setTemp(t)}
            >
              <Text style={[styles.optionTextSmall, temp === t && styles.optionTextActiveSmall]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toppings</Text>
        <View style={styles.optionRowWrap}>
          {Object.keys(toppings).map((k) => (
            <TouchableOpacity
              key={k}
              style={[styles.toppingBtn, toppings[k] && styles.toppingBtnActive]}
              onPress={() => toggleTopping(k)}
            >
              <Text style={[styles.toppingText, toppings[k] && styles.toppingTextActive]}>
                {k} (+Rp {currency(toppingPrices[k] ?? 0)})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quantity & Total */}
      <View style={styles.sectionRow}>
        <View style={styles.qtyBox}>
          <TouchableOpacity onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{qty}</Text>
          <TouchableOpacity onPress={() => setQty((q) => q + 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rp {currency(totalPrice)}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.addToCartBtn]} onPress={handleAddToCart}>
          <Text style={[styles.actionText, styles.addToCartText]}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.buyNowBtn]} onPress={handleBuyNow}>
          <Text style={[styles.actionText, styles.buyNowText]}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 14, 
    paddingTop: 12, 
    paddingBottom: 6 
  },
  backBtn: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  backText: { fontSize: 20 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  imageWrap: { alignItems: "center", marginTop: 6 },
  image: { width: 240, height: 200, borderRadius: 12, resizeMode: "cover" },
  imagePlaceholder: { 
    width: 240, 
    height: 200, 
    borderRadius: 12, 
    backgroundColor: "#eee", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  imagePlaceholderText: { color: "#999" },
  infoBox: { paddingHorizontal: 16, paddingTop: 12 },
  name: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  desc: { color: "#666", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  label: { color: "#444" },
  value: { fontWeight: "700" },
  section: { paddingHorizontal: 16, paddingTop: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  optionRow: { flexDirection: "row", gap: 10 },
  optionRowWrap: { flexDirection: "row", flexWrap: "wrap" },
  optionBtn: { 
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    borderRadius: 10, 
    backgroundColor: "#f3f3f3", 
    marginRight: 10 
  },
  optionBtnActive: { backgroundColor: "#442908ff" },
  optionText: { color: "#333" },
  optionTextActive: { color: "#fff", fontWeight: "700" },
  optionSub: { fontSize: 12, color: "#666", marginTop: 2 },
  optionSubActive: { color: "#fff" },
  toppingBtn: { 
    paddingVertical: 8, 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    backgroundColor: "#f2f2f2", 
    marginRight: 8, 
    marginBottom: 8 
  },
  toppingBtnActive: { backgroundColor: "#442908ff" },
  toppingText: { color: "#333" },
  toppingTextActive: { color: "#fff", fontWeight: "700" },
  optionBtnSmall: { 
    paddingVertical: 8, 
    paddingHorizontal: 10, 
    borderRadius: 8, 
    backgroundColor: "#f2f2f2", 
    marginRight: 8 
  },
  optionBtnActiveSmall: { backgroundColor: "#442908ff" },
  optionTextSmall: { color: "#333" },
  optionTextActiveSmall: { color: "#fff", fontWeight: "700" },
  sectionRow: { 
    paddingHorizontal: 16, 
    paddingTop: 14, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  qtyBox: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fafafa", 
    borderRadius: 10 
  },
  qtyBtn: { padding: 10 },
  qtyBtnText: { fontSize: 20, fontWeight: "700" },
  qtyValue: { paddingHorizontal: 12, fontSize: 18, fontWeight: "700" },
  totalBox: { alignItems: "flex-end" },
  totalLabel: { color: "#666" },
  totalValue: { fontSize: 20, fontWeight: "800", marginTop: 6 },
  actionsRow: { 
    marginTop: 18, 
    paddingHorizontal: 16, 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  actionBtn: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: "center", 
    marginHorizontal: 6 
  },
  addToCartBtn: { backgroundColor: "#f2f2f2" },
  buyNowBtn: { backgroundColor: "#442908ff" },
  actionText: { fontSize: 16, fontWeight: "700" },
  addToCartText: { color: "#333" },
  buyNowText: { color: "#fff" },
});