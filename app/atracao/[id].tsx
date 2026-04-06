import { useLocalSearchParams, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import images from '../../helper/images'

type Atracao = {
  id: string
  nome: string
  bairro: string
  thumbnail: string
  descricao: string
}

export default function Detalhe() {
  const { id } = useLocalSearchParams()
  const [atracao, setAtracao] = useState<Atracao | null>(null)
  const [isInteressado, setIsInteressado] = useState(false)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    const data = await import('../../data/atracoes.json')

    const found = data.default.find((a: Atracao) => a.id === id)

    setAtracao(found || null)

    verificarSeJaExiste(found)
  }

  async function verificarSeJaExiste(atracao: Atracao | undefined) {
    if (!atracao) return

    const dados = await AsyncStorage.getItem('interesses')

    if (!dados) return

    const lista: Atracao[] = JSON.parse(dados)

    const existe = lista.some(item => item.id === atracao.id)

    setIsInteressado(existe)
  }

  async function toggleInteresse() {
    if (!atracao) return

    const dados = await AsyncStorage.getItem('interesses')
    let lista: Atracao[] = dados ? JSON.parse(dados) : []

    if (isInteressado) {
      lista = lista.filter(item => item.id !== atracao.id)
    } else {
      lista.push(atracao)
    }

    await AsyncStorage.setItem('interesses', JSON.stringify(lista))

    setIsInteressado(!isInteressado)
  }

  if (!atracao) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen options={{ title: atracao?.nome ?? 'Detalhe' }} />
      <ScrollView style={styles.container}>
        <Image source={images[atracao.thumbnail as keyof typeof images]} style={styles.image} />

        <Text style={styles.nome}>{atracao.nome}</Text>
        <Text style={styles.bairro}>{atracao.bairro}</Text>
        <Text style={styles.desc}>{atracao.descricao}</Text>

        <TouchableOpacity style={isInteressado ? styles.botaoVermelho : styles.botaoVerde} onPress={toggleInteresse}>
          <Text style={styles.botaoTexto}>
            {isInteressado ? 'Remover dos Interesses' : 'Adicionar aos Interesses'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10
  },

  nome: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  bairro: {
    color: 'gray',
    marginBottom: 10
  },

  desc: {
    fontSize: 14,
    marginBottom: 20
  },

  botaoVerde: {
    backgroundColor: '#4FB6A6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },

  botaoVermelho: {
    backgroundColor: '#d35858ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },

  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold'
  }
})