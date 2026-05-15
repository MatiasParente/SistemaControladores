export default function StatCard({ label, value }) {
    return (
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-gray-400 text-sm font-medium">{label}</p>
            <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
        </div>
    );
}
