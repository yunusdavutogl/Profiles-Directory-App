import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 saniye boyunca cevap gelmezse bağlantıyı kes [cite: 478]
});

// Sunucudan gelen her cevabı kontrol eden "bekçi" (Interceptor) [cite: 481]
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Sunucu 404 (Bulunamadı) hatası verirse [cite: 488]
      if (error.response.status === 404) {
        throw new Error('İstediğiniz veri bulunamadı.'); [cite: 490]
      }
      // Sunucu 500 (Sistem hatası) verirse [cite: 491]
      if (error.response.status >= 500) {
        throw new Error('Sunucuda bir sorun oluştu. Lütfen daha sonra deneyin.'); [cite: 492]
      }
    }
    // Hiç internet yoksa veya sunucu kapalıysa [cite: 486]
    throw new Error('Ağ hatası! Lütfen bağlantınızı kontrol edin.'); [cite: 487]
  }
);