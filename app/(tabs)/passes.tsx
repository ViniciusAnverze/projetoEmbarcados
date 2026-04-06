import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import uuid from 'react-native-uuid'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link } from 'expo-router'

type Passe = {
  id: string
  codigo: string
  tipo: string
  limite: number
  validadeDias: number
  dataCompra: string
}

const OPCOES = [
  { tipo: 'Básico', limite: 3, validadeDias: 3, preco: 89 },
  { tipo: 'Plus', limite: 5, validadeDias: 5, preco: 149 },
  { tipo: 'Top', limite: 7, validadeDias: 7, preco: 199 }
]

export default function PassesScreen() {
  const [passes, setPasses] = useState<Passe[]>([])

  useEffect(() => {
    carregarPasses()
  }, [])

  async function carregarPasses() {
    const dados = await AsyncStorage.getItem('passes')
    if (dados) {
      setPasses(JSON.parse(dados))
    }
  }

  async function salvarPasses(novosPasses: Passe[]) {
    setPasses(novosPasses)
    await AsyncStorage.setItem('passes', JSON.stringify(novosPasses))
  }

  function comprarPasse(opcao: any) {
    const novoPasse: Passe = {
      id: Date.now().toString(),
      codigo: uuid.v4().toString(),
      tipo: opcao.tipo,
      limite: opcao.limite,
      validadeDias: opcao.validadeDias,
      dataCompra: new Date().toISOString()
    }

    salvarPasses([...passes, novoPasse])
  }

  function calcularExpiracao(passe: Passe) {
    const compra = new Date(passe.dataCompra)

    const expiracao = new Date(compra)
    expiracao.setDate(compra.getDate() + passe.validadeDias)

    return expiracao
  }

  function calcularStatus(passe: Passe) {
    const agora = new Date()
    const expiracao = calcularExpiracao(passe)

    return agora <= expiracao ? 'Ativo' : 'Expirado'
  }

  function formatarData(data: Date) {
    return data.toLocaleDateString('pt-BR')
  }

  function renderPasse({ item }: { item: Passe }) {
    const expiracao = calcularExpiracao(item)

    return (
      <Link
        href={{
          pathname: '/passe/[id]',
          params: { id: item.id }
        }}
        asChild
      >
        <TouchableOpacity style={styles.passeCard}>
          <Text style={styles.titulo}>{item.tipo}</Text>
          <Text>{item.limite} atrações</Text>
          <Text>{item.validadeDias} dias</Text>
          <Text>Status: {calcularStatus(item)}</Text>
          <Text>Expira em: {formatarData(expiracao)}</Text>
        </TouchableOpacity>
      </Link>
    )
  }

  return (
    <View style={styles.container}>
      
      <Text style={styles.sectionTitle}>Comprar Passe</Text>

      {OPCOES.map((opcao) => (
        <TouchableOpacity
          key={opcao.tipo}
          style={styles.botao}
          onPress={() => comprarPasse(opcao)}
        >
          <Text style={styles.botaoTexto}>
            {opcao.tipo} - {opcao.limite} atrações - {opcao.validadeDias} dias - R${opcao.preco}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Meus Passes</Text>

      <FlatList
        data={passes}
        keyExtractor={(item) => item.id}
        renderItem={renderPasse}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
  },

  botao: {
    backgroundColor: '#4FB6A6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold'
  },

  passeCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2
  },

  titulo: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})