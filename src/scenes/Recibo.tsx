import React, { useState } from 'react';
import type { Pedido } from '../App';

interface ReciboProps {
  pedidos: Pedido[];
  onPedidoActualizado: (pedidoId: string, nuevoEstado: Pedido['estado']) => void;
}

interface MercanciaRecibida {
  id: string;
  producto: string;
  cantidad: number;
  proveedor: string;
  fechaRecepcion: Date;
  estado: 'pendiente' | 'verificado' | 'almacenado';
  ubicacion: string;
}

const Recibo: React.FC<ReciboProps> = ({ pedidos, onPedidoActualizado }) => {
  const [mercanciaRecibida, setMercanciaRecibida] = useState<MercanciaRecibida[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaMercancia, setNuevaMercancia] = useState({
    producto: '',
    cantidad: 1,
    proveedor: '',
    ubicacion: ''
  });

  const proveedores = ['Proveedor A', 'Proveedor B', 'Proveedor C', 'Proveedor D'];
  const ubicaciones = ['A-01-01', 'A-01-02', 'A-02-01', 'A-02-02', 'B-01-01', 'B-01-02', 'C-01-01', 'C-01-02'];

  const recibirMercancia = () => {
    if (!nuevaMercancia.producto || !nuevaMercancia.proveedor || !nuevaMercancia.ubicacion) return;

    const mercancia: MercanciaRecibida = {
      id: `MER-${Date.now()}`,
      producto: nuevaMercancia.producto,
      cantidad: nuevaMercancia.cantidad,
      proveedor: nuevaMercancia.proveedor,
      fechaRecepcion: new Date(),
      estado: 'pendiente',
      ubicacion: nuevaMercancia.ubicacion
    };

    setMercanciaRecibida([...mercanciaRecibida, mercancia]);
    setNuevaMercancia({ producto: '', cantidad: 1, proveedor: '', ubicacion: '' });
    setMostrarFormulario(false);
  };

  const verificarMercancia = (id: string) => {
    setMercanciaRecibida(mercanciaRecibida.map(m => 
      m.id === id ? { ...m, estado: 'verificado' } : m
    ));
  };

  const almacenarMercancia = (id: string) => {
    setMercanciaRecibida(mercanciaRecibida.map(m => 
      m.id === id ? { ...m, estado: 'almacenado' } : m
    ));
  };

  const procesarPedidosPendientes = () => {
    const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente');
    pedidosPendientes.forEach(pedido => {
      onPedidoActualizado(pedido.id, 'en_proceso');
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📦 Estación de Recibo</h2>
        <p className="text-gray-600">Recibe mercancía del proveedor y acomoda en ubicaciones del almacén</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{mercanciaRecibida.length}</div>
          <div className="text-sm text-blue-600">Total Recibido</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {mercanciaRecibida.filter(m => m.estado === 'pendiente').length}
          </div>
          <div className="text-sm text-yellow-600">Pendiente</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {mercanciaRecibida.filter(m => m.estado === 'verificado').length}
          </div>
          <div className="text-sm text-blue-600">Verificado</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {mercanciaRecibida.filter(m => m.estado === 'almacenado').length}
          </div>
          <div className="text-sm text-green-600">Almacenado</div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          {mostrarFormulario ? '❌ Cancelar' : '➕ Recibir Mercancía'}
        </button>
        <button
          onClick={procesarPedidosPendientes}
          disabled={pedidos.filter(p => p.estado === 'pendiente').length === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            pedidos.filter(p => p.estado === 'pendiente').length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          🚀 Procesar Pedidos Pendientes
        </button>
      </div>

      {/* Formulario de Recepción */}
      {mostrarFormulario && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📝 Recibir Nueva Mercancía</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nombre del producto"
              value={nuevaMercancia.producto}
              onChange={(e) => setNuevaMercancia({...nuevaMercancia, producto: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={nuevaMercancia.cantidad}
              onChange={(e) => setNuevaMercancia({...nuevaMercancia, cantidad: parseInt(e.target.value) || 1})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={nuevaMercancia.proveedor}
              onChange={(e) => setNuevaMercancia({...nuevaMercancia, proveedor: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar proveedor</option>
              {proveedores.map(proveedor => (
                <option key={proveedor} value={proveedor}>{proveedor}</option>
              ))}
            </select>
            <select
              value={nuevaMercancia.ubicacion}
              onChange={(e) => setNuevaMercancia({...nuevaMercancia, ubicacion: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar ubicación</option>
              {ubicaciones.map(ubicacion => (
                <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <button
              onClick={recibirMercancia}
              disabled={!nuevaMercancia.producto || !nuevaMercancia.proveedor || !nuevaMercancia.ubicacion}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                !nuevaMercancia.producto || !nuevaMercancia.proveedor || !nuevaMercancia.ubicacion
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              ✅ Confirmar Recepción
            </button>
          </div>
        </div>
      )}

      {/* Lista de Mercancía Recibida */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">📋 Mercancía Recibida</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mercanciaRecibida.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay mercancía recibida aún
                  </td>
                </tr>
              ) : (
                mercanciaRecibida.map((mercancia) => (
                  <tr key={mercancia.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{mercancia.producto}</div>
                      <div className="text-sm text-gray-500">{mercancia.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mercancia.cantidad}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mercancia.proveedor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{mercancia.ubicacion}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mercancia.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        mercancia.estado === 'verificado' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {mercancia.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {mercancia.estado === 'pendiente' && (
                        <button
                          onClick={() => verificarMercancia(mercancia.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          ✅ Verificar
                        </button>
                      )}
                      {mercancia.estado === 'verificado' && (
                        <button
                          onClick={() => almacenarMercancia(mercancia.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          📦 Almacenar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pedidos Pendientes */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
          <h3 className="text-xl font-semibold text-yellow-800">⚠️ Pedidos Pendientes de Procesamiento</h3>
        </div>
        <div className="p-6">
          {pedidos.filter(p => p.estado === 'pendiente').length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay pedidos pendientes</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pedidos.filter(p => p.estado === 'pendiente').map((pedido) => (
                <div key={pedido.id} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-blue-600">{pedido.id}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{pedido.cliente}</p>
                  <p className="text-sm text-gray-600">{pedido.productos.length} productos</p>
                  <p className="text-lg font-bold text-green-600">${pedido.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recibo;