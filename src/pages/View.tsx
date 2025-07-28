import { Button, Container } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import type { Agricultor } from "../types/agricultorTypes"
import { Text } from '@chakra-ui/react'

type ViewProps = {
    setRoutes: React.Dispatch<React.SetStateAction<'home' | 'agricultors' | 'viewAgricultor'>>
}

export const View = ({setRoutes}: ViewProps) => {
    const backToAgricultors = () => {
        localStorage.removeItem('agricultor')
        setRoutes('agricultors')
    }

    const [agricultor, setAgricultor] = useState<Agricultor | null>(null)

    useEffect(() => {
        const agricultorLocalStorage = localStorage.getItem('agricultor')
        setAgricultor(JSON.parse(agricultorLocalStorage || ''))
    }, [])


    return (
        <div>
            <Container className="h-[90vh] flex justify-center items-center flex-col gap-5 text-white">
                <Button onClick={() => backToAgricultors()}>Back</Button>
                <Text>Full name: {agricultor?.fullName}</Text>
                <Text>CPF: {agricultor?.cpf}</Text>
                <Text>Birth date: { new Date(agricultor?.birthDate ?? '').toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Text>
                <Text>Phone: {agricultor?.phone}</Text>
                <Text>Active: {agricultor?.active ? 'Yes' : 'No'}</Text>
            </Container>
            
        </div>
    )
}