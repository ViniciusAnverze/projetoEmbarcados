import { useLocalSearchParams, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { WebView } from 'react-native-webview'
import { Linking, Platform } from 'react-native'
import images from '../../helper/images'

type Atracao = {
  id: string
  nome: string
  bairro: string
  thumbnail: string
  imagemSecundaria: string
  descricao: string
  diferencial: string
  videoUrl: string
  horario: string
  endereco: string
  contato: {
    telefone: string
    email: string
    whatsapp: string
  }
  coordenadas: {
    lat: number
    lng: number
  }
  possuiReserva: boolean
}

export default function Detalhe() {
  const { id } = useLocalSearchParams()
  const [atracao, setAtracao] = useState<Atracao | null>(null)
  const [isInteressado, setIsInteressado] = useState(false)
  const [isReservado, setIsReservado] = useState(false)

  useEffect(() => {
    carregar()
  }, [])

  async function verificarReserva(atracao: Atracao | undefined) {
    if (!atracao) return

    const dados = await AsyncStorage.getItem('reservas')

    if (!dados) return

    const lista: Atracao[] = JSON.parse(dados)

    const existe = lista.some(item => item.id === atracao.id)

    setIsReservado(existe)
  }
  
  async function verificarSeJaExiste(atracao: Atracao | undefined) {
    if (!atracao) return

    const dados = await AsyncStorage.getItem('interesses')

    if (!dados) return

    const lista: Atracao[] = JSON.parse(dados)

    const existe = lista.some(item => item.id === atracao.id)

    setIsInteressado(existe)
  }

  async function carregar() {
    const data = await import('../../data/atracoes.json')

    const found = data.default.find((a: Atracao) => a.id === id)

    setAtracao(found || null)

    verificarReserva(found)
    verificarSeJaExiste(found)
  }

  async function toggleReserva() {
    if (!atracao) return

    const dados = await AsyncStorage.getItem('reservas')
    let lista: Atracao[] = dados ? JSON.parse(dados) : []

    if (isReservado) {
      lista = lista.filter(item => item.id !== atracao.id)
    } else {
      lista.push(atracao)
    }

    await AsyncStorage.setItem('reservas', JSON.stringify(lista))

    setIsReservado(!isReservado)
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

        <Text style={styles.titulo}>Descrição</Text>
        <Text style={styles.desc}>{atracao.descricao}</Text>

        <Image source={images[atracao.imagemSecundaria as keyof typeof images]} style={styles.image} />

        <Text style={styles.titulo}>Diferencial</Text>
        <Text style={styles.desc}>{atracao.diferencial}</Text>

        <Text style={styles.titulo}>Horário</Text>
        <Text style={styles.desc}>{atracao.horario}</Text>

        <Text style={styles.titulo}>Endereço</Text>
        <Text style={styles.desc}>{atracao.endereco}</Text>

        <TouchableOpacity onPress={() =>
          Linking.openURL(`https://www.google.com/maps?q=${atracao.coordenadas.lat},${atracao.coordenadas.lng}`)
        }>
          <Text style={{ color: 'blue', marginBottom: 20 }}>Abrir no Maps</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Contato</Text>

        <TouchableOpacity onPress={() =>
          Linking.openURL(`tel:${atracao.contato.telefone}`)
        }>
          <Text style={{ color: 'blue' }}>Telefone</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() =>
          Linking.openURL(`mailto:${atracao.contato.email}`)
        }>
          <Text style={{ color: 'blue' }}>Email</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() =>
          Linking.openURL(`https://wa.me/${atracao.contato.whatsapp}`)
        }>
          <Text style={{ color: 'blue', marginBottom: 20 }}>WhatsApp</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Vídeo</Text>
        {Platform.OS === 'web' ? (
          <TouchableOpacity onPress={() => Linking.openURL(atracao.videoUrl)}>
            <Text style={{ color: 'blue', marginBottom: 20 }}>
              Assistir vídeo no YouTube
            </Text>
          </TouchableOpacity>
        ) : (
          <WebView
            style={{ height: 200, marginBottom: 20 }}
            javaScriptEnabled
            source={{ uri: atracao.videoUrl }}
          />
        )}

        {atracao.possuiReserva && (
          <TouchableOpacity
            style={isReservado ? styles.botaoVermelho : styles.botaoReserva}
            onPress={toggleReserva}
          >
            <Text style={styles.botaoTexto}>
              {isReservado ? 'Cancelar Reserva' : 'Fazer Reserva'}
            </Text>
          </TouchableOpacity>
        )}

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
    fontSize: 25,
    fontWeight: 'bold'
  },

  titulo: {
    fontSize: 18,
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
    marginVertical: 10,
    alignItems: 'center'
  },

  botaoReserva: {
    backgroundColor: '#5039ffff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center'
  },

  botaoVermelho: {
    backgroundColor: '#d35858ff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },

  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold'
  }
})