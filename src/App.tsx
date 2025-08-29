import React, { useState } from 'react'
import Recibo from './scenes/Recibo'
import Surtido from './scenes/Surtido'
import Embarque from './scenes/Embarque'
import Transportista from './scenes/Transportista'
import PedidoOnline from './scenes/PedidoOnline'
import SimuladorInteractivo from './scenes/SimuladorInteractivo'

export interface Pedido {
  id: string
  cliente: string
  productos: Producto[]
  estado: 'pendiente' | 'en_proceso' | 'surtido' | 'embarcado' | 'enviado'
  fecha: Date
  total: number
  operadorAtlas?: string
  surtidor?: string
  embalador?: string
  transportista?: string
}

export interface Producto {
  id: string
  nombre: string
  cantidad: number
  precio: number
  ubicacion: string
  categoria: string
}

export interface Usuario {
  id: string
  nombre: string
  rol: 'cliente' | 'operador_atlas' | 'surtidor' | 'embalador' | 'transportista'
  avatar: string
  estado: 'disponible' | 'ocupado' | 'descanso'
}

const App: React.FC = () => {
  const [escena, setEscena] = useState<'simulador' | 'pedido' | 'recibo' | 'surtido' | 'embarque' | 'transportista'>('simulador')
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', nombre: 'María González', rol: 'cliente', avatar: '👩‍💻', estado: 'disponible' },
    { id: '2', nombre: 'Carlos Ruiz', rol: 'operador_atlas', avatar: '👨‍💼', estado: 'disponible' },
    { id: '3', nombre: 'Ana Martínez', rol: 'surtidor', avatar: '👷‍♀️', estado: 'disponible' },
    { id: '4', nombre: 'Luis Torres', rol: 'embalador', avatar: '👨‍🏭', estado: 'disponible' },
    { id: '5', nombre: 'Roberto Silva', rol: 'transportista', avatar: '🚛', estado: 'disponible' }
  ])
  const [sesionActiva, setSesionActiva] = useState<Usuario | null>(null)

  const agregarPedido = (pedido: Pedido) => {
    setPedidos([...pedidos, pedido])
  }

  const actualizarPedido = (pedidoId: string, nuevoEstado: Pedido['estado']) => {
    setPedidos(pedidos.map(p => 
      p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
    ))
  }

  const asignarUsuario = (pedidoId: string, rol: keyof Pedido, usuarioId: string) => {
    setPedidos(pedidos.map(p => 
      p.id === pedidoId ? { ...p, [rol]: usuarioId } : p
    ))
  }

  const cambiarEstadoUsuario = (usuarioId: string, nuevoEstado: Usuario['estado']) => {
    setUsuarios(usuarios.map(u => 
      u.id === usuarioId ? { ...u, estado: nuevoEstado } : u
    ))
  }

  const iniciarSesion = (usuario: Usuario) => {
    setSesionActiva(usuario)
    cambiarEstadoUsuario(usuario.id, 'ocupado')
  }

  const cerrarSesion = () => {
    if (sesionActiva) {
      cambiarEstadoUsuario(sesionActiva.id, 'disponible')
      setSesionActiva(null)
    }
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
                <h1 className="text-3xl font-bold text-gray-900">🎮 Simulador Atlas Interactivo</h1>
                <p className="text-gray-600">Sistema de Logística Walmart - Juego de Roles</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {sesionActiva ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Sesión Activa</p>
                    <p className="font-medium text-blue-600">{sesionActiva.avatar} {sesionActiva.nombre}</p>
                    <p className="text-xs text-gray-500 capitalize">{sesionActiva.rol.replace('_', ' ')}</p>
                  </div>
                  <button
                    onClick={cerrarSesion}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Sin sesión activa</p>
                  <p className="text-xs text-gray-400">Selecciona un rol para comenzar</p>
                </div>
              )}
              <div className="text-right">
                <p className="text-sm text-gray-500">Pedidos Activos</p>
                <p className="text-2xl font-bold text-blue-600">{pedidos.filter(p => p.estado !== 'enviado').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <nav className="flex justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setEscena('simulador')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              escena === 'simulador'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-purple-50 hover:scale-102'
            }`}
          >
            🎮 Simulador Interactivo
          </button>
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
          {escena === 'simulador' && (
            <SimuladorInteractivo 
              usuarios={usuarios}
              pedidos={pedidos}
              sesionActiva={sesionActiva}
              onIniciarSesion={iniciarSesion}
              onPedidoCreado={agregarPedido}
              onPedidoActualizado={actualizarPedido}
              onAsignarUsuario={asignarUsuario}
            />
          )}
          {escena === 'pedido' && (
            <PedidoOnline 
              onPedidoCreado={agregarPedido}
              pedidos={pedidos}
              sesionActiva={sesionActiva}
            />
          )}
          {escena === 'recibo' && (
            <Recibo 
              pedidos={pedidos}
              onPedidoActualizado={actualizarPedido}
              sesionActiva={sesionActiva}
            />
          )}
          {escena === 'surtido' && (
            <Surtido 
              pedidos={pedidos.filter(p => p.estado === 'en_proceso')}
              onPedidoActualizado={actualizarPedido}
              sesionActiva={sesionActiva}
            />
          )}
          {escena === 'embarque' && (
            <Embarque 
              pedidos={pedidos.filter(p => p.estado === 'surtido')}
              onPedidoActualizado={actualizarPedido}
              sesionActiva={sesionActiva}
            />
          )}
          {escena === 'transportista' && (
            <Transportista 
              pedidos={pedidos.filter(p => p.estado === 'embarcado')}
              onPedidoActualizado={actualizarPedido}
              sesionActiva={sesionActiva}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App