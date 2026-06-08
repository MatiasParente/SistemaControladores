export default function StatCard({ label, value, icon: Icon, iconColor }) {
    return (
        <div className="bg-[#0B1121] p-6 rounded-3xl border border-gray-800 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-400 text-sm font-semibold">{label}</p>
                    <h3 className="text-4xl font-bold text-white mt-2">{value}</h3>
                </div>
                {Icon && (
                    <div className="p-3 bg-gray-800/40 rounded-2xl border border-gray-800">
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                )}
            </div>
        </div>
    );
}