// src/lib/api.ts
import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // or from .env

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // if using cookies for auth
});