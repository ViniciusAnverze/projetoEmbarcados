import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4FB6A6', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1590086782957-93c06ef21604',
          }}
          style={styles.headerImage}
        />
      }>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">FloriPasse 🌴</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Interesses
        </ThemedText>

        <ThemedText>
          Com o FloriPasse você pode visitar diversas atrações turísticas
          da ilha com praticidade e economia. Escolha seu passe e comece
          a explorar!
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.menuContainer}>
        <Link href="/(tabs)/atracoes" style={styles.link}>
          <ThemedText type="defaultSemiBold">Ver Atrações</ThemedText>
        </Link>

        <Link href="/(tabs)/passes" style={styles.link}>
          <ThemedText type="defaultSemiBold">Comprar Passe</ThemedText>
        </Link>

        <Link href="/(tabs)/interesses" style={styles.link}>
          <ThemedText type="defaultSemiBold">Meus Interesses</ThemedText>
        </Link>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedText>
          Aproveite praias, trilhas, cultura e muito mais na Ilha da Magia!
        </ThemedText>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 10,
    marginBottom: 10,
  },

  stepContainer: {
    gap: 8,
    marginBottom: 20,
  },

  menuContainer: {
    gap: 12,
    marginBottom: 20,
  },

  link: {
    padding: 12,
    backgroundColor: '#4FB6A6',
    borderRadius: 10,
  },

  footer: {
    marginTop: 10,
    marginBottom: 30,
  },

  headerImage: {
    height: 200,
    width: '100%',
    position: 'absolute',
  },
});