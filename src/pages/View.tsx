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

    const filteredData = {
        fullName: agricultor?.fullName,
        cpf: agricultor?.cpf,
        birthDate: agricultor && agricultor.birthDate !== null ? new Date(agricultor?.birthDate ?? '').toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'No birth date registered',
        phone: agricultor && agricultor.phone !== '' ? agricultor.phone : 'No phone registered',
        active: agricultor?.active ? 'Yes' : 'No'
    }


    return (
        <div>
            <Container className="h-[90vh] flex justify-center items-center flex-col gap-5 text-white">
                <Button onClick={() => backToAgricultors()}>Back</Button>
                <Text>Full name: {filteredData.fullName}</Text>
                <Text>CPF: {filteredData.cpf}</Text>
                <Text>Birth date: { filteredData.birthDate}</Text>
                <Text>Phone: {filteredData?.phone}</Text>
                <Text>Active: {filteredData?.active}</Text>
            </Container>
            
        </div>
    )
}