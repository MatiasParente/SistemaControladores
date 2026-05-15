export default function RecentDeclarations({ lista }) {
    const datos = lista;

    return (
        <div className="mt-8 bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">Declaraciones Recientes</h3>
            
            <div className="space-y-3">
                {/* 2. El MAP recorre la lista 'datos' y por cada uno crea un <div> 
                datos.map((item) =>  es clave para poder realizar la lista que aumente de forma dinamica*/}
                {datos.map((item) => (
                    <div key={item.id} className="flex justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
                        <span className="text-gray-200 font-medium">{item.empresa.razonSocial}</span>
                        <span className="text-emerald-400 font-bold">{item.estado.tipoEstado}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
