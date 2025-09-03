import React, { useState } from 'react';

interface LandingPageProps {
  onIniciarSistema: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onIniciarSistema }) => {
  const [mostrarCaracteristicas, setMostrarCaracteristicas] = useState(false);

  const caracteristicas = [
    {
      icono: '📦',
      titulo: 'Estación de Recibo',
      descripcion: 'Recibe mercancía del proveedor y acomoda en ubicaciones del almacén'
    },
    {
      icono: '🚚',
      titulo: 'Estación de Surtido',
      descripcion: 'Selecciona herramientas y surte pedidos con montacargas, diablito o patín hidráulico'
    },
    {
      icono: '📋',
      titulo: 'Estación de Embarque',
      descripcion: 'Prepara, embala y verifica los pedidos surtidos para su envío'
    },
    {
      icono: '🚛',
      titulo: 'Línea de Transportista',
      descripcion: 'Gestiona las entregas y el seguimiento de pedidos embarcados'
    }
  ];

  const beneficios = [
    '🎯 Capacitación interactiva del personal',
    '📊 Seguimiento en tiempo real de pedidos',
    '🛠️ Selección inteligente de herramientas',
    '📱 Interfaz intuitiva y moderna',
    '🔄 Flujo de trabajo optimizado',
    '📈 Mejora de eficiencia operativa'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-blue-600 text-3xl font-bold">A</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Sistema Atlas</h1>
                <p className="text-blue-200 text-lg">Plataforma de Capacitación Logística</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-sm">Versión 2.0</p>
              <p className="text-blue-300 text-xs">Sistema de Entrenamiento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            ¡Bienvenidos al Sistema Atlas!
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            La plataforma donde los trabajadores revisan y procesan pedidos en línea para surtir, 
            embarcar y entregar con las mejores herramientas y procesos optimizados.
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <button
              onClick={onIniciarSistema}
              className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              🚀 Iniciar Sistema
            </button>
            <button
              onClick={() => setMostrarCaracteristicas(!mostrarCaracteristicas)}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl border border-blue-500"
            >
              {mostrarCaracteristicas ? '📖 Ocultar Info' : '📖 Ver Características'}
            </button>
          </div>
        </div>

        {/* Características */}
        {mostrarCaracteristicas && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-white">
              🏭 Estaciones del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {caracteristicas.map((caracteristica, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-4xl mb-4 text-center">{caracteristica.icono}</div>
                  <h4 className="text-xl font-bold mb-3 text-center">{caracteristica.titulo}</h4>
                  <p className="text-blue-200 text-sm text-center leading-relaxed">
                    {caracteristica.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Beneficios */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            ✨ Beneficios del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficios.map((beneficio, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-2xl">{beneficio.split(' ')[0]}</span>
                <span className="text-blue-100 font-medium">{beneficio.substring(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flujo de Trabajo */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            🔄 Flujo de Trabajo
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg">
                📦
              </div>
              <h4 className="text-lg font-bold mb-2">Recibo</h4>
              <p className="text-blue-200 text-sm text-center max-w-32">Mercancía llega al CEDIS</p>
            </div>
            <div className="hidden md:block text-2xl text-blue-300">→</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg">
                🚚
              </div>
              <h4 className="text-lg font-bold mb-2">Surtido</h4>
              <p className="text-blue-200 text-sm text-center max-w-32">Selección de herramientas y surtido</p>
            </div>
            <div className="hidden md:block text-2xl text-blue-300">→</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg">
                📋
              </div>
              <h4 className="text-lg font-bold mb-2">Embarque</h4>
              <p className="text-blue-200 text-sm text-center max-w-32">Preparación y embalaje</p>
            </div>
            <div className="hidden md:block text-2xl text-blue-300">→</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg">
                🚛
              </div>
              <h4 className="text-lg font-bold mb-2">Transporte</h4>
              <p className="text-blue-200 text-sm text-center max-w-32">Entrega al cliente</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h3>
            <p className="text-blue-100 mb-6">
              Accede al sistema Atlas y comienza a procesar pedidos con las mejores herramientas
            </p>
            <button
              onClick={onIniciarSistema}
              className="bg-white text-blue-900 px-12 py-4 rounded-xl font-bold text-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              🎯 Acceder al Sistema
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/20 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-blue-200 text-sm">
              © 2024 Sistema Atlas - Plataforma de Capacitación Logística
            </p>
            <p className="text-blue-300 text-xs mt-2">
              Desarrollado para optimizar el flujo de trabajo y capacitar al personal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
