import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import { useEffect, useState } from "react"

type CpfInputProps = {
    setCpfError: React.Dispatch<React.SetStateAction<string | null>>
    setCpfRaw: React.Dispatch<React.SetStateAction<string>>
    isRequired: boolean
    initialCpf?: string,
    isUpdating: boolean
}
export const CpfInput = ({ setCpfError, setCpfRaw, isRequired, initialCpf, isUpdating } : CpfInputProps) => {

    const [cpfMasked, setCpfMasked] = useState<string>('')

    const isValidCPF = (cpf: string) => {
        cpf = cpf.replace(/[^\d]+/g, '')
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

        let sum = 0
        for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i)
        let check1 = (sum * 10) % 11
        if (check1 === 10 || check1 === 11) check1 = 0
        if (check1 !== parseInt(cpf[9])) return false

        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i)
        let check2 = (sum * 10) % 11
        if (check2 === 10 || check2 === 11) check2 = 0
        if (check2 !== parseInt(cpf[10])) return false

        return true
    }

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 11)
        setCpfRaw(raw)
        
        const masked = raw
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")

        setCpfMasked(masked)

        if (raw.length < 11) {
            setCpfError("CPF must be 11 digits")
            return
        }

        if (!isValidCPF(raw)) {
            setCpfError("Invalid CPF")
            return
        }

        setCpfError(null)
    }

    useEffect(() => {
        if (initialCpf) {
            const raw = initialCpf.replace(/\D/g, "").slice(0, 11)

            const masked = raw
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")

            setCpfMasked(masked)
            setCpfRaw(raw)
        }
    }, [initialCpf, setCpfRaw])

    return (
        <FormControl isRequired={isRequired}>
            <FormLabel>CPF</FormLabel>
            <Input 
                placeholder='CPF' 
                onChange={handleCpfChange}
                maxLength={14}
                value={cpfMasked}
                isDisabled={isUpdating}
            />
        </FormControl>
    )
}