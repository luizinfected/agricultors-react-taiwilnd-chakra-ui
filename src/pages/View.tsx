import { Button, Container } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import type { Farmer } from "../types/farmerTypes"
import { Text } from '@chakra-ui/react'

type ViewProps = {
    setRoutes: React.Dispatch<React.SetStateAction<'home' | 'farmers' | 'viewFarmer'>>
}

export const View = ({setRoutes}: ViewProps) => {
    const backToFarmers = () => {
        localStorage.removeItem('farmer')
        setRoutes('farmers')
    }

    const [farmer, setFarmer] = useState<Farmer | null>(null)

    useEffect(() => {
        const farmerLocalStorage = localStorage.getItem('agricultor')
        setFarmer(JSON.parse(farmerLocalStorage || ''))
    }, [])

    const filteredData = {
        fullName: farmer?.fullName,
        cpf: farmer?.cpf,
        birthDate: farmer && farmer.birthDate !== null ? new Date(farmer?.birthDate ?? '').toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'No birth date registered',
        phone: farmer && farmer.phone !== '' ? farmer.phone : 'No phone registered',
        active: farmer?.active ? 'Yes' : 'No'
    }


    return (
        <div>
            <Container className="h-[90vh] flex justify-center items-center flex-col gap-5 text-white">
                <Button onClick={() => backToFarmers()}>Back</Button>
                <Text>Full name: {filteredData.fullName}</Text>
                <Text>CPF: {filteredData.cpf}</Text>
                <Text>Birth date: { filteredData.birthDate}</Text>
                <Text>Phone: {filteredData?.phone}</Text>
                <Text>Active: {filteredData?.active}</Text>
            </Container>
            
        </div>
    )
}