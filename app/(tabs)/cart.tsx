import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, Modal, Linking } from 'react-native';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface CartItemWithProduct extends CartItem {
  product: Product;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  async function fetchCartItems() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "You must be logged in to view your cart.");
      setLoading(false);
      return;
    }

    const { data: cartData, error: cartError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);
    
    if (cartError) {
      console.error('Error fetching cart items:', cartError);
      Alert.alert("Error", "Failed to fetch cart items. Please try again.");
      setLoading(false);
      return;
    }

    const cartItemsWithProducts = await Promise.all(cartData.map(async (item) => {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        return null;
      }

      return { ...item, product: productData };
    }));

    setCartItems(cartItemsWithProducts.filter((item): item is CartItemWithProduct => item !== null));
    setLoading(false);
  }

  const renderItem = ({ item }: { item: CartItemWithProduct }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.product.image_url }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productPrice}>${item.product.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
            <Ionicons name="remove-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  async function updateQuantity(itemId: number, newQuantity: number) {
    if (newQuantity < 1) return;
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);
    
    if (error) {
      console.error('Error updating quantity:', error);
      Alert.alert("Error", "Failed to update quantity. Please try again.");
    } else {
      fetchCartItems();
    }
  }

  async function removeItem(itemId: number) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    
    if (error) {
      console.error('Error removing item:', error);
      Alert.alert("Error", "Failed to remove item. Please try again.");
    } else {
      fetchCartItems();
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/+201020952678'); // Replace with the coach's WhatsApp number
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={100} color="#ccc" />
          <Text style={styles.emptyText}>السلة فارغة</Text>
          <Text style={styles.emptySubText}>ابدأ التسوق الآن</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contact Coach</Text>
            <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
              <Text style={styles.whatsappButtonText}>Contact via WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
    marginTop: 60, // Increased margin from top
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  productPrice: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
    color: 'white',
  },
  removeButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  emptySubText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  totalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  checkoutButton: {
    backgroundColor: 'yellow',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  whatsappButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});