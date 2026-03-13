import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../components/AuthProvider'
import IPCard from '../components/IPCard'
import { LogOut, Plus, Server, AlertCircle } from 'lucide-react'

export default function Dashboard() {
    const [ipAddress, setIpAddress] = useState('')
    const [devices, setDevices] = useState([])
    const [loading, setLoading] = useState(true)
    const [addingLocation, setAddingLocation] = useState(false)

    const { session, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchDevices()
    }, [])

    const fetchDevices = async () => {
        try {
            if (!session) return

            const { data, error } = await supabase
                .from('devices_new')
                .select('*')
                .eq('user_id', session.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setDevices(data || [])
        } catch (error) {
            console.error('Error fetching devices:', error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAddDevice = async (e) => {
        e.preventDefault()
        if (!ipAddress.trim()) return

        setAddingLocation(true)
        try {
            const { data, error } = await supabase
                .from('devices_new')
                .insert([
                    { user_id: session.id, ip_address: ipAddress.trim() }
                ])
                .select()

            if (error) throw error

            if (data) {
                setDevices([data[0], ...devices])
            }

            window.open(`http://${ipAddress.trim()}`, "_blank")
            setIpAddress('')
        } catch (error) {
            console.error('Error adding device:', error.message)
            alert("Failed to save device IP. Is your Supabase table setup correct?")
        } finally {
            setAddingLocation(false)
        }
    }

    const handleDeleteDevice = async (id) => {
        try {
            const { error } = await supabase
                .from('devices_new')
                .delete()
                .match({ id })

            if (error) throw error
            setDevices(devices.filter(d => d.id !== id))
        } catch (error) {
            console.error('Error deleting device:', error.message)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200">
            <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Server className="w-6 h-6 text-emerald-400" />
                        <h1 className="text-xl font-bold text-white tracking-tight">IoT Central</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <span className="text-sm font-medium">Log out</span>
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="glass-panel p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>

                    <h2 className="text-lg font-semibold text-white mb-2">Connect New Device</h2>
                    <p className="text-slate-400 text-sm mb-6">Enter the local IP address given by your ESP32-C3 after connecting to WiFi.</p>

                    <form onSubmit={handleAddDevice} className="flex gap-4 flex-col sm:flex-row">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={ipAddress}
                                onChange={(e) => setIpAddress(e.target.value)}
                                placeholder="e.g. 192.168.1.108"
                                className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-500 font-mono"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={addingLocation || !ipAddress.trim()}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 sm:w-auto"
                        >
                            {addingLocation ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    <span>Open & Save</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        Saved Devices <span className="ml-2 bg-slate-800 text-slate-400 text-xs py-0.5 px-2 rounded-full">{devices.length}</span>
                    </h3>

                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : devices.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-700/50 rounded-2xl bg-slate-800/20">
                            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                            <p className="text-slate-400">No devices saved yet.</p>
                            <p className="text-sm text-slate-500 mt-1">Connect your first ESP32 device above.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {devices.map((device) => (
                                <IPCard
                                    key={device.id}
                                    device={device}
                                    onDelete={handleDeleteDevice}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
