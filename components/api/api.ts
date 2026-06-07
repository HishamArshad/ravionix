import axios from "axios"
import { authState } from "../store/auth"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config) => {
  const token = authState.token.get()

  if (token) {
    config.headers.Authorization = `Token ${token}`
  }

  return config
})
