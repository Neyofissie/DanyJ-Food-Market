/*
 * FarmLink Food Market — catalogue data
 * ------------------------------------------------------------
 * This is the ONLY file you need to edit to change products, prices,
 * producers, categories or bundles.
 *
 * NOTE: the entries below are PLACEHOLDERS. Replace them with the real
 * products, prices and photos from the current FarmLink shop.
 *
 * Product images: drop a photo into assets/img/products/ and set
 * `image: "assets/img/products/your-file.jpg"`. Until an image is set,
 * the product shows an illustrated tile using `emoji` + `tint`.
 */

window.FARMLINK = {
  store: {
    name: "FarmLink",
    fullName: "FarmLink Food Market",
    tagline: "Everyday freshness, straight from the farm",
    currency: "GBP",
    freeDeliveryOver: 40,
    deliveryFee: 3.99,
    email: "hello@farmlinkfoodmarket.co.uk",
    phone: "+44 (0)000 000 0000",
    address: "Your address, Town, Postcode, UK",
    defaultArea: "London, UK",
    nextDelivery: "Tomorrow, 8am – 12pm",
  },

  categories: [
    { id: "produce", name: "Fruit & Veg", emoji: "🥦", tint: "#e6f0dc" },
    { id: "dairy", name: "Dairy & Eggs", emoji: "🥛", tint: "#eef1f6" },
    { id: "bakery", name: "Bakery", emoji: "🥐", tint: "#f7ead8" },
    { id: "meat", name: "Meat & Fish", emoji: "🥩", tint: "#f6e1dc" },
    { id: "pantry", name: "Pantry", emoji: "🫙", tint: "#f3ecdc" },
    { id: "drinks", name: "Drinks", emoji: "🧃", tint: "#e3f0ee" },
    { id: "world", name: "World Foods", emoji: "🌶️", tint: "#f8e4d6" },
    { id: "snacks", name: "Snacks", emoji: "🍪", tint: "#f4e9df" },
  ],

  producers: [
    { id: "greenacre", name: "Greenacre Farm", county: "Kent" },
    { id: "meadow", name: "Meadowbrook Dairy", county: "Somerset" },
    { id: "hearth", name: "Hearth & Hive", county: "Herefordshire" },
    { id: "oakfield", name: "Oakfield Bakehouse", county: "Surrey" },
    { id: "coast", name: "Coastline Catch", county: "Cornwall" },
    { id: "spice", name: "Spice Route Pantry", county: "London" },
  ],

  // badge: optional label shown on the card ("Top pick", "Seasonal", "New", "Offer")
  // wasPrice: optional original price to show a discount
  products: [
    { id: "p01", name: "Heirloom Tomatoes", desc: "Mixed varieties", category: "produce", producer: "greenacre", price: 3.25, unit: "500g", emoji: "🍅", tint: "#fbe3dc", badge: "Top pick", seasonal: true },
    { id: "p02", name: "Green Cabbage", desc: "Crisp & sweet", category: "produce", producer: "greenacre", price: 1.2, unit: "each", emoji: "🥬", tint: "#e4f0d8" },
    { id: "p03", name: "Golden Potatoes", desc: "Great for roasting", category: "produce", producer: "greenacre", price: 1.85, unit: "2kg", emoji: "🥔", tint: "#f4ead6" },
    { id: "p04", name: "Ripe Mango", desc: "Ready to eat", category: "produce", producer: "spice", price: 1.5, unit: "each", emoji: "🥭", tint: "#fdebd3", badge: "Offer", wasPrice: 1.95 },
    { id: "p05", name: "Mixed Salad Greens", desc: "Organic blend", category: "produce", producer: "greenacre", price: 2.4, unit: "150g", emoji: "🥗", tint: "#e2f0dc", seasonal: true },
    { id: "p06", name: "Bramley Apples", desc: "Perfect for crumble", category: "produce", producer: "greenacre", price: 2.1, unit: "1kg", emoji: "🍎", tint: "#fbe1df", seasonal: true },
    { id: "p07", name: "Sweet Carrots", desc: "Unwashed, farm fresh", category: "produce", producer: "greenacre", price: 0.95, unit: "1kg", emoji: "🥕", tint: "#fde6d4" },
    { id: "p08", name: "Butternut Squash", desc: "Autumn favourite", category: "produce", producer: "greenacre", price: 1.6, unit: "each", emoji: "🎃", tint: "#fde8d0", seasonal: true, badge: "Seasonal" },
    { id: "p09", name: "Free-Range Eggs", desc: "Large, mixed colour", category: "dairy", producer: "meadow", price: 2.95, unit: "12 pack", emoji: "🥚", tint: "#f6efe2", badge: "Top pick" },
    { id: "p10", name: "Whole Milk", desc: "Non-homogenised", category: "dairy", producer: "meadow", price: 1.45, unit: "2 pints", emoji: "🥛", tint: "#eef2f7" },
    { id: "p11", name: "Mature Cheddar", desc: "Aged 12 months", category: "dairy", producer: "meadow", price: 4.5, unit: "250g", emoji: "🧀", tint: "#fbf0d4" },
    { id: "p12", name: "Salted Butter", desc: "Hand-churned", category: "dairy", producer: "meadow", price: 2.75, unit: "250g", emoji: "🧈", tint: "#fbf2d6" },
    { id: "p13", name: "Sourdough Loaf", desc: "Slow-fermented", category: "bakery", producer: "oakfield", price: 3.8, unit: "800g", emoji: "🍞", tint: "#f5e6d2", badge: "New" },
    { id: "p14", name: "Butter Croissants", desc: "Baked this morning", category: "bakery", producer: "oakfield", price: 3.2, unit: "4 pack", emoji: "🥐", tint: "#f7e7d0" },
    { id: "p15", name: "Seeded Bagels", desc: "Everything seasoning", category: "bakery", producer: "oakfield", price: 2.6, unit: "4 pack", emoji: "🥯", tint: "#f4e5d3" },
    { id: "p16", name: "Chicken Thighs", desc: "Free-range, bone-in", category: "meat", producer: "greenacre", price: 5.5, unit: "1kg", emoji: "🍗", tint: "#f7e3d8" },
    { id: "p17", name: "Beef Mince", desc: "15% fat, grass-fed", category: "meat", producer: "greenacre", price: 4.75, unit: "500g", emoji: "🥩", tint: "#f6dcd8" },
    { id: "p18", name: "Cornish Salmon Fillets", desc: "Skin-on", category: "meat", producer: "coast", price: 6.95, unit: "2 x 120g", emoji: "🐟", tint: "#fde3da", badge: "Offer", wasPrice: 7.95 },
    { id: "p19", name: "Wildflower Honey", desc: "Raw & local", category: "pantry", producer: "hearth", price: 6.5, unit: "340g", emoji: "🍯", tint: "#fcecc9", badge: "Top pick" },
    { id: "p20", name: "Basmati Rice", desc: "Extra long grain", category: "pantry", producer: "spice", price: 4.2, unit: "2kg", emoji: "🍚", tint: "#f2efe6" },
    { id: "p21", name: "Extra Virgin Olive Oil", desc: "Cold pressed", category: "pantry", producer: "spice", price: 7.5, unit: "500ml", emoji: "🫒", tint: "#e9efd8" },
    { id: "p22", name: "Rolled Oats", desc: "Wholegrain", category: "pantry", producer: "hearth", price: 1.9, unit: "1kg", emoji: "🌾", tint: "#f3ead8" },
    { id: "p23", name: "Pressed Apple Juice", desc: "Cloudy, single variety", category: "drinks", producer: "hearth", price: 3.4, unit: "750ml", emoji: "🧃", tint: "#eaf2dc" },
    { id: "p24", name: "Sparkling Water", desc: "Natural spring", category: "drinks", producer: "hearth", price: 0.9, unit: "1L", emoji: "💧", tint: "#e3f0f2" },
    { id: "p25", name: "Scotch Bonnet Peppers", desc: "Hot & fruity", category: "world", producer: "spice", price: 1.3, unit: "100g", emoji: "🌶️", tint: "#fbded6" },
    { id: "p26", name: "Plantain", desc: "Ripe, for frying", category: "world", producer: "spice", price: 0.85, unit: "each", emoji: "🍌", tint: "#fbf1cf" },
    { id: "p27", name: "Oat & Raisin Cookies", desc: "Freshly baked", category: "snacks", producer: "oakfield", price: 2.8, unit: "6 pack", emoji: "🍪", tint: "#f4e7da" },
    { id: "p28", name: "Sea Salt Crisps", desc: "Hand-cooked", category: "snacks", producer: "hearth", price: 1.5, unit: "150g", emoji: "🥔", tint: "#f6edd8" },
  ],

  bundles: [
    { id: "b01", name: "Family Veg Box", desc: "Fresh essentials for the week", price: 22, unit: "feeds 4", emoji: "🧺", tint: "#e4f0d8", items: ["p02", "p03", "p07", "p05", "p01"] },
    { id: "b02", name: "Breakfast Bundle", desc: "Eggs, milk, bread & honey", price: 15, unit: "serves 2–4", emoji: "🍳", tint: "#fbf0d4", items: ["p09", "p10", "p13", "p19"] },
    { id: "b03", name: "Sunday Roast Box", desc: "Everything for the roast", price: 28, unit: "feeds 4", emoji: "🍗", tint: "#f7e3d8", items: ["p16", "p03", "p07", "p08"] },
  ],

  testimonials: [
    { name: "Customer name", text: "Placeholder review — replace with a real customer quote. Fresh produce, friendly drivers and always on time.", rating: 5 },
    { name: "Customer name", text: "Placeholder review — replace with a real customer quote. The veg box has changed how we cook at home.", rating: 5 },
    { name: "Customer name", text: "Placeholder review — replace with a real customer quote. Great prices and lovely local producers.", rating: 5 },
  ],
};
