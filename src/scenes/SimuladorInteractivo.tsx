import React, { useState } from 'react';
import type { Pedido, Usuario } from '../App';

interface SimuladorInteractivoProps {
  usuarios: Usuario[];
  pedidos: Pedido[];
  sesionActiva: Usuario | null;
  onIniciarSesion: (usuario: Usuario) => void;
  onPedidoCreado: (pedido: Pedido) => void;
  onPedidoActualizado: (pedidoId: string, nuevoEstado: Pedido['estado']) => void;
  onAsignarUsuario?: (pedidoId: string, rol: keyof Pedido, usuarioId: string) => void;
}

interface Herramienta {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  tipoCarga: 'ligera' | 'media' | 'pesada';
  velocidad: number;
  capacidad: string;
}

const SimuladorInteractivo: React.FC<SimuladorInteractivoProps> = ({
  usuarios,
  pedidos,
  sesionActiva,
  onIniciarSesion,
  onPedidoCreado,
  onPedidoActualizado
}) => {
  const [mostrarFormularioPedido, setMostrarFormularioPedido] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState({
    cliente: '',
    productos: [] as Array<{ nombre: string; cantidad: number; ubicacion: string }>
  });

  const herramientas: Herramienta[] = [
    {
      id: 'diablito',
      nombre: 'Diablito de Carga',
      icono: '🦽',
      descripcion: 'Ideal para productos ligeros y precisión en el surtido',
      tipoCarga: 'ligera',
      velocidad: 8,
      capacidad: 'Hasta 50 kg'
    },
    {
      id: 'patin',
      nombre: 'Patín Hidráulico',
      icono: '🛒',
      descripcion: 'Perfecto para cargas medianas y movilidad eficiente',
      tipoCarga: 'media',
      velocidad: 6,
      capacidad: 'Hasta 200 kg'
    },
    {
      id: 'montacargas',
      nombre: 'Montacargas',
      icono: '🚛',
      descripcion: 'Para cargas pesadas, voluminosas y pallets completos',
      tipoCarga: 'pesada',
      velocidad: 4,
      capacidad: 'Hasta 1000 kg'
    }
  ];

  const productosDisponibles = [
    { nombre: 'Leche Entera 1L', ubicacion: 'A-01-01', peso: '1 kg', categoria: 'Lácteos' },
    { nombre: 'Pan Integral', ubicacion: 'A-02-03', peso: '0.5 kg', categoria: 'Panadería' },
    { nombre: 'Manzanas Rojas 1kg', ubicacion: 'B-01-05', peso: '1 kg', categoria: 'Frutas' },
    { nombre: 'Pollo Entero 2kg', ubicacion: 'C-03-02', peso: '2 kg', categoria: 'Cárnicos' },
    { nombre: 'Arroz Blanco 1kg', ubicacion: 'D-01-01', peso: '1 kg', categoria: 'Granos' }
  ];

  const crearPedido = () => {
    if (!nuevoPedido.cliente || nuevoPedido.productos.length === 0) return;

    const pedido: Pedido = {
      id: `PED-${Date.now()}`,
      cliente: nuevoPedido.cliente,
      productos: nuevoPedido.productos.map((p, index) => ({
        id: `PROD-${index}`,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: Math.random() * 50 + 10,
        ubicacion: p.ubicacion,
        categoria: productosDisponibles.find(prod => prod.nombre === p.nombre)?.categoria || 'General'
      })),
      estado: 'pendiente',
      fecha: new Date(),
      total: 0
    };

    onPedidoCreado(pedido);
    setNuevoPedido({ cliente: '', productos: [] });
    setMostrarFormularioPedido(false);
  };

  const agregarProducto = (producto: typeof productosDisponibles[0]) => {
    setNuevoPedido(prev => ({
      ...prev,
      productos: [...prev.productos, { nombre: producto.nombre, cantidad: 1, ubicacion: producto.ubicacion }]
    }));
  };

  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      setNuevoPedido(prev => ({
        ...prev,
        productos: prev.productos.filter((_, i) => i !== index)
      }));
    } else {
      setNuevoPedido(prev => ({
        ...prev,
        productos: prev.productos.map((p, i) => 
          i === index ? { ...p, cantidad: nuevaCantidad } : p
        )
      }));
    }
  };

  const seleccionarHerramienta = (pedido: Pedido, herramienta: Herramienta) => {
    // Simular selección de herramienta basada en el tipo de carga
    const pesoTotal = pedido.productos.reduce((total, p) => total + (p.cantidad * 1), 0);
    
    if (pesoTotal <= 50 && herramienta.tipoCarga === 'ligera') {
      alert(`✅ ¡Excelente elección! ${herramienta.nombre} es perfecta para este pedido ligero (${pesoTotal} kg)`);
    } else if (pesoTotal <= 200 && herramienta.tipoCarga === 'media') {
      alert(`✅ ¡Perfecto! ${herramienta.nombre} es ideal para este pedido mediano (${pesoTotal} kg)`);
    } else if (pesoTotal > 200 && herramienta.tipoCarga === 'pesada') {
      alert(`✅ ¡Correcto! ${herramienta.nombre} es necesaria para esta carga pesada (${pesoTotal} kg)`);
    } else {
      alert(`⚠️ Esta herramienta no es la más adecuada para este pedido (${pesoTotal} kg). Considera una herramienta más apropiada para el peso de la carga.`);
    }
  };

  const procesarPedido = (pedido: Pedido, accion: string) => {
    switch (accion) {
      case 'revisar':
        onPedidoActualizado(pedido.id, 'en_proceso');
        break;
      case 'surtir':
        onPedidoActualizado(pedido.id, 'surtido');
        break;
      case 'embarcar':
        onPedidoActualizado(pedido.id, 'embarcado');
        break;
      case 'enviar':
        onPedidoActualizado(pedido.id, 'enviado');
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🏭 Sistema Atlas - Panel de Control</h2>
        <p className="text-gray-600">Revisa pedidos asignados y gestiona el flujo de trabajo del sistema logístico</p>
      </div>

      {/* Selección de Rol */}
      {!sesionActiva ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">👥 Acceso al Sistema Atlas</h3>
          <p className="text-gray-600 mb-6">Selecciona tu rol para acceder a las funciones del sistema Atlas y revisar los pedidos asignados</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  usuario.estado === 'disponible'
                    ? 'border-blue-300 hover:border-blue-500 hover:shadow-lg'
                    : 'border-gray-300 bg-gray-100 cursor-not-allowed'
                }`}
                onClick={() => usuario.estado === 'disponible' && onIniciarSesion(usuario)}
              >
                <div className="text-4xl mb-2">{usuario.avatar}</div>
                <h4 className="font-medium text-gray-900">{usuario.nombre}</h4>
                <p className="text-sm text-gray-600 capitalize">{usuario.rol.replace('_', ' ')}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                  usuario.estado === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {usuario.estado === 'disponible' ? 'Disponible' : 'Ocupado'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Panel del Usuario Activo */
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{sesionActiva.avatar}</div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900">Sesión Activa: {sesionActiva.nombre}</h3>
                <p className="text-blue-700 capitalize">Rol: {sesionActiva.rol.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Estado: Activo</p>
              <p className="text-xs text-blue-500">Trabajando en el sistema Atlas</p>
            </div>
          </div>
        </div>
      )}

      {/* Panel de Pedidos Asignados para Operador Atlas */}
      {sesionActiva?.rol === 'operador_atlas' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Pedidos Asignados en Sistema Atlas</h3>
          <p className="text-gray-600 mb-4">Revisa los pedidos que han sido asignados para procesamiento en el sistema</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">
                {pedidos.filter(p => p.estado === 'pendiente').length}
              </div>
              <div className="text-sm text-yellow-600">Pendientes de Revisión</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {pedidos.filter(p => p.estado === 'en_proceso').length}
              </div>
              <div className="text-sm text-blue-600">En Proceso</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {pedidos.filter(p => p.estado === 'surtido' || p.estado === 'embarcado' || p.estado === 'enviado').length}
              </div>
              <div className="text-sm text-green-600">Procesados</div>
            </div>
          </div>

          {pedidos.filter(p => p.estado === 'pendiente').length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Pedidos Pendientes de Revisión:</h4>
              {pedidos.filter(p => p.estado === 'pendiente').map((pedido) => (
                <div key={pedido.id} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">Pedido {pedido.id}</h5>
                      <p className="text-sm text-gray-600">Cliente: {pedido.cliente}</p>
                      <p className="text-sm text-gray-600">{pedido.productos.length} productos</p>
                    </div>
                    <button
                      onClick={() => procesarPedido(pedido, 'revisar')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      🔍 Revisar en Atlas
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Productos: {pedido.productos.map(p => `${p.nombre} (${p.ubicacion})`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Crear Pedido (Solo para Clientes) */}
      {sesionActiva?.rol === 'cliente' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">🛒 Crear Nuevo Pedido</h3>
            <button
              onClick={() => setMostrarFormularioPedido(!mostrarFormularioPedido)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mostrarFormularioPedido ? '❌ Cancelar' : '➕ Nuevo Pedido'}
            </button>
          </div>

          {mostrarFormularioPedido && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={nuevoPedido.cliente}
                onChange={(e) => setNuevoPedido({...nuevoPedido, cliente: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Productos Disponibles:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {productosDisponibles.map((producto) => (
                    <div key={producto.nombre} className="border border-gray-200 rounded-lg p-3">
                      <h5 className="font-medium text-gray-900">{producto.nombre}</h5>
                      <p className="text-sm text-gray-600">Ubicación: {producto.ubicacion}</p>
                      <p className="text-sm text-gray-600">Peso: {producto.peso}</p>
                      <button
                        onClick={() => agregarProducto(producto)}
                        className="mt-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        + Agregar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {nuevoPedido.productos.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Productos en el Pedido:</h4>
                  <div className="space-y-2">
                    {nuevoPedido.productos.map((producto, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">{producto.nombre}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => actualizarCantidad(index, producto.cantidad - 1)}
                            className="w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{producto.cantidad}</span>
                          <button
                            onClick={() => actualizarCantidad(index, producto.cantidad + 1)}
                            className="w-6 h-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={crearPedido}
                    className="mt-4 w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    🚀 Confirmar Pedido
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Herramientas de Surtido */}
      {sesionActiva?.rol === 'surtidor' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🛠️ Herramientas de Surtido del Sistema Atlas</h3>
          <p className="text-gray-600 mb-6">Selecciona la herramienta más adecuada según el peso y tipo de productos a surtir</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {herramientas.map((herramienta) => (
              <div key={herramienta.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="text-6xl mb-4 text-center">{herramienta.icono}</div>
                <h4 className="font-bold text-gray-900 text-lg mb-2 text-center">{herramienta.nombre}</h4>
                <p className="text-sm text-gray-600 mb-4 text-center">{herramienta.descripcion}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Capacidad:</span>
                    <span className="text-xs font-medium text-blue-600">{herramienta.capacidad}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Velocidad:</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${herramienta.velocidad * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-blue-600">{herramienta.velocidad}/10</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Tipo de Carga:</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      herramienta.tipoCarga === 'ligera' ? 'bg-green-100 text-green-800' :
                      herramienta.tipoCarga === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {herramienta.tipoCarga}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos para Selección de Herramientas:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Diablito:</strong> Usa para productos ligeros como pan, lácteos pequeños</li>
              <li>• <strong>Patín Hidráulico:</strong> Ideal para cajas medianas y productos envasados</li>
              <li>• <strong>Montacargas:</strong> Necesario para pallets completos y productos pesados</li>
            </ul>
          </div>
        </div>
      )}

      {/* Pedidos Activos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">📋 Pedidos Activos en el Sistema Atlas</h3>
          <p className="text-sm text-gray-600 mt-1">Seguimiento en tiempo real del flujo de pedidos</p>
        </div>
        <div className="p-6">
          {pedidos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg mb-2">No hay pedidos activos en el sistema</p>
              <p className="text-gray-400 text-sm">Los pedidos aparecerán aquí cuando sean creados por los clientes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Pedido {pedido.id}</h4>
                      <p className="text-sm text-gray-600">Cliente: {pedido.cliente}</p>
                      <p className="text-sm text-gray-600">{pedido.productos.length} productos</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      pedido.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                      pedido.estado === 'surtido' ? 'bg-green-100 text-green-800' :
                      pedido.estado === 'embarcado' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {pedido.estado.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Productos del Pedido */}
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2">Productos:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {pedido.productos.map((producto) => (
                        <div key={producto.id} className="bg-gray-50 p-2 rounded text-sm">
                          <span className="font-medium">{producto.nombre}</span>
                          <span className="text-gray-600 ml-2">x{producto.cantidad}</span>
                          <span className="text-blue-600 ml-2">📍{producto.ubicacion}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Información de Peso y Herramienta Recomendada */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-600">Peso estimado: </span>
                          <span className="font-medium text-gray-900">
                            {pedido.productos.reduce((total, p) => total + (p.cantidad * 1), 0)} kg
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Herramienta recomendada: </span>
                          <span className="font-medium text-blue-600">
                            {(() => {
                              const pesoTotal = pedido.productos.reduce((total, p) => total + (p.cantidad * 1), 0);
                              if (pesoTotal <= 50) return '🦽 Diablito';
                              if (pesoTotal <= 200) return '🛒 Patín Hidráulico';
                              return '🚛 Montacargas';
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones según el Rol */}
                  <div className="flex flex-wrap gap-2">
                    {sesionActiva?.rol === 'operador_atlas' && pedido.estado === 'pendiente' && (
                      <button
                        onClick={() => procesarPedido(pedido, 'revisar')}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        🔍 Revisar en Atlas
                      </button>
                    )}
                    
                    {sesionActiva?.rol === 'surtidor' && pedido.estado === 'en_proceso' && (
                      <>
                        <button
                          onClick={() => procesarPedido(pedido, 'surtir')}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          ✅ Completar Surtido
                        </button>
                        {herramientas.map((herramienta) => (
                          <button
                            key={herramienta.id}
                            onClick={() => seleccionarHerramienta(pedido, herramienta)}
                            className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                          >
                            {herramienta.icono} {herramienta.nombre}
                          </button>
                        ))}
                      </>
                    )}
                    
                    {sesionActiva?.rol === 'embalador' && pedido.estado === 'surtido' && (
                      <button
                        onClick={() => procesarPedido(pedido, 'embarcar')}
                        className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        📦 Completar Embarque
                      </button>
                    )}
                    
                    {sesionActiva?.rol === 'transportista' && pedido.estado === 'embarcado' && (
                      <button
                        onClick={() => procesarPedido(pedido, 'enviar')}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        🚚 Confirmar Envío
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimuladorInteractivo;
