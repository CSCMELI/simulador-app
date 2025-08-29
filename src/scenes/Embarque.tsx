import React, { useState } from 'react';
import { Pedido } from '../App';

interface EmbarqueProps {
  pedidos: Pedido[];
  onPedidoActualizado: (pedidoId: string, nuevoEstado: Pedido['estado']) => void;
}

interface EmbarqueEnProceso {
  id: string;
  pedidoId: string;
  cliente: string;
  productos: Array<{
    id: string;
    nombre: string;
    cantidad: number;
    estado: 'pendiente' | 'embalado' | 'verificado';
  }>;
  estado: 'preparando' | 'embalando' | 'verificando' | 'completado';
  tiempoInicio: Date;
  tipoEmbalaje: 'caja' | 'bolsa' | 'envoltorio' | null;
  pesoTotal: number;
  dimensiones: string;
}

const Embarque: React.FC<EmbarqueProps> = ({ pedidos, onPedidoActualizado }) => {
  const [embarquesEnProceso, setEmbarquesEnProceso] = useState<EmbarqueEnProceso[]>([]);
  const [mostrarFormularioEmbalaje, setMostrarFormularioEmbalaje] = useState<string | null>(null);

  const tiposEmbalaje = [
    { id: 'caja', nombre: '📦 Caja', descripcion: 'Para productos frágiles o voluminosos' },
    { id: 'bolsa', nombre: '🛍️ Bolsa', descripcion: 'Para productos ligeros y pequeños' },
    { id: 'envoltorio', nombre: '🎁 Envoltorio', descripcion: 'Para productos delicados' }
  ];

  const iniciarEmbarque = (pedido: Pedido) => {
    const embarque: EmbarqueEnProceso = {
      id: `EMB-${Date.now()}`,
      pedidoId: pedido.id,
      cliente: pedido.cliente,
      productos: pedido.productos.map(p => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        estado: 'pendiente'
      })),
      estado: 'preparando',
      tiempoInicio: new Date(),
      tipoEmbalaje: null,
      pesoTotal: 0,
      dimensiones: ''
    };

    setEmbarquesEnProceso([...embarquesEnProceso, embarque]);
  };

  const seleccionarEmbalaje = (embarqueId: string, tipo: 'caja' | 'bolsa' | 'envoltorio') => {
    setEmbarquesEnProceso(embarquesEnProceso.map(e => 
      e.id === embarqueId 
        ? { ...e, tipoEmbalaje: tipo, estado: 'embalando' }
        : e
    ));
  };

  const embalarProducto = (embarqueId: string, productoId: string) => {
    setEmbarquesEnProceso(embarquesEnProceso.map(e => 
      e.id === embarqueId 
        ? {
            ...e,
            productos: e.productos.map(p => 
              p.id === productoId ? { ...p, estado: 'embalado' } : p
            )
          }
        : e
    ));
  };

  const verificarProducto = (embarqueId: string, productoId: string) => {
    setEmbarquesEnProceso(embarquesEnProceso.map(e => 
      e.id === embarqueId 
        ? {
            ...e,
            productos: e.productos.map(p => 
              p.id === productoId ? { ...p, estado: 'verificado' } : p
            )
          }
        : e
    ));
  };

  const completarEmbarque = (embarqueId: string) => {
    const embarque = embarquesEnProceso.find(e => e.id === embarqueId);
    if (embarque) {
      onPedidoActualizado(embarque.pedidoId, 'embarcado');
      setEmbarquesEnProceso(embarquesEnProceso.filter(e => e.id !== embarqueId));
    }
  };

  const calcularTiempo = (tiempoInicio: Date) => {
    const ahora = new Date();
    const diferencia = ahora.getTime() - tiempoInicio.getTime();
    const minutos = Math.floor(diferencia / 60000);
    const segundos = Math.floor((diferencia % 60000) / 1000);
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  };

  const calcularPeso = (productos: any[]) => {
    // Simulación de peso basado en cantidad y tipo de producto
    return productos.reduce((total, p) => total + (p.cantidad * 0.5), 0);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📋 Estación de Embarque</h2>
        <p className="text-gray-600">Prepara, embala y verifica los pedidos surtidos para su envío</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{pedidos.length}</div>
          <div className="text-sm text-blue-600">Pedidos Surtidos</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {embarquesEnProceso.filter(e => e.estado === 'preparando').length}
          </div>
          <div className="text-sm text-yellow-600">Preparando</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {embarquesEnProceso.filter(e => e.estado === 'embalando').length}
          </div>
          <div className="text-sm text-blue-600">Embalando</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {embarquesEnProceso.filter(e => e.estado === 'verificando').length}
          </div>
          <div className="text-sm text-green-600">Verificando</div>
        </div>
      </div>

      {/* Pedidos Disponibles */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-green-50 border-b border-green-200">
          <h3 className="text-xl font-semibold text-green-800">📋 Pedidos Surtidos para Embarque</h3>
        </div>
        <div className="p-6">
          {pedidos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay pedidos surtidos para embarcar</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-blue-600">{pedido.id}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Surtido
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{pedido.cliente}</p>
                  <p className="text-sm text-gray-600">{pedido.productos.length} productos</p>
                  <p className="text-lg font-bold text-green-600">${pedido.total.toFixed(2)}</p>
                  <button
                    onClick={() => iniciarEmbarque(pedido)}
                    disabled={embarquesEnProceso.some(e => e.pedidoId === pedido.id)}
                    className={`w-full mt-3 py-2 px-4 rounded-lg font-semibold transition-colors ${
                      embarquesEnProceso.some(e => e.pedidoId === pedido.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {embarquesEnProceso.some(e => e.pedidoId === pedido.id) ? '🔄 En Proceso' : '📦 Iniciar Embarque'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Embarques en Proceso */}
      {embarquesEnProceso.length > 0 && (
        <div className="space-y-6">
          {embarquesEnProceso.map((embarque) => (
            <div key={embarque.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-purple-50 border-b border-purple-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-purple-800">
                    Embarque {embarque.id} - {embarque.cliente}
                  </h3>
                  <div className="text-sm text-purple-700">
                    ⏱️ Tiempo: {calcularTiempo(embarque.tiempoInicio)}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Selección de Tipo de Embalaje */}
                {embarque.estado === 'preparando' && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">📦 Selecciona el Tipo de Embalaje</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {tiposEmbalaje.map((tipo) => (
                        <div
                          key={tipo.id}
                          className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 cursor-pointer transition-colors"
                          onClick={() => seleccionarEmbalaje(embarque.id, tipo.id as any)}
                        >
                          <div className="text-2xl mb-2">{tipo.nombre}</div>
                          <p className="text-sm text-gray-600">{tipo.descripcion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tipo de Embalaje Seleccionado */}
                {embarque.tipoEmbalaje && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-lg font-semibold text-green-800 mb-2">✅ Tipo de Embalaje Seleccionado</h4>
                    <p className="text-green-700">
                      {tiposEmbalaje.find(t => t.id === embarque.tipoEmbalaje)?.nombre}
                    </p>
                  </div>
                )}

                {/* Lista de Productos */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📋 Productos a Embalar</h4>
                  <div className="space-y-3">
                    {embarque.productos.map((producto) => (
                      <div key={producto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{producto.nombre}</h5>
                          <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            producto.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            producto.estado === 'embalado' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {producto.estado === 'pendiente' ? '⏳ Pendiente' :
                             producto.estado === 'embalado' ? '📦 Embalado' :
                             '✅ Verificado'}
                          </span>
                          {producto.estado === 'pendiente' && embarque.estado === 'embalando' && (
                            <button
                              onClick={() => embalarProducto(embarque.id, producto.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              📦 Embalar
                            </button>
                          )}
                          {producto.estado === 'embalado' && (
                            <button
                              onClick={() => verificarProducto(embarque.id, producto.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              ✅ Verificar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información del Embalaje */}
                {embarque.tipoEmbalaje && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">📊 Información del Embalaje</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tipo:</p>
                        <p className="font-medium text-blue-900">
                          {tiposEmbalaje.find(t => t.id === embarque.tipoEmbalaje)?.nombre}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Peso Estimado:</p>
                        <p className="font-medium text-blue-900">
                          {calcularPeso(embarque.productos).toFixed(1)} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estado:</p>
                        <p className="font-medium text-blue-900 capitalize">
                          {embarque.estado}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón de Completar */}
                {embarque.productos.every(p => p.estado === 'verificado') && (
                  <button
                    onClick={() => completarEmbarque(embarque.id)}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
                  >
                    🎉 Completar Embarque
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

export default Embarque;