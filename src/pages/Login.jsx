import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { LogIn, Wifi, Mail } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [isForgotPassword, setIsForgotPassword] = useState(false)

    const { login, resetPassword } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (!email) {
            setError("Please enter your email address")
            return
        }
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            await resetPassword(email)
            setMessage("Password reset link sent! Check your email.")
            setIsForgotPassword(false)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 overflow-hidden relative">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md glass-panel p-8 z-10">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                        <Wifi className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-white mb-2">
                    {isForgotPassword ? "Reset Password" : "Welcome Back"}
                </h2>
                <p className="text-slate-400 text-center mb-8">
                    {isForgotPassword ? "Enter your email to receive a reset link" : "Sign in to control your ESP32 devices"}
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {message}
                    </div>
                )}

                {isForgotPassword ? (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                                placeholder="you@example.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Mail className="w-5 h-5" />
                                    <span>Send Reset Link</span>
                                </>
                            )}
                        </button>
                        <p className="mt-4 text-center text-slate-400 text-sm">
                            <button type="button" onClick={() => setIsForgotPassword(false)} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                Back to Login
                            </button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-slate-300">Password</label>
                                <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>
                )}

                {!isForgotPassword && (
                    <p className="mt-6 text-center text-slate-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                            Sign up
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}
