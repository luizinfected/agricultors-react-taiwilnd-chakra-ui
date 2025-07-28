import { useEffect, useState } from "react"
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, FormControl, FormLabel, Select } from "@chakra-ui/react"
import { CpfInput } from "./CpfInput"
import { createAgricultor, updateAgricultor } from "../common/request"
import type { Agricultor } from "../types/agricultorTypes"
import { toast } from "react-toastify"

type DrawerAgricultorProps = {
  isOpen: boolean,
  onClose: () => void,
  text: string,
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>
  isUpdating: boolean,
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
  agricultor: Agricultor | null
}
export function DrawerAgricultor({ text, isOpen, onClose, setTrigger, agricultor, isUpdating, setIsUpdating }: DrawerAgricultorProps) {

  const [cpfError, setCpfError] = useState<string | null>(null)
  const [fullNameError, setFullNameError] = useState<string | null>(null)
  const [cpfRaw, setCpfRaw] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [birthDate, setBirthDate] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [active, setActive] = useState<'active' | 'inactive'>('active')

  useEffect(() => {
    if (agricultor) {
      setFullName(agricultor.fullName)
      setCpfRaw(agricultor.cpf)
      if(agricultor.birthDate){
        const date = new Date(agricultor.birthDate)
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate() + 1).padStart(2, '0')
        setBirthDate(`${yyyy}-${mm}-${dd}`)
      }
      setPhone(agricultor.phone)
      setActive(agricultor.active ? 'active' : 'inactive')
    }
  }, [agricultor])

  const handleSubmit = async () => {

    if (fullName.length === 0) {
      setFullNameError('Full name is required')
      return
    }

    if (cpfRaw.length !== 11) {
      setCpfError('CPF is required')
      return
    }

    const parsedBirthDate = birthDate ? new Date(birthDate) : null;


    const payload = {
      fullName,
      cpf: cpfRaw,
      birthDate: parsedBirthDate ? parsedBirthDate.toISOString() : null,
      phone,
      active: active === 'active'
    };

    const updatePayload = {
      fullName,
      birthDate: parsedBirthDate ? parsedBirthDate.toISOString() : null,
      phone,
      active: active === 'active' ? true : false
    }

    if (isUpdating) {
      const response = await updateAgricultor(agricultor!._id, updatePayload)      
      if(response.error){
        return
      }
      toast.success('Agricultor updated successfully')
    } else {
      const response = await createAgricultor(payload)
      if(response.error){
        return
      }
      toast.success('Agricultor created successfully')
    }
    
    resetStatus()
  }

  const resetStatus = () => {
    setIsUpdating(false)
    setTrigger(true)
    onClose()
    setCpfRaw('')
    setFullName('')
    setBirthDate('')
    setPhone('')
    setActive('active')
  }

  const handleClose = () => {
    onClose()
    setCpfRaw('')
    setFullName('')
    setBirthDate('')
    setPhone('')
    setActive('active')
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: string) => {
    const value = e.target.value

    if (key === 'fullName') {
      setFullName(value)
      if (fullName.length > 0) {
        setFullNameError(null)
      }
    }

    if (key === 'active') {
      if (value === 'active' || value === 'inactive') {
        setActive(value)
      }
    }

    if (key === 'phone') {
      const cleanedValue = value.replace(/\D/g, "")
      setPhone(cleanedValue)
    }

    if (key === 'birthDate') {
      setBirthDate(value)
    }
  }



  return (
    <div className="my-5">
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={handleClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{text}</DrawerHeader>
          <p className="text-red-500 text-center animate-bounce">{cpfError}</p>
          <p className="text-red-500 text-center animate-bounce">{fullNameError}</p>

          <DrawerBody className="flex flex-col gap-2.5">

            <CpfInput
              setCpfError={setCpfError}
              setCpfRaw={setCpfRaw}
              isRequired={true}
              initialCpf={cpfRaw}
              isUpdating={isUpdating}
            />

            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input placeholder='Full Name' onChange={(e) => handleCustomChange(e, 'fullName')} value={fullName} />
            </FormControl>

            <FormControl>
              <FormLabel>Birthdate</FormLabel>
              <Input placeholder='Birthdate' type="date" onChange={(e) => handleCustomChange(e, 'birthDate')} value={birthDate} />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input placeholder='Phone' onChange={(e) => handleCustomChange(e, 'phone')} value={phone} />
            </FormControl>

            <FormControl>
              <FormLabel>Active</FormLabel>
              <Select onChange={(e) => handleCustomChange(e, 'active')} value={active}>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </Select>
            </FormControl>
          </DrawerBody>



          <DrawerFooter>
            <Button
              variant='outline'
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              colorScheme='blue'
              disabled={cpfError !== null || fullNameError !== null}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}