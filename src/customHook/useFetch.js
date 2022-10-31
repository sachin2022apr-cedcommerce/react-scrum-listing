// import { useState } from 'react'

// custom hook
export default function useFetch() {
    async function extractDataFromApi (url, body) {
        const result = await fetch(url, body)
        return await result.json()
    }
    return { extractDataFromApi }
}