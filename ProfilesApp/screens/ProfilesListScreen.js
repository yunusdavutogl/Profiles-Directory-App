import { useEffect, useState } from 'react'; [cite: 142]
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl, [cite: 142-149, 515]
} from 'react-native';
import { api } from '../api/client'; [cite: 150]

export default function ProfilesListScreen({ navigation }) {
  // --- DURUM YÖNETİMİ (STATES) ---
  const [profiles, setProfiles] = useState([]); // Çekilen profil listesi [cite: 152]
  const [page, setPage] = useState(1); // Mevcut sayfa numarası [cite: 153]
  const [loading, setLoading] = useState(false); // Veri yüklenme durumu [cite: 154]
  const [error, setError] = useState(null); // Hata mesajı [cite: 155]
  const [hasMore, setHasMore] = useState(true); // Daha fazla veri var mı? [cite: 156-158]
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh durumu [cite: 517]

  // --- VERİ ÇEKME FONKSİYONU ---
  const fetchProfiles = async (isRefresh = false) => {
    // Eğer yükleniyorsa veya çekilecek veri kalmadıysa (yenileme değilse) dur [cite: 160]
    if (loading || (!hasMore && !isRefresh)) return;

    setLoading(true); [cite: 161]
    setError(null); [cite: 162]

    try {
      const currentPage = isRefresh ? 1 : page; // Yenileme ise 1. sayfayı iste [cite: 523]
      // API İsteği: /profiles?page=1&limit=10 gibi [cite: 164]
      const res = await api.get(`/profiles?page=${currentPage}&limit=10`);

      if (res.data.length === 0) {
        setHasMore(false); // Veri bittiyse daha fazla çekme [cite: 165-166]
      } else {
        // Yenileme ise listeyi sıfırla, değilse üstüne ekle [cite: 169, 522]
        setProfiles(prev => (isRefresh ? res.data : [...prev, ...res.data]));
        setPage(currentPage + 1); [cite: 170]
      }
    } catch (err) {
      setError(err.message || 'Bağlantı hatası oluştu.'); [cite: 172]
    } finally {
      setLoading(false); [cite: 174]
      setRefreshing(false); [cite: 526]
    }
  };

  // Sayfa ilk açıldığında verileri getir [cite: 178-180]
  useEffect(() => {
    fetchProfiles();
  }, []);

  // --- YENİLEME FONKSİYONU (PULL-TO-REFRESH) ---
  const onRefresh = async () => {
    setRefreshing(true); [cite: 521]
    setHasMore(true); [cite: 524]
    await fetchProfiles(true); // true parametresi ile listeyi sıfırla [cite: 525]
  };

  // --- YARDIMCI GÖRÜNÜMLER (RENDERERS) ---

  // Liste boşsa gösterilecek mesaj [cite: 499-506]
  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No profiles found</Text>
      </View>
    );
  };

  // Listenin en altında dönen yükleme simgesi [cite: 191-198]
  const renderFooter = () => {
    if (!loading || refreshing) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  // Liste elemanı (Her bir profil kartı) [cite: 181-190]
  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      [cite_start]onPress={() => navigation.navigate('ProfileDetail', { id: item.id })} // Detaya ID gönder 
    >
      <Text style={styles.name}>{item.name}</Text> [cite: 188]
      <Text style={styles.email}>{item.email}</Text> [cite: 189]
    </Pressable>
  );

  // --- ANA EKRAN DURUMLARI ---

  // 1. İlk yükleme anı (Liste boş ve yükleniyor) [cite: 537-544]
  if (loading && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profiles...</Text>
      </View>
    );
  }

  // 2. Hata durumu (Veri yoksa ve hata varsa) [cite: 199-208]
  if (error && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => fetchProfiles(true)}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // 3. Ana Liste Görünümü [cite: 209-222]
  return (
    <View style={styles.container}>
      <FlatList
        [cite_start]data={profiles} [cite: 213]
        [cite_start]keyExtractor={(item) => item.id.toString()} [cite: 214]
        renderItem={renderItem} [cite: 215]
        onEndReached={() => fetchProfiles()} // Sona gelince yeni sayfa çek [cite: 216]
        onEndReachedThreshold={0.5} // Listenin yarısına gelince tetikle [cite: 217]
        ListFooterComponent={renderFooter} [cite: 218]
        ListEmptyComponent={renderEmpty} [cite: 512]
        contentContainerStyle={styles.listContent} [cite: 219]
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> [cite: 530-532]
        }
      />
    </View>
  );
}

// --- TASARIM (STYLES) --- [cite: 224-282, 384-463]
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});