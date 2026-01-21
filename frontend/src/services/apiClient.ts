import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://localhost:5000';

/**
 * API Client với auto-attach Authorization header
 */
class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to attach token
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor to handle errors
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/admin/login';
                }
                return Promise.reject(error);
            }
        );
    }

    public getClient(): AxiosInstance {
        return this.client;
    }
}

export const apiClient = new ApiClient().getClient();
