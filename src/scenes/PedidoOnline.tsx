import React, { useState } from 'react';
import type { Pedido, Producto, Usuario } from '../App';

interface PedidoOnlineProps {
  onPedidoCreado: (pedido: Pedido) => void;
  pedidos: Pedido[];
  sesionActiva: Usuario | null;
}

const productosDisponibles: Producto[] = [
  { id: '1', nombre: 'Leche Entera 1L', cantidad: 1, precio: 25.90, ubicacion: 'A-01-01', categoria: 'Lácteos' },
  { id: '2', nombre: 'Pan Integral', cantidad: 1, precio: 18.50, ubicacion: 'A-02-03', categoria: 'Panadería' },
  { id: '3', nombre: 'Manzanas Rojas 1kg', cantidad: 1, precio: 32.80, ubicacion: 'B-01-05', categoria: 'Frutas' },
  { id: '4', nombre: 'Pollo Entero 2kg', cantidad: 1, precio: 89.90, ubicacion: 'C-03-02', categoria: 'Cárnicos' },
  { id: '5', nombre: 'Arroz Blanco 1kg', cantidad: 1, precio: 15.50, ubicacion: 'D-01-01', categoria: 'Granos' },
  { id: '6', nombre: 'Aceite de Oliva 500ml', cantidad: 1, precio: 45.90, ubicacion: 'E-02-04', categoria: 'Aceites' },
  { id: '7', nombre: 'Yogurt Natural 1kg', cantidad: 1, precio: 28.90, ubicacion: 'A-01-02', categoria: 'Lácteos' },
  { id: '8', nombre: 'Plátanos 1kg', cantidad: 1, precio: 22.50, ubicacion: 'B-01-06', categoria: 'Frutas' },
];

const PedidoOnline: React.FC<PedidoOnlineProps> = ({ onPedidoCreado, pedidos, sesionActiva }) => {
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [cliente, setCliente] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const agregarAlCarrito = (producto: Producto) => {
    const productoExistente = carrito.find(p => p.id === producto.id);
    if (productoExistente) {
      setCarrito(carrito.map(p => 
        p.id === producto.id 
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (productoId: string) => {
    setCarrito(carrito.filter(p => p.id !== productoId));
  };

  const actualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(productoId);
    } else {
      setCarrito(carrito.map(p => 
        p.id === productoId ? { ...p, cantidad: nuevaCantidad } : p
      ));
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };

  const crearPedido = () => {
    if (!cliente.trim() || carrito.length === 0) return;

    const nuevoPedido: Pedido = {
      id: `PED-${Date.now()}`,
      cliente: cliente,
      productos: carrito.map(p => ({ ...p, precio: p.precio * p.cantidad })),
      estado: 'pendiente',
      fecha: new Date(),
      total: calcularTotal()
    };

    onPedidoCreado(nuevoPedido);
    setCarrito([]);
    setCliente('');
    setMostrarConfirmacion(true);
    
    setTimeout(() => setMostrarConfirmacion(false), 3000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🛒 Simulador de Pedidos Online</h2>
        <p className="text-gray-600">Simula el proceso de compra en línea de Walmart usando el sistema Atlas</p>
      </div>

      {/* Información de Sesión */}
      {sesionActiva && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{sesionActiva.avatar}</div>
            <div>
              <p className="font-medium text-blue-900">Sesión Activa: {sesionActiva.nombre}</p>
              <p className="text-sm text-blue-700 capitalize">Rol: {sesionActiva.rol.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Catálogo de Productos */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Catálogo de Productos</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {productosDisponibles.map((producto) => (
              <div key={producto.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{producto.nombre}</h4>
                    <p className="text-sm text-gray-600">{producto.categoria}</p>
                    <p className="text-sm text-blue-600 font-medium">Ubicación: {producto.ubicacion}</p>
                    <p className="text-lg font-bold text-green-600">${producto.precio.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => agregarAlCarrito(producto)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito y Formulario */}
        <div className="space-y-6">
          {/* Formulario del Cliente */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">👤 Información del Cliente</h3>
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Carrito */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🛍️ Carrito de Compras</h3>
            {carrito.length === 0 ? (
              <p className="text-gray-500 text-center py-8">El carrito está vacío</p>
            ) : (
              <div className="space-y-3">
                {carrito.map((producto) => (
                  <div key={producto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{producto.nombre}</h4>
                      <p className="text-sm text-gray-600">${producto.precio.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                        className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{producto.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}
                        className="w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">${calcularTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón de Confirmar Pedido */}
          <button
            onClick={crearPedido}
            disabled={!cliente.trim() || carrito.length === 0}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
              !cliente.trim() || carrito.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-lg'
            }`}
          >
            🚀 Confirmar Pedido
          </button>
        </div>
      </div>

      {/* Pedidos Recientes */}
      <div className="mt-12 bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Pedidos Recientes</h3>
        {pedidos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay pedidos aún</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedidos.slice(-6).reverse().map((pedido) => (
              <div key={pedido.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-600">{pedido.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    pedido.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                    pedido.estado === 'surtido' ? 'bg-green-100 text-green-800' :
                    pedido.estado === 'embarcado' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pedido.estado.replace('_', ' ')}
                  </span>
                </div>
                <p className="font-medium text-gray-900">{pedido.cliente}</p>
                <p className="text-sm text-gray-600">{pedido.productos.length} productos</p>
                <p className="text-lg font-bold text-green-600">${pedido.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{pedido.fecha.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          ✅ Pedido creado exitosamente
        </div>
      )}
    </div>
  );
};

export default PedidoOnline;
