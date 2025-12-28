import { View, Text, StyleSheet } from 'react-native';

export default function ProfileDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>Profil Detayları (Buraya gelecek)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});