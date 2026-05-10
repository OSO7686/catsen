function Footer() {
  return (
    <footer className="bg-gray-100 py-20 px-4 border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1">
          <div className="font-black text-xl mb-6 tracking-tighter">MEDSENSORS</div>
          <p className="text-xs text-gray-500 leading-relaxed uppercase font-bold tracking-widest">Expertos en conectividad médica de alta tecnología para México y Latinoamérica.</p>
        </div>
        <div>
          <h5 className="font-black text-[10px] uppercase tracking-widest mb-6 text-gray-400">Atención</h5>
          <ul className="text-xs font-bold space-y-4">
            <li><a href="#" className="hover:text-blue-600 uppercase">Envíos y Entregas</a></li>
            <li><a href="#" className="hover:text-blue-600 uppercase">Garantías</a></li>
            <li><a href="#" className="hover:text-blue-600 uppercase">Preguntas Frecuentes</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-black text-[10px] uppercase tracking-widest mb-6 text-gray-400">Legal</h5>
          <ul className="text-xs font-bold space-y-4">
            <li><a href="#" className="hover:text-blue-600 uppercase">Términos y Condiciones</a></li>
            <li><a href="#" className="hover:text-blue-600 uppercase">Aviso de Privacidad</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-black text-[10px] uppercase tracking-widest mb-6 text-gray-400">Ubicación</h5>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-600">Torreón, Coahuila, México</p>
          <div className="flex space-x-4 mt-6 text-xl text-gray-400">
            <i className="fab fa-facebook hover:text-blue-600 cursor-pointer"></i>
            <i className="fab fa-instagram hover:text-pink-600 cursor-pointer"></i>
            <i className="fab fa-linkedin hover:text-blue-800 cursor-pointer"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 