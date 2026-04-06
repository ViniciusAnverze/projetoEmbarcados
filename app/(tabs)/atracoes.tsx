import { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import images from '../../helper/images'

type Atracao = {
  id: string
  nome: string
  bairro: string
  thumbnail: string
}

export default function AtracoesScreen() {
  const [atracoes, setAtracoes] = useState<Atracao[]>([])

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    const data = await import('../../data/atracoes.json')

    const ordenadas = [...data.default].sort((a, b) =>
      a.nome.localeCompare(b.nome)
    )

    setAtracoes(ordenadas)
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={atracoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/atracao/[id]', params: { id: item.id } }} asChild>
            <TouchableOpacity style={styles.card}>
              <Image
                source={images[item.thumbnail as keyof typeof images]}
                style={styles.image}
                resizeMode="cover"
              />

              <View style={styles.info}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.bairro}>{item.bairro}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2
  },

  image: { width: 100, height: 100 },

  info: { padding: 10, justifyContent: 'center' },

  nome: { fontSize: 16, fontWeight: 'bold' },

  bairro: { fontSize: 14, color: 'gray' }
})