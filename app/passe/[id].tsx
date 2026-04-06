import { useLocalSearchParams, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import QRCode from 'react-native-qrcode-svg'

type Passe = {
    id: string
    codigo: string
    tipo: string
    limite: number
    validadeDias: number
    dataCompra: string
}

export default function PasseDetalhe() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const [passe, setPasse] = useState<Passe | null>(null)

    useEffect(() => {
        carregar()
    }, [])

    async function carregar() {
        const dados = await AsyncStorage.getItem('passes')
        if (!dados) return

        const lista: Passe[] = JSON.parse(dados)

        const encontrado = lista.find(p => p.id === id)

        setPasse(encontrado || null)
    }

    function calcularExpiracao(passe: Passe) {
        const compra = new Date(passe.dataCompra)

        const expiracao = new Date(compra)
        expiracao.setDate(compra.getDate() + passe.validadeDias)

        return expiracao
    }

    function formatarData(data: Date) {
        return data.toLocaleDateString('pt-BR')
    }

    function isExpirado(passe: Passe) {
        const agora = new Date()
        return agora > calcularExpiracao(passe)
    }

    if (!passe) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        )
    }

    const expiracao = calcularExpiracao(passe)
    const expirado = isExpirado(passe)

    return (
        <>
        <Stack.Screen options={{ title: passe?.tipo ?? 'Passe' }} />
        <View style={styles.container}>
            <Text style={styles.titulo}>{passe.tipo}</Text>

            {expirado ? (
                <Text style={styles.expirado}>
                    Passe expirado em {formatarData(expiracao)}
                </Text>
            ) : (
                <>
                    <QRCode
                        value={passe.codigo || 'SEM-CODIGO'}
                        size={200}
                    />
                    <Text style={styles.codigo}>{passe.codigo}</Text>
                    <Text style={styles.info}>
                        Expira em: {formatarData(expiracao)}
                    </Text>
                </>
            )}
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },

    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },

    info: {
        marginBottom: 10,
        fontSize: 14
    },

    expirado: {
        marginTop: 20,
        color: 'red',
        fontWeight: 'bold'
    },

    codigo: {
        marginTop: 20,
        fontSize: 12,
        color: 'gray'
    }
})