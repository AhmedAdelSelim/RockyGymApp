import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  I18nManager,
  SafeAreaView,
  Modal,
  ScrollView,
  Linking,
  Animated,
} from 'react-native';
import { supabase } from '../utils/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Force RTL layout for Arabic
I18nManager.forceRTL(true);

type Supplement = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  usage: string;
  ingredients: string;
};

const { width, height } = Dimensions.get('window');
const cardWidth = width * 0.44;

export default function SupplementsScreen() {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(height));

  useEffect(() => {
    fetchSupplements();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      Animated.spring(modalAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(modalAnimation, {
        toValue: height,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  async function fetchSupplements() {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setSupplements(data || []);
    } catch (error) {
      console.error('Error fetching supplements:', error);
    } finally {
      setLoading(false);
    }
  }

  const openWhatsApp = () => {
    // Replace this with your nutritionist's WhatsApp number
    const phoneNumber = '+201020952678';
    const message = `مرحبًا، أنا مهتم بالمكمل الغذائي: ${selectedSupplement?.name}`;
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`);
  };

  const renderSupplement = ({ item }: { item: Supplement }) => (
    <TouchableOpacity 
      style={styles.cardWrapper} 
      onPress={() => {
        setSelectedSupplement(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price.toFixed(2)} جنيه</Text>
        </LinearGradient>
       
      </View>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: modalAnimation }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {selectedSupplement && (
              <>
                <Image source={{ uri: selectedSupplement.image }} style={styles.modalImage} resizeMode="cover" />
                <Text style={styles.modalName}>{selectedSupplement.name}</Text>
                <Text style={styles.modalPrice}>{selectedSupplement.price.toFixed(2)} جنيه</Text>
                <Text style={styles.modalDescription}>{selectedSupplement.description}</Text>
                <Text style={styles.modalUsage}>طريقة الاستخدام: {selectedSupplement.usage}</Text>
                <Text style={styles.modalIngredients}>المكونات: {selectedSupplement.ingredients}</Text>
                <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
                  <Text style={styles.whatsappButtonText}>تواصل مع أخصائي التغذية عبر واتساب</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (supplements.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.comingSoonContainer}>
          <LinearGradient
            colors={['#FFD700', '#FFA500', '#FF0000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.comingSoonGradient}
          >
            <View style={styles.comingSoonContent}>
              <Ionicons name="time-outline" size={80} color="#FFD700" />
              <Text style={styles.comingSoonText}>قريباً</Text>
              <Text style={styles.comingSoonSubtext}>
                نعمل بجد لنقدم لكم مكملات غذائية رائعة!
              </Text>
              <TouchableOpacity style={styles.notifyButton}>
                <Text style={styles.notifyButtonText}>أبلغني عند التوفر</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={supplements}
        renderItem={renderSupplement}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.container}
      />
      {renderModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    width: cardWidth,
    margin: 8,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: cardWidth * 1.2,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  addButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  comingSoonContainer: {
    flex: 1,
  },
  comingSoonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonContent: {
    alignItems: 'center',
    padding: 20,
  },
  comingSoonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  comingSoonSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  notifyButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  notifyButtonText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 20,
  },
  modalUsage: {
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalIngredients: {
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 20,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});