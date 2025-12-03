import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

type MenuItem = {
  name: string;
  price: string;
  image: any;
  description: string;
};

type Props = {
  navigation: any;
};

export default function MenuPage({ navigation }: Props) {
  const [search, setSearch] = useState("");

  const coffeeList: MenuItem[] = [
    { 
      name: "Cappuccino", 
      price: "25.000", 
      image: require("./asset/cappucino.jpeg"),
      description: "Rich espresso with steamed milk foam, perfectly balanced and creamy."
    },
    { 
      name: "Latte", 
      price: "23.000", 
      image: require("./asset/latte.jpeg"),
      description: "Smooth espresso with steamed milk, creating a velvety coffee experience."
    },
    { 
      name: "Americano", 
      price: "20.000", 
      image: require("./asset/americano.jpeg"),
      description: "Bold espresso diluted with hot water for a strong, pure coffee taste."
    },
    { 
      name: "Mocha", 
      price: "26.000", 
      image: require("./asset/mocha.jpeg"),
      description: "Espresso combined with chocolate and steamed milk, topped with whipped cream."
    },
  ];

  const promoList = [
    require("./asset/americano.jpeg"),
    require("./asset/cappucino.jpeg"),
    require("./asset/mocha.jpeg"),
  ];

  const filteredCoffee = coffeeList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search coffee..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
      />

      {/* PROMO BANNER */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.promoContainer}
      >
        {promoList.map((img, index) => (
          <Image key={index} source={img} style={styles.promoImage} />
        ))}
      </ScrollView>

      <Text style={styles.header}>Coffee Menu</Text>

      {/* MENU LIST */}
      <ScrollView contentContainerStyle={styles.menuList}>
        {filteredCoffee.length > 0 ? (
          filteredCoffee.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={item.image} style={styles.image} />

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>Rp {item.price}</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("DetailPage", { data: item })}
              >
                <Text style={styles.buttonText}>Order</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No coffee found</Text>
            <Text style={styles.emptySubtext}>Try searching for another coffee</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    paddingTop: 40, 
    paddingHorizontal: 20 
  },
  searchBox: { 
    backgroundColor: "#f2f2f2", 
    padding: 12, 
    borderRadius: 15, 
    marginBottom: 20,
    fontSize: 16,
  },
  promoContainer: {
    marginBottom: 20,
  },
  promoImage: { 
    width: 260, 
    height: 140, 
    borderRadius: 15, 
    marginRight: 15 
  },
  header: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 15,
    color: "#333",
  },
  menuList: { 
    paddingBottom: 100 
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { 
    width: 70, 
    height: 70, 
    borderRadius: 10 
  },
  info: { 
    flex: 1, 
    marginLeft: 15 
  },
  name: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: "#333",
  },
  price: { 
    marginTop: 4, 
    color: "#444",
    fontSize: 15,
    fontWeight: "600",
  },
  button: { 
    backgroundColor: "#442908ff", 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 10 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
});