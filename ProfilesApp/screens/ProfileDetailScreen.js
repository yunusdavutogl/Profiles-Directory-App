import { useEffect, useState } from 'react'; // [cite: 292]
import { 
  View, Text, StyleSheet, ActivityIndicator, 
  ScrollView, Pressable 
} from 'react-native'; // [cite: 292-300]
import { api } from '../api/client'; // [cite: 301-302]

export default function ProfileDetailScreen({ route, navigation }) { // [cite: 303]
  // Listeden gönderilen ID'yi yakalıyoruz [cite: 304]
  const { id } = route.params; 
  
  const [profile, setProfile] = useState(null); // [cite: 305, 307]
  const [loading, setLoading] = useState(true); // [cite: 306, 308]
  const [error, setError] = useState(null); // [cite: 309]

  // Tek bir profilin detaylarını çeken fonksiyon [cite: 310]
  const fetchProfile = async () => { // [cite: 311]
    setLoading(true); // [cite: 312]
    setError(null); // [cite: 313]
    try {
      // Dinamik ID kullanarak istek atıyoruz: /profiles/1 gibi [cite: 316]
      const res = await api.get(`/profiles/${id}`); 
      setProfile(res.data); // [cite: 317]
    } catch (err) {
      setError('Profil detayları yüklenemedi.'); // [cite: 319]
      console.error(err); // [cite: 320]
    } finally {
      setLoading(false); // [cite: 322]
    }
  };

  // Sayfa açıldığında veya ID değiştiğinde veriyi çek [cite: 325-327]
  useEffect(() => {
    fetchProfile();
  }, [id]);

  // 1. Yükleme Durumu (Loading) [cite: 328]
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  // 2. Hata Durumu (Error) [cite: 336]
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchProfile}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }

  // 3. Profil Bulunamazsa [cite: 347]
  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Profil bulunamadı.</Text>
      </View>
    );
  }

  // 4. Ana Görünüm (Veri Başarıyla Geldiyse) [cite: 354]
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>E-POSTA</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>YAŞ</Text>
          <Text style={styles.value}>{profile.age}</Text>
        </View>

        {/* Eğer telefon varsa göster [cite: 369] */}
        {profile.phone && (
          <View style={styles.section}>
            <Text style={styles.label}>TELEFON</Text>
            <Text style={styles.value}>{profile.phone}</Text>
          </View>
        )}

        {/* Eğer biyografi varsa göster [cite: 375] */}
        {profile.bio && (
          <View style={styles.section}>
            <Text style={styles.label}>HAKKINDA</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Tasarım Kodları [cite: 384, 388]
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: 'white', margin: 16, borderRadius: 12, padding: 20, elevation: 4 },
  header: { borderBottomWidth: 1, borderBottomColor: '#e0e0e0', paddingBottom: 16, marginBottom: 16 },
  name: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  section: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#666', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 16, color: '#333' },
  bioText: { fontSize: 16, color: '#333', lineHeight: 24 },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#d32f2f', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: 'white', fontSize: 16, fontWeight: '600' }
});