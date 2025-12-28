import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../api/client'; // Az önce oluşturduğumuz elçi [cite: 150]

export default function ProfilesListScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]); // Kişiler listesi [cite: 152]
  const [page, setPage] = useState(1); // Kaçıncı sayfadayız? [cite: 153]
  const [loading, setLoading] = useState(false); // Veri yükleniyor mu? [cite: 154]
  const [error, setError] = useState(null); // Hata var mı? [cite: 155]
  const [hasMore, setHasMore] = useState(true); // Daha veri var mı? [cite: 156, 158]

  // Veri çekme fonksiyonu [cite: 157, 159]
  const fetchProfiles = async () => {
    if (loading || !hasMore) return; // Zaten yükleniyorsa veya bittiyse dur [cite: 160]
    
    setLoading(true);
    setError(null);

    try {
      // Sunucudan veriyi iste [cite: 164]
      const res = await api.get(`/profiles?page=${page}&limit=10`);
      
      if (res.data.length === 0) {
        setHasMore(false); // Gelen veri boşsa bitmiştir [cite: 165, 166]
      } else {
        setProfiles(prev => [...prev, ...res.data]); // Yeni verileri eski listenin sonuna ekle [cite: 169]
        setPage(prev => prev + 1); // Bir sonraki sayfa numarasını hazırla [cite: 170]
      }
    } catch (err) {
      setError('Bağlantı hatası! Lütfen interneti ve serverı kontrol et.'); // [cite: 171, 172]
      console.error(err);
    } finally {
      setLoading(false); // İşlem bitti (başarılı veya başarısız) [cite: 174]
    }
  };

  useEffect(() => {
    fetchProfiles(); // Sayfa ilk açıldığında veriyi çek [cite: 178, 179]
  }, []);

  // Listedeki her bir kutucuğun (kartın) görünümü [cite: 181]
  const renderItem = ({ item }) => (
    <Pressable 
      style={styles.card} 
      [cite_start]onPress={() => navigation.navigate('ProfileDetail', { id: item.id })} // Tıklayınca detaya git [cite: 183-187]
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </Pressable>
  );

  // Liste sonuna gelince dönen yükleme simgesi [cite: 191]
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  };

  // Eğer hata varsa ve hiç veri yoksa hata mesajı göster [cite: 199]
  if (error && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchProfiles}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={fetchProfiles} // Sona gelince yeni sayfa çek [cite: 216]
        onEndReachedThreshold={0.5} // Listenin yarısına gelince çekmeye başla [cite: 217]
        ListFooterComponent={renderFooter} // En alta yükleniyor simgesi koy [cite: 218]
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// Tasarım (CSS gibi düşünebilirsin) [cite: 224, 226]
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 16 },
  card: { 
    backgroundColor: 'white', padding: 16, marginBottom: 12, borderRadius: 8,
    shadowColor: '#000', elevation: 3, shadowOpacity: 0.1, shadowRadius: 4 
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  email: { fontSize: 14, color: '#666' },
  footer: { paddingVertical: 20, alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#d32f2f', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: 'white', fontSize: 16, fontWeight: '600' }
});