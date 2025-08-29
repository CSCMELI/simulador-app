import React, { useState } from 'react';
import type { Pedido } from '../App';

interface TransportistaProps {
  pedidos: Pedido[];
  onPedidoActualizado: (pedidoId: string, nuevoEstado: Pedido['estado']) => void;
}

interface EntregaEnProceso {
  id: string;
  pedidoId: string;
  cliente: string;
  direccion: string;
  estado: 'asignado' | 'en_ruta' | 'entregando' | 'entregado';
  tiempoInicio: Date;
  tiempoEstimado: number; // en minutos
  transportista: string;
  vehiculo: string;
  coordenadas: { lat: number; lng: number };
  notas: string;
}

const Transportista: React.FC<TransportistaProps> = ({ pedidos, onPedidoActualizado }) => {
  const [entregasEnProceso, setEntregasEnProceso] = useState<EntregaEnProceso[]>([]);

  const transportistas = [
    { id: 'T1', nombre: 'Carlos Mendoza', vehiculo: '🚚 Camión Grande', capacidad: 'Cargas pesadas' },
    { id: 'T2', nombre: 'Ana García', vehiculo: '🚐 Van', capacidad: 'Cargas medianas' },
    { id: 'T3', nombre: 'Luis Rodríguez', vehiculo: '🛵 Moto', capacidad: 'Cargas ligeras' }
  ];

  const direcciones = [
    'Av. Principal 123, Centro',
    'Calle Secundaria 456, Norte',
    'Boulevard Este 789, Este',
    'Calle Oeste 321, Oeste',
    'Av. Sur 654, Sur'
  ];

  const iniciarEntrega = (pedido: Pedido) => {
    const transportista = transportistas[Math.floor(Math.random() * transportistas.length)];
    const direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
    
    const entrega: EntregaEnProceso = {
      id: `ENT-${Date.now()}`,
      pedidoId: pedido.id,
      cliente: pedido.cliente,
      direccion: direccion,
      estado: 'asignado',
      tiempoInicio: new Date(),
      tiempoEstimado: Math.floor(Math.random() * 30) + 15, // 15-45 minutos
      transportista: transportista.nombre,
      vehiculo: transportista.vehiculo,
      coordenadas: {
        lat: 19.4326 + (Math.random() - 0.5) * 0.1, // Simulación de coordenadas
        lng: -99.1332 + (Math.random() - 0.5) * 0.1
      },
      notas: ''
    };

    setEntregasEnProceso([...entregasEnProceso, entrega]);
  };

  const cambiarEstadoEntrega = (entregaId: string, nuevoEstado: EntregaEnProceso['estado']) => {
    setEntregasEnProceso(entregasEnProceso.map(e => 
      e.id === entregaId ? { ...e, estado: nuevoEstado } : e
    ));
  };

  const completarEntrega = (entregaId: string) => {
    const entrega = entregasEnProceso.find(e => e.id === entregaId);
    if (entrega) {
      onPedidoActualizado(entrega.pedidoId, 'enviado');
      setEntregasEnProceso(entregasEnProceso.filter(e => e.id !== entregaId));
    }
  };

  const agregarNota = (entregaId: string, nota: string) => {
    setEntregasEnProceso(entregasEnProceso.map(e => 
      e.id === entregaId ? { ...e, notas: nota } : e
    ));
  };

  const calcularTiempo = (tiempoInicio: Date) => {
    const ahora = new Date();
    const diferencia = ahora.getTime() - tiempoInicio.getTime();
    const minutos = Math.floor(diferencia / 60000);
    const segundos = Math.floor((diferencia % 60000) / 1000);
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  };

  const calcularProgreso = (entrega: EntregaEnProceso) => {
    const ahora = new Date();
    const tiempoTranscurrido = (ahora.getTime() - entrega.tiempoInicio.getTime()) / 60000;
    return Math.min((tiempoTranscurrido / entrega.tiempoEstimado) * 100, 100);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🚛 Estación de Transportista</h2>
        <p className="text-gray-600">Gestiona las entregas y el seguimiento de pedidos embarcados</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{pedidos.length}</div>
          <div className="text-sm text-blue-600">Pedidos Embarcados</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {entregasEnProceso.filter(e => e.estado === 'asignado').length}
          </div>
          <div className="text-sm text-yellow-600">Asignados</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {entregasEnProceso.filter(e => e.estado === 'en_ruta').length}
          </div>
          <div className="text-sm text-blue-600">En Ruta</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {entregasEnProceso.filter(e => e.estado === 'entregado').length}
          </div>
          <div className="text-sm text-green-600">Entregados</div>
        </div>
      </div>

      {/* Pedidos Disponibles */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-purple-50 border-b border-purple-200">
          <h3 className="text-xl font-semibold text-purple-800">📋 Pedidos Embarcados para Entrega</h3>
        </div>
        <div className="p-6">
          {pedidos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay pedidos embarcados para entregar</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-blue-600">{pedido.id}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Embarcado
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{pedido.cliente}</p>
                  <p className="text-sm text-gray-600">{pedido.productos.length} productos</p>
                  <p className="text-lg font-bold text-green-600">${pedido.total.toFixed(2)}</p>
                  <button
                    onClick={() => iniciarEntrega(pedido)}
                    disabled={entregasEnProceso.some(e => e.pedidoId === pedido.id)}
                    className={`w-full mt-3 py-2 px-4 rounded-lg font-semibold transition-colors ${
                      entregasEnProceso.some(e => e.pedidoId === pedido.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {entregasEnProceso.some(e => e.pedidoId === pedido.id) ? '🔄 En Entrega' : '🚚 Iniciar Entrega'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Entregas en Proceso */}
      {entregasEnProceso.length > 0 && (
        <div className="space-y-6">
          {entregasEnProceso.map((entrega) => (
            <div key={entrega.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-red-800">
                    Entrega {entrega.id} - {entrega.cliente}
                  </h3>
                  <div className="text-sm text-red-700">
                    ⏱️ Tiempo: {calcularTiempo(entrega.tiempoInicio)}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Información de la Entrega */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Transportista:</p>
                      <p className="font-medium text-gray-900">{entrega.transportista}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vehículo:</p>
                      <p className="font-medium text-gray-900">{entrega.vehiculo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dirección:</p>
                      <p className="font-medium text-gray-900">{entrega.direccion}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Estado:</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entrega.estado === 'asignado' ? 'bg-yellow-100 text-yellow-800' :
                        entrega.estado === 'en_ruta' ? 'bg-blue-100 text-blue-800' :
                        entrega.estado === 'entregando' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {entrega.estado.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tiempo Estimado:</p>
                      <p className="font-medium text-gray-900">{entrega.tiempoEstimado} minutos</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Progreso:</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calcularProgreso(entrega)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra de Progreso de Estados */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Progreso de la Entrega</h4>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center ${entrega.estado !== 'asignado' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                        {entrega.estado !== 'asignado' ? '✅' : '1'}
                      </div>
                      <span className="ml-2 text-sm">Asignado</span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${entrega.estado !== 'asignado' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center ${entrega.estado === 'en_ruta' || entrega.estado === 'entregando' || entrega.estado === 'entregado' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                        {entrega.estado === 'en_ruta' || entrega.estado === 'entregando' || entrega.estado === 'entregado' ? '✅' : '2'}
                      </div>
                      <span className="ml-2 text-sm">En Ruta</span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${entrega.estado === 'entregando' || entrega.estado === 'entregado' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center ${entrega.estado === 'entregado' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                        {entrega.estado === 'entregado' ? '✅' : '3'}
                      </div>
                      <span className="ml-2 text-sm">Entregado</span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">🎯 Acciones Disponibles</h4>
                  <div className="flex flex-wrap gap-3">
                    {entrega.estado === 'asignado' && (
                      <button
                        onClick={() => cambiarEstadoEntrega(entrega.id, 'en_ruta')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🚗 Iniciar Ruta
                      </button>
                    )}
                    {entrega.estado === 'en_ruta' && (
                      <button
                        onClick={() => cambiarEstadoEntrega(entrega.id, 'entregando')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        📦 Llegando al Destino
                      </button>
                    )}
                    {entrega.estado === 'entregando' && (
                      <button
                        onClick={() => cambiarEstadoEntrega(entrega.id, 'entregado')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✅ Confirmar Entrega
                      </button>
                    )}
                    {entrega.estado === 'entregado' && (
                      <button
                        onClick={() => completarEntrega(entrega.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        🎉 Finalizar Entrega
                      </button>
                    )}
                  </div>
                </div>

                {/* Notas */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📝 Notas de Entrega</h4>
                  <textarea
                    placeholder="Agregar notas sobre la entrega..."
                    value={entrega.notas}
                    onChange={(e) => agregarNota(entrega.id, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Mapa Simulado */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">🗺️ Ubicación de Entrega</h4>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="text-4xl mb-2">📍</div>
                    <p className="text-gray-600">Coordenadas: {entrega.coordenadas.lat.toFixed(4)}, {entrega.coordenadas.lng.toFixed(4)}</p>
                    <p className="text-sm text-gray-500">Mapa simulado del sistema Atlas</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transportista;