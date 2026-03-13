import { ExternalLink, Trash2, Cpu } from 'lucide-react'

export default function IPCard({ device, onDelete }) {
    const handleOpen = () => {
        window.open(`http://${device.ip_address}`, "_blank")
    }

    return (
        <div className="glass-panel p-4 flex items-center justify-between group hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Cpu className="text-emerald-400 w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-400 mb-1">Device IP</p>
                    <p className="font-mono text-lg text-slate-100">{device.ip_address}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={handleOpen}
                    className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                    title="Open Device Control"
                >
                    <ExternalLink className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDelete(device.id)}
                    className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Delete Device"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
