# 🏭 Sistema Atlas - Plataforma de Capacitación Logística

Una aplicación web interactiva diseñada para capacitar al personal en el procesamiento de pedidos en línea, desde la recepción hasta la entrega final.

## 🎯 Características Principales

### 🏠 Página de Bienvenida
- Landing page profesional con información del sistema
- Explicación del flujo de trabajo
- Acceso directo al sistema

### 🏭 Estaciones del Sistema

#### 📦 Estación de Recibo
- Recepción de mercancía del proveedor
- Acomodo en ubicaciones del almacén
- Verificación y almacenamiento

#### 🚚 Estación de Surtido
- Selección inteligente de herramientas:
  - 🦽 **Diablito de Carga**: Para productos ligeros (hasta 50 kg)
  - 🛒 **Patín Hidráulico**: Para cargas medianas (hasta 200 kg)
  - 🚛 **Montacargas**: Para cargas pesadas (hasta 1000 kg)
- Surtido de pedidos según ubicaciones
- Recomendaciones automáticas de herramientas

#### 📋 Estación de Embarque
- Preparación y embalaje de pedidos
- Verificación de productos
- Selección de tipo de embalaje

#### 🚛 Línea de Transportista
- Gestión de entregas
- Seguimiento en tiempo real
- Coordinación con transportistas

### 👥 Roles del Sistema
- **Cliente**: Crea pedidos en línea
- **Operador Atlas**: Revisa y asigna pedidos
- **Surtidor**: Procesa pedidos con herramientas
- **Embalador**: Prepara pedidos para envío
- **Transportista**: Gestiona entregas

## 🚀 Tecnologías Utilizadas

- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **ESLint** para calidad de código

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🎮 Cómo Usar el Sistema

1. **Acceso**: Inicia en la página de bienvenida del Sistema Atlas
2. **Selección de Rol**: Elige tu rol (Cliente, Operador Atlas, Surtidor, etc.)
3. **Flujo de Trabajo**: Sigue el flujo: Recibo → Surtido → Embarque → Transportista
4. **Herramientas**: Selecciona la herramienta adecuada según el peso de la carga
5. **Seguimiento**: Monitorea el progreso de los pedidos en tiempo real

## 🛠️ Funcionalidades Clave

### Sistema de Recomendaciones
- Cálculo automático del peso de pedidos
- Recomendación de herramientas según el peso
- Validación de selección de herramientas

### Interfaz Intuitiva
- Diseño moderno y profesional
- Navegación clara entre estaciones
- Indicadores visuales de progreso

### Capacitación Interactiva
- Simulación realista del flujo de trabajo
- Feedback inmediato en las acciones
- Guías y consejos integrados

## 📊 Flujo de Trabajo

```
Cliente crea pedido → Operador Atlas revisa → Surtidor procesa → Embalador prepara → Transportista entrega
```

## 🎯 Objetivos de Capacitación

- Familiarizar al personal con el sistema Atlas
- Enseñar la selección correcta de herramientas
- Optimizar el flujo de trabajo logístico
- Mejorar la eficiencia operativa

## 📝 Notas de Desarrollo

Este sistema está diseñado específicamente para capacitar al personal en el uso del sistema Atlas, proporcionando una experiencia de aprendizaje interactiva y realista.

---

**Desarrollado para optimizar el flujo de trabajo logístico y capacitar al personal de manera efectiva.**