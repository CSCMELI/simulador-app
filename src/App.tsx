import React, { useState } from 'react'
import Recibo from './scenes/Recibo'
import Surtido from './scenes/Surtido'
import Embarque from './scenes/Embarque'
import Transportista from './scenes/Transportista'
import PedidoOnline from './scenes/PedidoOnline'

export interface Pedido {
  id: string
  cliente: string
  productos: Producto[]
  estado: 'pendiente' | 'en_proceso' | 'surtido' | 'embarcado' | 'enviado'
  fecha: Date
  total: number
}

export interface Producto {
  id: string
  nombre: string
  cantidad: number
  precio: number
  ubicacion: string
  categoria: string
}

const App: React.FC = () => {
  const [escena, setEscena] = useState<'pedido' | 'recibo' | 'surtido' | 'embarque' | 'transportista'>('pedido')
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pedidoActual, setPedidoActual] = useState<Pedido | null>(null)

  const agregarPedido = (pedido: Pedido) => {
    setPedidos([...pedidos, pedido])
  }

  const actualizarPedido = (pedidoId: string, nuevoEstado: Pedido['estado']) => {
    setPedidos(pedidos.map(p => 
      p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">W</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Simulador Atlas</h1>
                <p className="text-gray-600">Sistema de Logística Walmart</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Pedidos Activos</p>
              <p className="text-2xl font-bold text-blue-600">{pedidos.filter(p => p.estado !== 'enviado').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <nav className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setEscena('pedido')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              escena === 'pedido'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:scale-102'
            }`}
          >
            🛒 Pedido Online
          </button>
          <button
            onClick={() => setEscena('recibo')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              escena === 'recibo'
                ? 'bg-green-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-green-50 hover:scale-102'
            }`}
          >
            📦 Recibo
          </button>
          <button
            onClick={() => setEscena('surtido')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              escena === 'surtido'
                ? 'bg-yellow-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-yellow-50 hover:scale-102'
            }`}
          >
            🚚 Surtido
          </button>
          <button
            onClick={() => setEscena('embarque')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              escena === 'embarque'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-purple-50 hover:scale-102'
            }`}
          >
            📋 Embarque
          </button>
          <button
            onClick={() => setEscena('transportista')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              escena === 'transportista'
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-red-50 hover:scale-102'
            }`}
          >
            🚛 Transportista
          </button>
        </nav>

        {/* Main Content */}
        <main className="bg-white rounded-xl shadow-xl overflow-hidden">
          {escena === 'pedido' && (
            <PedidoOnline 
              onPedidoCreado={agregarPedido}
              pedidos={pedidos}
            />
          )}
          {escena === 'recibo' && (
            <Recibo 
              pedidos={pedidos}
              onPedidoActualizado={actualizarPedido}
            />
          )}
          {escena === 'surtido' && (
            <Surtido 
              pedidos={pedidos.filter(p => p.estado === 'en_proceso')}
              onPedidoActualizado={actualizarPedido}
            />
          )}
          {escena === 'embarque' && (
            <Embarque 
              pedidos={pedidos.filter(p => p.estado === 'surtido')}
              onPedidoActualizado={actualizarPedido}
            />
          )}
          {escena === 'transportista' && (
            <Transportista 
              pedidos={pedidos.filter(p => p.estado === 'embarcado')}
              onPedidoActualizado={actualizarPedido}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App