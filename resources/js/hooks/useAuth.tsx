import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
    logout: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            await authService.login({ email, password });
            await loadUser();
            toast.success('Đăng nhập thành công!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        try {
            await authService.register({ name, email, password, password_confirmation });
            // Don't auto login
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            toast.success('Đăng xuất thành công!');
        } catch (error: any) {
            toast.error('Đăng xuất thất bại');
        }
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}



