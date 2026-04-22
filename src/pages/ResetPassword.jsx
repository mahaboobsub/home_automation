import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { KeyRound, Lock } from 'lucide-react'

export default function ResetPassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const { updatePassword } = useAuth()
    const navigate = useNavigate()

    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        setError(null)
        setMessage(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match!")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        try {
            await updatePassword(password)
            setMessage("Password updated successfully! Redirecting...")
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
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
                        <KeyRound className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-white mb-2">Create New Password</h2>
                <p className="text-slate-400 text-center mb-8">Please enter your new password below.</p>

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

                <form onSubmit={handleUpdatePassword} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!message}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                <span>Change Password</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
