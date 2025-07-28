// import {useState} from 'react'
import { Button } from '@chakra-ui/react'
import Image from '../assets/agricultors.png'
import { Container } from '@chakra-ui/react'
import type React from 'react'


type HomeProps = {
    setRoutes: React.Dispatch<React.SetStateAction<'home' | 'agricultors' | 'viewAgricultor'>>
}
export const Home = ({setRoutes}: HomeProps) => {
    
    return (
        <div className='bg-[#242424]' >
            <Container className='h-[90vh]'>
                <div className='flex justify-center items-center bg-[#242424] h-full flex-col'>
                    <img 
                        src={Image} 
                        alt="Agricultors" 
                        style={{maxWidth: '350px'}}
                        className='rounded-full p-3 my-5 transform hover:scale-105 duration-300 ease-in-out' 
                        title='Agricultors' 
                    />
                    <Button
                        color="#fff"
                        backgroundColor="#063a1b"
                        _hover={{
                            color: '#000',
                            backgroundColor: '#eee8d4', 
                        }}
                        onClick={() => setRoutes('agricultors')}
                    >
                        Access the admin panel
                    </Button>
                </div>
            </Container>
        </div>
    )
}