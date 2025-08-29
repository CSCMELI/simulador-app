import React, { useState } from 'react';
import { Pedido } from '../App';

interface SurtidoProps {
  pedidos: Pedido[];
  onPedidoActualizado: (pedidoId: string, nuevoEstado: Pedido['estado']) => void;
}

interface SurtidoEnProceso {
  id: string;
  pedidoId: string;
  cliente: string;
  productos: Array<{
    id: string;
    nombre: string;
    cantidad: number;
    ubicacion: string;
    estado: 'pendiente' | 'surtido';
  }>;
  herramienta: 'montacargas' | 'patin' | 'diablito' | null;
  estado: 'seleccionando_herramienta' | 'surtiendo' | 'completado';
  tiempoInicio: Date;
}

const Surtido: React.FC<SurtidoProps> = ({ pedidos, onPedidoActualizado }) => {
  const [surtidosEnProceso, setSurtidosEnProceso] = useState<SurtidoEnProceso[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  const herramientas = [
    { id: 'montacargas', nombre: '🚛 Montacargas', descripcion: 'Para cargas pesadas y voluminosas' },
    { id: 'patin', nombre: '🛒 Patín', descripcion: 'Para cargas medianas y movilidad' },
    { id: 'diablito', nombre: '🦽 Diablito', descripcion: 'Para cargas ligeras y precisión' }
  ];

  const iniciarSurtido = (pedido: Pedido) => {
    const surtido: SurtidoEnProceso = {
      id: `SUR-${Date.now()}`,
      pedidoId: pedido.id,
      cliente: pedido.cliente,
      productos: pedido.productos.map(p => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        ubicacion: p.ubicacion,
        estado: 'pendiente'
      })),
      herramienta: null,
      estado: 'seleccionando_herramienta',
      tiempoInicio: new Date()
    };

    setSurtidosEnProceso([...surtidosEnProceso, surtido]);
    setPedidoSeleccionado(pedido);
  };

  const seleccionarHerramienta = (surtidoId: string, herramienta: 'montacargas' | 'patin' | 'diablito') => {
    setSurtidosEnProceso(surtidosEnProceso.map(s => 
      s.id === surtidoId 
        ? { ...s, herramienta, estado: 'surtiendo' }
        : s
    ));
  };

  const surtirProducto = (surtidoId: string, productoId: string) => {
    setSurtidosEnProceso(surtidosEnProceso.map(s => 
      s.id === surtidoId 
        ? {
            ...s,
            productos: s.productos.map(p => 
              p.id === productoId ? { ...p, estado: 'surtido' } : p
            )
          }
        : s
    ));
  };

  const completarSurtido = (surtidoId: string) => {
    const surtido = surtidosEnProceso.find(s => s.id === surtidoId);
    if (surtido) {
      onPedidoActualizado(surtido.pedidoId, 'surtido');
      setSurtidosEnProceso(surtidosEnProceso.filter(s => s.id !== surtidoId));
    }
  };

  const calcularTiempo = (tiempoInicio: Date) => {
    const ahora = new Date();
    const diferencia = ahora.getTime() - tiempoInicio.getTime();
    const minutos = Math.floor(diferencia / 60000);
    const segundos = Math.floor((diferencia % 60000) / 1000);
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🚚 Estación de Surtido</h2>
        <p className="text-gray-600">Selecciona la herramienta adecuada y surte los pedidos en proceso</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{pedidos.length}</div>
          <div className="text-sm text-blue-600">Pedidos en Proceso</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {surtidosEnProceso.filter(s => s.estado === 'seleccionando_herramienta').length}
          </div>
          <div className="text-sm text-yellow-600">Esperando Herramienta</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {surtidosEnProceso.filter(s => s.estado === 'surtiendo').length}
          </div>
          <div className="text-sm text-blue-600">Surtiendo</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {surtidosEnProceso.filter(s => s.estado === 'completado').length}
          </div>
          <div className="text-sm text-green-600">Completados</div>
        </div>
      </div>

      {/* Pedidos Disponibles */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800">📋 Pedidos Disponibles para Surtir</h3>
        </div>
        <div className="p-6">
          {pedidos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay pedidos en proceso para surtir</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-blue-600">{pedido.id}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      En Proceso
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{pedido.cliente}</p>
                  <p className="text-sm text-gray-600">{pedido.productos.length} productos</p>
                  <p className="text-lg font-bold text-green-600">${pedido.total.toFixed(2)}</p>
                  <button
                    onClick={() => iniciarSurtido(pedido)}
                    disabled={surtidosEnProceso.some(s => s.pedidoId === pedido.id)}
                    className={`w-full mt-3 py-2 px-4 rounded-lg font-semibold transition-colors ${
                      surtidosEnProceso.some(s => s.pedidoId === pedido.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {surtidosEnProceso.some(s => s.pedidoId === pedido.id) ? '🔄 En Proceso' : '🚀 Iniciar Surtido'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Surtidos en Proceso */}
      {surtidosEnProceso.length > 0 && (
        <div className="space-y-6">
          {surtidosEnProceso.map((surtido) => (
            <div key={surtido.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-yellow-800">
                    Surtido {surtido.id} - {surtido.cliente}
                  </h3>
                  <div className="text-sm text-yellow-700">
                    ⏱️ Tiempo: {calcularTiempo(surtido.tiempoInicio)}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Selección de Herramienta */}
                {surtido.estado === 'seleccionando_herramienta' && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">🛠️ Selecciona la Herramienta Adecuada</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {herramientas.map((herramienta) => (
                        <div
                          key={herramienta.id}
                          className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                          onClick={() => seleccionarHerramienta(surtido.id, herramienta.id as any)}
                        >
                          <div className="text-2xl mb-2">{herramienta.nombre}</div>
                          <p className="text-sm text-gray-600">{herramienta.descripcion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Herramienta Seleccionada */}
                {surtido.herramienta && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-lg font-semibold text-green-800 mb-2">✅ Herramienta Seleccionada</h4>
                    <p className="text-green-700">
                      {herramientas.find(h => h.id === surtido.herramienta)?.nombre}
                    </p>
                  </div>
                )}

                {/* Lista de Productos */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📦 Productos a Surtir</h4>
                  <div className="space-y-3">
                    {surtido.productos.map((producto) => (
                      <div key={producto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{producto.nombre}</h5>
                          <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
                          <p className="text-sm text-blue-600 font-medium">Ubicación: {producto.ubicacion}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            producto.estado === 'pendiente' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {producto.estado === 'pendiente' ? '⏳ Pendiente' : '✅ Surtido'}
                          </span>
                          {producto.estado === 'pendiente' && surtido.estado === 'surtiendo' && (
                            <button
                              onClick={() => surtirProducto(surtido.id, producto.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              ✅ Surtir
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de Completar */}
                {surtido.estado === 'surtiendo' && 
                 surtido.productos.every(p => p.estado === 'surtido') && (
                  <button
                    onClick={() => completarSurtido(surtido.id)}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
                  >
                    🎉 Completar Surtido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Surtido;