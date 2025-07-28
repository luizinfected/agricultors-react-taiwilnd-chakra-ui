import { useEffect, useState } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Container,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Input,
    Select,
    Portal,
} from '@chakra-ui/react'
import { DrawerAgricultor } from '../components/Drawer'
import { deleteAgricultor, getAgricultors } from '../common/request'
import type { Agricultor } from '../types/agricultorTypes'
import { toast } from 'react-toastify'

type AgricultorsProps = {
    setRoutes: React.Dispatch<React.SetStateAction<'home' | 'agricultors' | 'viewAgricultor'>>
}

export const Agricultors = ({ setRoutes }: AgricultorsProps) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [data, setData] = useState([])
    const [trigger, setTrigger] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateData, setUpdateData] = useState<Agricultor | null>(null)
    const [deleteId, setDeleteId] = useState('')
    const [nameFilter, setNameFilter] = useState('');
    const [cpfFilter, setCpfFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const maskedCpf = (cpf: string) => {
        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`
    }

    const viewAgricultor = (agricultor: Agricultor) => {
        setRoutes('viewAgricultor')
        localStorage.setItem('agricultor', JSON.stringify(agricultor))
    }

    const updateAgricultor = (agricultor: Agricultor) => {
        setIsUpdating(true)
        setUpdateData(agricultor)
        onOpen()
    }

    const removeAgricultor = async () => {
        const response = await deleteAgricultor(deleteId)

        if (response.error) {
            return
        }
        toast.success('Agricultor deleted successfully')
        onDeleteClose()
        setDeleteId('')
        setTrigger(true)
    }

    const OpenDeleteModal = (id: string) => {
        onDeleteOpen()
        setDeleteId(id)
    }

    const fetchData = async () => {
        try {
            const agricultors = await getAgricultors();
            setData(agricultors)
        } catch (error) {
            console.error(error)
        }
    }

    const filteredData = data.filter((agricultor: Agricultor) => {
        const fullNameMatch = agricultor.fullName.toLowerCase().includes(nameFilter.toLowerCase())
        const cpfMatch = agricultor.cpf.includes(cpfFilter)
        const statusMatch =
            statusFilter === ''
            || (statusFilter === 'active' && agricultor.active)
            || (statusFilter === 'inactive' && !agricultor.active)

        return fullNameMatch && cpfMatch && statusMatch
    })


    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchData()
        setTrigger(false)
        setUpdateData(null)
        setIsUpdating(false)
    }, [trigger])

    return (
        <div className='bg-[#242424] flex justify-center items-center h-[90vh]'>

            <Container maxWidth={'container.lg'}>
                <div className='text-3xl font-bold text-white mb-5 text-center'>Agricultors</div>

                <div className='flex justify-between'>
                    <Button background={'#063a1b'} color={'#fff'} _hover={{ color: '#000', backgroundColor: '#eee8d4' }} onClick={() => setRoutes('home')}>
                        Home
                    </Button>

                    <Button background={'#063a1b'} color={'#fff'} _hover={{ color: '#000', backgroundColor: '#eee8d4' }} onClick={onOpen}>
                        Create Agricultor
                    </Button>
                </div>

                <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        placeholder="Filter by name"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        bg="black.100"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
                        focusBorderColor="green.700"
                    />
                    <Input
                        placeholder="Filter by CPF"
                        value={cpfFilter}
                        onChange={(e) => setCpfFilter(e.target.value)}
                        bg="black.100"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
                        focusBorderColor="green.700"
                    />
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        bg="black.100"
                        color="white"
                        focusBorderColor="green.700"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>
                </div>



                <DrawerAgricultor
                    text={isUpdating ? 'Update Agricultor' : 'Create Agricultor'}
                    isOpen={isOpen}
                    onClose={() => onClose()}
                    setTrigger={setTrigger}
                    isUpdating={isUpdating}
                    setIsUpdating={setIsUpdating}
                    agricultor={updateData}
                />

                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th textAlign={'center'}>Full Name</Th>
                                <Th textAlign={'center'}>CPF</Th>
                                <Th textAlign={'center'}>Birth date</Th>
                                <Th textAlign={'center'}>Phone</Th>
                                <Th textAlign={'center'}>Active</Th>
                                <Th textAlign={'center'}>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredData?.map((agricultor: Agricultor) => (
                                <Tr key={agricultor._id} className='text-white'>
                                    <Td textAlign={'center'}>{agricultor.fullName}</Td>
                                    <Td textAlign={'center'}>{maskedCpf(agricultor.cpf)}</Td>
                                    <Td textAlign={'center'}>
                                        {agricultor.birthDate &&
                                            new Date(agricultor.birthDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </Td>
                                    <Td textAlign={'center'}>{agricultor.phone && agricultor.phone}</Td>
                                    <Td textAlign={'center'}>{agricultor.active ? 'Active' : 'Inactive'}</Td>
                                    <Td textAlign={'center'}>
                                        <Menu placement="top">
                                            <MenuButton as={Button}>
                                                <i className="ri-edit-box-line text-black"></i>
                                            </MenuButton>
                                              <Portal>
                                                <MenuList zIndex={9999}>
                                                <MenuItem onClick={() => updateAgricultor(agricultor)} color="#111">Update</MenuItem>
                                                <MenuItem onClick={() => OpenDeleteModal(agricultor._id)} color="#111">Remove</MenuItem>
                                                <MenuItem onClick={() => viewAgricultor(agricultor)} color="#111">View</MenuItem>
                                                </MenuList>
                                            </Portal>
                                        </Menu>
                                    </Td>
                                </Tr>
                            ))}

                        </Tbody>
                    </Table>
                </TableContainer>

            </Container>


            <Modal onClose={onDeleteClose} isOpen={isDeleteOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Do you want to remove this agricultor?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <h2>Click on the button below to confirm</h2>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={removeAgricultor} colorScheme='red'>Remove</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}