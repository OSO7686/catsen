import { Link } from 'react-router-dom';

// Lista de tus categorías reales (las mismas que en tu Header)
const categorias = [
  { nombre: 'SpO2', icon: 'fas fa-fingerprint' },
  { nombre: 'ECG Cables', icon: 'fas fa-wave-square' },
  { nombre: 'EKG Cables', icon: 'fas fa-heartbeat' },
  { nombre: 'NIBP', icon: 'fas fa-stethoscopes' },
  { nombre: 'IBP Cables', icon: 'fas fa-tint' },
  { nombre: 'Temperature', icon: 'fas fa-thermometer-half' },
  { nombre: 'Fetal', icon: 'fas fa-baby' },
  { nombre: 'Oxygen Sensors', icon: 'fas fa-lungs' },
];

function CategoriasPrincipales() {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-blue-600 pl-4">
          Main Categories
        </h2>
        {/* The "View All" button is also functional */}
        <Link to="/categorias" className="text-xs font-bold text-blue-600 hover:underline">
          View All Catalog <i className="fas fa-arrow-right ml-1"></i>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categorias.map((cat, index) => (
          /* Here we convert the div into a functional <Link> */
          <Link 
            key={index}
            to={`/categorias?tipo=${cat.nombre}`}
            className="bg-white p-8 text-center border hover:border-blue-500 transition-all group cursor-pointer block"
          >
            <i className={`${cat.icon} text-4xl text-gray-300 group-hover:text-blue-600 mb-4 transition-colors`}></i>
            <h3 className="text-xs font-black uppercase tracking-widest">{cat.nombre}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoriasPrincipales;