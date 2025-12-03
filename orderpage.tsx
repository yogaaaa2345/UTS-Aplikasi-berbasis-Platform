import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';

type Props = {
  navigation: any;
  route?: any;
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export default function OrderPage({ navigation }: Props) {
  // ✅ Data sementara
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: '1', name: 'Cappuccino', price: 25000, qty: 2 },
    { id: '2', name: 'Latte', price: 23000, qty: 1 },
  ]);

  // ✅ Hitung total harga
  const totalPrice = orders.reduce((sum, item) => sum + item.price * item.qty, 0);

  // ✅ Fungsi hapus item
  const removeItem = (id: string) => {
    setOrders(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Render tiap item
  const renderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.qty}>Qty: {item.qty}</Text>
        <Text style={styles.price}>Rp {item.price * item.qty}</Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Your Orders</Text>

      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders yet!</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        />
      )}

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.total}>Total: Rp {totalPrice}</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => alert('Checkout Success!')}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    backgroundColor: '#442908ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    zIndex: 10,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qty: {
    marginTop: 5,
    color: '#555',
  },
  price: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#442908ff',
  },
  removeButton: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#442908ff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginTop: 50,
  },
});