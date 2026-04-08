import { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import images from '../../helper/images'

type Atracao = {
  id: string
  nome: string
  bairro: string
  thumbnail: string
}

export default function ReservasScreen() {
  const [reservas, setReservas] = useState<Atracao[]>([])

  useFocusEffect(
    useCallback(() => {
      carregar()
    }, [])
  )

  async function carregar() {
    const dados = await AsyncStorage.getItem('reservas')

    if (!dados) {
      setReservas([])
      return
    }

    const lista: Atracao[] = JSON.parse(dados)

    const ordenadas = [...lista].sort((a, b) =>
      a.nome.localeCompare(b.nome)
    )

    setReservas(ordenadas)
  }

  async function removerReserva(id: string) {
    const dados = await AsyncStorage.getItem('reservas')
    let lista: Atracao[] = dados ? JSON.parse(dados) : []

    lista = lista.filter(item => item.id !== id)

    await AsyncStorage.setItem('reservas', JSON.stringify(lista))
    setReservas(lista)
  }

  return (
    <View style={styles.container}>
      {reservas.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma reserva feita ainda.</Text>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              
              <Link href={{ pathname: '/atracao/[id]', params: { id: item.id } }} asChild>
                <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }}>
                  <Image
                    source={images[item.thumbnail as keyof typeof images]}
                    style={styles.image}
                  />

                  <View style={styles.info}>
                    <Text style={styles.nome}>{item.nome}</Text>
                    <Text style={styles.bairro}>{item.bairro}</Text>
                  </View>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity onPress={() => removerReserva(item.id)}>
                <Text style={{ color: 'red', padding: 10 }}>Remover</Text>
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

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center'
  },

  vazio: { textAlign: 'center', marginTop: 20 },

  image: { width: 100, height: 100 },

  info: { padding: 10, justifyContent: 'center', flex: 1 },

  nome: { fontSize: 16, fontWeight: 'bold' },

  bairro: { fontSize: 14, color: 'gray' }
})