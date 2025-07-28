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
import { DrawerFarmers } from '../components/Drawer'
import { deleteFarmer, getFarmers } from '../common/request'
import type { Farmer } from '../types/farmerTypes'
import { toast } from 'react-toastify'

type FarmersProps = {
    setRoutes: React.Dispatch<React.SetStateAction<'home' | 'farmers' | 'viewFarmer'>>
}

export const Farmers = ({ setRoutes }: FarmersProps) => {

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [totalCount, setTotalCount] = useState(0)
    const hasNextPage = page * limit < totalCount
    // const totalPages = Math.ceil(totalCount / limit)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    const [data, setData] = useState([])
    const [updateData, setUpdateData] = useState<Farmer | null>(null)
    const [trigger, setTrigger] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [deleteId, setDeleteId] = useState('')

    const [nameFilter, setNameFilter] = useState('')
    const [cpfFilter, setCpfFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const maskedCpf = (cpf: string) => {
        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`
    }

    const viewFarmer = (farmer: Farmer) => {
        setRoutes('viewFarmer')
        localStorage.setItem('farmer', JSON.stringify(farmer))
    }

    const updateFarmer = (farmer: Farmer) => {
        setIsUpdating(true)
        setUpdateData(farmer)
        onOpen()
    }

    const removeFarmer = async () => {
        const response = await deleteFarmer(deleteId)

        if (response.error) {
            return
        }
        toast.success('Farmer deleted successfully')
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
            const farmers = await getFarmers(page, limit)
            console.log(farmers)
            setData(farmers.data ?? [])
            setTotalCount(farmers.total)
        } catch (error) {
            console.error(error)
        }
    }

    const filteredData = Array.isArray(data)
        ? data.filter((farmer: Farmer) => {
            const fullNameMatch = farmer.fullName.toLowerCase().includes(nameFilter.toLowerCase())
            const cpfMatch = farmer.cpf.includes(cpfFilter)
            const statusMatch =
                statusFilter === ''
                || (statusFilter === 'active' && farmer.active)
                || (statusFilter === 'inactive' && !farmer.active)

            return fullNameMatch && cpfMatch && statusMatch
        })
        : []


    useEffect(() => {
        fetchData()
    }, [page, limit])

    useEffect(() => {
        fetchData()
        setTrigger(false)
        setUpdateData(null)
        setIsUpdating(false)
    }, [trigger])

    return (
        <div className='bg-[#242424] flex justify-center items-center'>

            <Container maxWidth={'container.lg'}>
                <div className='text-3xl font-bold text-white mb-5 text-center'>Agricultors</div>

                <div className='flex justify-between'>
                    <Button background={'#063a1b'} color={'#fff'} _hover={{ color: '#000', backgroundColor: '#eee8d4' }} onClick={() => setRoutes('home')}>
                        Home
                    </Button>

                    <Button background={'#063a1b'} color={'#fff'} _hover={{ color: '#000', backgroundColor: '#eee8d4' }} onClick={onOpen}>
                        Create Farmer
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

                <div className="flex justify-end text-gray-400">
                    <h2>Total of farmers found: {totalCount}</h2>
                </div>

                <DrawerFarmers
                    text={isUpdating ? 'Update Farmer' : 'Create Farmer'}
                    isOpen={isOpen}
                    onClose={() => onClose()}
                    setTrigger={setTrigger}
                    isUpdating={isUpdating}
                    setIsUpdating={setIsUpdating}
                    farmer={updateData}
                />

                <TableContainer>
                    <Table variant='simple' className='overflow-y-auto'>
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
                            {filteredData?.map((farmer: Farmer) => (
                                <Tr key={farmer._id} className='text-white'>
                                    <Td textAlign={'center'}>{farmer.fullName}</Td>
                                    <Td textAlign={'center'}>{maskedCpf(farmer.cpf)}</Td>
                                    <Td textAlign={'center'}>
                                        {farmer.birthDate !== null ? new Date(farmer.birthDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}
                                    </Td>
                                    <Td textAlign={'center'}>{farmer.phone !== '' ? farmer.phone : 'N/A'}</Td>
                                    <Td textAlign={'center'}>{farmer.active ? 'Active' : 'Inactive'}</Td>
                                    <Td textAlign={'center'}>
                                        <Menu placement="top">
                                            <MenuButton as={Button}>
                                                <i className="ri-edit-box-line text-black"></i>
                                            </MenuButton>
                                            <Portal>
                                                <MenuList zIndex={9999}>
                                                    <MenuItem onClick={() => updateFarmer(farmer)} color="#111">Update</MenuItem>
                                                    <MenuItem onClick={() => OpenDeleteModal(farmer._id)} color="#111">Remove</MenuItem>
                                                    <MenuItem onClick={() => viewFarmer(farmer)} color="#111">View</MenuItem>
                                                </MenuList>
                                            </Portal>
                                        </Menu>
                                    </Td>
                                </Tr>
                            ))}

                        </Tbody>
                    </Table>
                </TableContainer>

                <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
                    <div className="flex justify-center items-center flex-grow gap-4 sm:translate-x-10">
                        <Button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            isDisabled={page === 1}
                            color="white"
                            bg="black.100"
                            _hover={{ color: '#000', backgroundColor: '#eee8d4' }}
                            variant="outline"
                        >
                            <i className="ri-arrow-left-s-line"></i>
                        </Button>
                        <span className="text-white self-center">Page {page}</span>
                        <Button
                            onClick={() => setPage((prev) => prev + 1)}
                            color="white"
                            bg="black.100"
                            _hover={{ color: '#000', backgroundColor: '#eee8d4' }}
                            variant="outline"
                            isDisabled={!hasNextPage}
                        >
                            <i className="ri-arrow-right-s-line"></i>
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-white">Limit:</p>
                        <Select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            bg="black.100"
                            color="white"
                            focusBorderColor="green.700"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </Select>
                    </div>
                </div>

            </Container>


            <Modal onClose={onDeleteClose} isOpen={isDeleteOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Do you want to remove this farmer?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <h2>Click on the button below to confirm</h2>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={removeFarmer} colorScheme='red'>Remove</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}