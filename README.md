# Resumind - Curriculum AI Analyzer

[![CI/CD](https://github.com/Lostovayne/Curriculum-Ai-Analyzer/actions/workflows/deploy.yml/badge.svg)](https://github.com/Lostovayne/Curriculum-Ai-Analyzer/actions/workflows/deploy.yml)

Un analizador inteligente de currículums vitae que utiliza inteligencia artificial para proporcionar feedback detallado y puntuaciones sobre tus aplicaciones de trabajo. Obtén comentarios profesionales para mejorar tus oportunidades laborales.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [API de Puter](#-api-de-puter)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

## 🚀 Características

### Análisis Inteligente de CV

- **Análisis ATS (Applicant Tracking System)**: Evalúa la compatibilidad con sistemas de seguimiento de candidatos
- **Evaluación de Contenido**: Analiza la calidad y relevancia del contenido del CV
- **Análisis de Estructura**: Revisa la organización y formato del documento
- **Evaluación de Tono y Estilo**: Examina la profesionalidad y coherencia del lenguaje
- **Análisis de Habilidades**: Evalúa la presentación y relevancia de las competencias

### Funcionalidades Principales

- 🎯 **Puntuación Global**: Sistema de calificación de 0-100 para cada CV
- 📊 **Feedback Detallado**: Consejos específicos para mejoras categorizadas
- 🔐 **Autenticación Segura**: Integración con Puter.js para manejo de usuarios
- 📱 **Diseño Responsivo**: Interfaz optimizada para dispositivos móviles y desktop
- ⚡ **Tiempo Real**: Análisis inmediato con resultados instantáneos
- 🎨 **Interfaz Moderna**: Diseño elegante con animaciones fluidas

## 🛠️ Tecnologías

### Frontend

- **React 19.1.0** - Biblioteca de interfaz de usuario
- **React Router 7.7.0** - Enrutamiento y navegación
- **TypeScript 5.8.3** - Tipado estático
- **TailwindCSS 4.1.4** - Framework de CSS utility-first
- **Zustand 5.0.6** - Gestión de estado global

### Backend & Servicios

- **Puter.js** - Plataforma de servicios cloud (autenticación, almacenamiento, IA)
- **PDF.js 5.3.93** - Procesamiento de documentos PDF
- **Vite 6.3.3** - Herramienta de build y desarrollo

### Herramientas de Desarrollo

- **pnpm** - Gestor de paquetes eficiente
- **Docker** - Containerización para despliegue
- **ESLint & Prettier** - Linting y formateo de código

## 🏗 Arquitectura del Proyecto

El proyecto sigue una arquitectura modular basada en React Router con las siguientes capas:

```
├── Presentación (Components + Routes)
├── Lógica de Negocio (Stores + Hooks)
├── Servicios Externos (Puter API)
└── Tipos y Constantes (TypeScript Definitions)
```

### Flujo de Datos

1. **Autenticación**: El usuario se autentica mediante Puter.js
2. **Carga de CV**: Los archivos PDF se suben al sistema de archivos de Puter
3. **Análisis**: La IA de Puter analiza el CV y genera feedback estructurado
4. **Presentación**: Los resultados se muestran en la interfaz con visualizaciones

## 📦 Instalación

### Prerrequisitos

- Node.js 20.x o superior
- pnpm (recomendado) o npm
- Git

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/Lostovayne/Curriculum-Ai-Analyzer.git
cd curriculum-ai-analyzer
```

2. **Instalar dependencias**

```bash
pnpm install
# o si prefieres npm
npm install
```

3. **Ejecutar en desarrollo**

```bash
pnpm dev
# o con npm
npm run dev
```

4. **Acceder a la aplicación**

- Abre tu navegador en `http://localhost:5173`

## ⚙️ Configuración

### Variables de Entorno

El proyecto utiliza Puter.js como backend, por lo que no requiere variables de entorno adicionales. La configuración se maneja automáticamente a través de:

```typescript
// app/lib/puter.ts
declare global {
  interface Window {
    puter: {
      auth: {
        /* métodos de autenticación */
      };
      fs: {
        /* sistema de archivos */
      };
      ai: {
        /* servicios de IA */
      };
      kv: {
        /* almacén clave-valor */
      };
    };
  }
}
```

### Configuración de Desarrollo

El archivo `vite.config.ts` incluye:

- Soporte para TypeScript paths
- Optimizaciones de build
- Configuración de proxy si es necesario

## 🎯 Uso

### 1. Autenticación

```typescript
// El usuario debe autenticarse primero
const { auth } = usePuterStore();
await auth.signIn();
```

### 2. Subida de CV

```typescript
// Subir archivo PDF a Puter
const { fs } = usePuterStore();
const file = await fs.upload([pdfFile]);
```

### 3. Análisis de CV

```typescript
// Generar feedback usando IA
const { ai } = usePuterStore();
const feedback = await ai.feedback(filePath, prompt);
```

### 4. Visualización de Resultados

Los resultados se muestran en tarjetas con:

- Puntuación global circular
- Desglose por categorías
- Consejos específicos para mejoras

## 🤖 API de Puter

### Servicios Utilizados

#### Autenticación

```typescript
interface AuthService {
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  getUser(): Promise<PuterUser>;
  isSignedIn(): Promise<boolean>;
}
```

#### Sistema de Archivos

```typescript
interface FileSystemService {
  upload(files: File[]): Promise<FSItem>;
  read(path: string): Promise<Blob>;
  write(path: string, data: string | File | Blob): Promise<File>;
  delete(path: string): Promise<void>;
}
```

#### Inteligencia Artificial

```typescript
interface AIService {
  chat(prompt: string | ChatMessage[], options?: PuterChatOptions): Promise<AIResponse>;
  img2txt(image: string | File | Blob): Promise<string>;
}
```

#### Almacén Clave-Valor

```typescript
interface KVService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  list(pattern: string): Promise<string[]>;
}
```

## 📁 Estructura del Proyecto

```
curriculum-ai-analyzer/
├── 📄 README.md
├── 📄 package.json
├── 📄 Dockerfile
├── 📄 vite.config.ts
├── 📄 tsconfig.json
├── 📄 react-router.config.ts
├── 📁 app/
│   ├── 📄 root.tsx              # Configuración raíz de la app
│   ├── 📄 routes.ts             # Definición de rutas
│   ├── 📄 app.css               # Estilos globales
│   ├── 📁 components/
│   │   ├── 📄 Navbar.tsx        # Barra de navegación
│   │   ├── 📄 ResumeCard.tsx    # Tarjeta de CV
│   │   └── 📄 ScoreCircle.tsx   # Círculo de puntuación
│   ├── 📁 lib/
│   │   └── 📄 puter.ts          # Store y configuración de Puter
│   ├── 📁 routes/
│   │   ├── 📄 home.tsx          # Página principal
│   │   └── 📄 auth.tsx          # Página de autenticación
│   └── 📁 types/
│       └── 📄 index.d.ts        # Definiciones de tipos
├── 📁 constants/
│   └── 📄 index.ts              # Constantes y datos de ejemplo
└── 📁 public/
    ├── 📄 favicon.ico
    ├── 📄 pdf.worker.min.mjs
    ├── 📁 icons/               # Iconos SVG
    └── 📁 images/              # Imágenes y assets
```

### Componentes Principales

#### ResumeCard

```tsx
interface ResumeCardProps {
  resume: Resume;
}
// Muestra información del CV con puntuación y enlace de navegación
```

#### ScoreCircle

```tsx
interface ScoreCircleProps {
  score: number; // 0-100
}
// Visualización circular de la puntuación
```

#### Navbar

```tsx
// Barra de navegación con autenticación
```

### Tipos de Datos

#### Resume

```typescript
interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  feedback: Feedback;
}
```

#### Feedback

```typescript
interface Feedback {
  overallScore: number;
  ATS: CategoryFeedback;
  toneAndStyle: CategoryFeedback;
  content: CategoryFeedback;
  structure: CategoryFeedback;
  skills: CategoryFeedback;
}
```

## 🚀 Despliegue

### Build de Producción

```bash
pnpm run build
```

### Despliegue con Docker

1. **Construir imagen**

```bash
docker build -t curriculum-ai-analyzer .
```

2. **Ejecutar contenedor**

```bash
docker run -p 3000:3000 curriculum-ai-analyzer
```

### Plataformas Compatibles

- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Apps**
- **Digital Ocean App Platform**
- **Fly.io**
- **Railway**
- **Vercel** (con adaptador)
- **Netlify** (con adaptador)

### Variables de Producción

```bash
NODE_ENV=production
PORT=3000
```

## 🧪 Testing

```bash
# Ejecutar verificación de tipos
pnpm run typecheck

# Build de prueba
pnpm run build
```

## 📈 Rendimiento

### Optimizaciones Implementadas

- **Code Splitting**: Carga bajo demanda de componentes
- **Tree Shaking**: Eliminación de código no utilizado
- **Asset Optimization**: Compresión de imágenes y assets
- **Server-Side Rendering**: Renderizado del lado del servidor
- **Lazy Loading**: Carga diferida de componentes

### Métricas Objetivo

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔐 Seguridad

### Medidas Implementadas

- **Autenticación OAuth** a través de Puter.js
- **Validación de tipos** con TypeScript
- **Sanitización de inputs** en formularios
- **Manejo seguro de archivos** PDF
- **Headers de seguridad** en producción

## 🤝 Contribución

### Proceso de Contribución

1. Fork del repositorio
2. Crear branch feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Convenciones de Código

- **ESLint**: Seguir las reglas configuradas
- **Prettier**: Formateo automático
- **Conventional Commits**: Para mensajes de commit
- **TypeScript**: Tipado estricto obligatorio

### Estructura de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato/estilo
refactor: refactorización de código
test: adición/modificación de tests
chore: tareas de mantenimiento
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Lostovayne** - [GitHub](https://github.com/Lostovayne)

## 🙏 Agradecimientos

- **Puter.js** - Por proporcionar la infraestructura cloud
- **React Router** - Por el framework de enrutamiento
- **TailwindCSS** - Por el sistema de diseño
- **Vite** - Por las herramientas de desarrollo

---

**Resumind** - Mejora tus oportunidades laborales con análisis inteligente de currículums ✨

**Features**
[] Agregar Sonner para las notificaciones
