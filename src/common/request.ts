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

export const createFarmer = async (body: Record<string, unknown>) => {
    return request(`${apiUrl}/farmers`, 'POST', body)
}

export const getFarmers = async (page = 1, limit = 10) => {
    return request(`${apiUrl}/farmers?page=${page}&limit=${limit}`)
}

export const deleteFarmer = async (id: string) => {
    return request(`${apiUrl}/farmers/${id}`, 'DELETE')
}

export const updateFarmer = async (id: string, body: Record<string, unknown>) => {
    return request(`${apiUrl}/farmers/${id}`, 'PATCH', body)
}

export const getFarmer = async (id: string) => {
    return request(`${apiUrl}/farmers/${id}`)
}