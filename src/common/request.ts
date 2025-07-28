import { toast } from "react-toastify"

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3003'

const request = async (url: string, method = 'GET', body?: Record<string, unknown>) => {

    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        ...(body && { body: JSON.stringify(body) })
    }

    try {
        const response = await fetch(url, options)
        
        const data = await response.json()
        
        if(data.error){
            if(Array.isArray(data.message)) {
                toast.error(data.message[0])
            } else{
                toast.error(data.message)
            }
            return
        }

        return data
    } catch (error) {
        console.error(error)
    }
}

export const createAgricultor = async (body: Record<string, unknown>) => {
    return request(`${apiUrl}/agricultors`, 'POST', body)
}

export const getAgricultors = async () => {
    return request(`${apiUrl}/agricultors`)
}

export const deleteAgricultor = async (id: string) => {
    return request(`${apiUrl}/agricultors/${id}`, 'DELETE')
}

export const updateAgricultor = async (id: string, body: Record<string, unknown>) => {
    return request(`${apiUrl}/agricultors/${id}`, 'PATCH', body)
}

export const getAgricultor = async (id: string) => {
    return request(`${apiUrl}/agricultors/${id}`)
}