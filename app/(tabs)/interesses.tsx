import { useState, useCallback } from 'react'
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, useFocusEffect } from 'expo-router'
import images from '../../helper/images'

type Atracao = {
  id: string
  nome: string
  bairro: string
  thumbnail: string
}

export default function InteressesScreen() {
  const [interesses, setInteresses] = useState<Atracao[]>([])

  useFocusEffect(
    useCallback(() => {
      carregar()
    }, [])
  )

  async function carregar() {
    const dados = await AsyncStorage.getItem('interesses')

    if (!dados) return setInteresses([])

    const lista: Atracao[] = JSON.parse(dados)

    const ordenada = [...lista].sort((a, b) =>
      a.nome.localeCompare(b.nome)
    )

    setInteresses(ordenada)
  }

  async function remover(id: string) {
    const nova = interesses.filter(i => i.id !== id)

    setInteresses(nova)
    await AsyncStorage.setItem('interesses', JSON.stringify(nova))
  }

  return (
    <View style={styles.container}>
      {interesses.length === 0 ? (
        <Text style={styles.vazio}>
          Nenhuma atração adicionada.
        </Text>
      ) : (
        <FlatList
          data={interesses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Link href={{pathname: '/atracao/[id]', params: { id: item.id }}} asChild>
                <TouchableOpacity style={styles.row}>
                  <Image source={images[item.thumbnail as keyof typeof images]} style={styles.image} />

                  <View style={styles.info}>
                    <Text style={styles.nome}>{item.nome}</Text>
                    <Text style={styles.bairro}>{item.bairro}</Text>
                  </View>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => remover(item.id)}
              >
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },

  vazio: { textAlign: 'center', marginTop: 20 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2
  },

  row: { flexDirection: 'row' },

  image: { width: 100, height: 100 },

  info: { padding: 10, justifyContent: 'center' },

  nome: { fontSize: 16, fontWeight: 'bold' },

  bairro: { fontSize: 14, color: 'gray' },

  removeButton: {
    backgroundColor: '#ff5c5c',
    padding: 10,
    alignItems: 'center'
  },

  removeText: { color: '#fff', fontWeight: 'bold' }
})