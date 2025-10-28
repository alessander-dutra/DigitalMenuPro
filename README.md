# DigitalMenuPro

Overview
This is a modern full-stack restaurant ordering application built with React, Express, and PostgreSQL. The application allows customers to browse a menu, add items to cart, and place orders through a clean, mobile-responsive interface. It features a complete food delivery/pickup system with order management capabilities.

System Architecture
Frontend Architecture
Framework: React 18 with TypeScript
Routing: Wouter for client-side routing
State Management: React hooks with custom cart management
UI Components: Shadcn/ui component library with Radix UI primitives
Styling: Tailwind CSS with custom CSS variables for theming
Build Tool: Vite for fast development and optimized builds
Data Fetching: TanStack Query (React Query) for server state management
Backend Architecture
Runtime: Node.js with Express.js framework
Language: TypeScript with ES modules
Database ORM: Drizzle ORM for type-safe database operations
Database: PostgreSQL with Neon serverless driver
API Design: RESTful API endpoints for menu items, orders, and settings
Development: Hot reload with Vite integration in development mode
Database Schema
The application uses PostgreSQL with the following main tables:

menu_items: Stores restaurant menu items with categories, prices, and availability
orders: Customer order information including delivery details and payment method
order_items: Junction table linking orders to menu items with quantities
categories: Menu categories with display configuration
Additional tables for store settings, promotions, reviews, and scheduled orders
Key Components
Frontend Components
Header: Navigation with search functionality and cart access
CategoryTabs: Menu category filtering with icon-based navigation
MenuSection: Displays menu items grouped by category
MenuItemCard: Individual menu item display with add-to-cart functionality
CartOverlay: Sliding cart panel with quantity management
CheckoutModal: Customer information and order placement form
OrderConfirmation: Post-order success display with order details
Backend Services
Storage Layer: Abstract storage interface for database operations
Route Handlers: Express routes for menu items, orders, and checkout
Validation: Zod schemas for request/response validation
Error Handling: Centralized error handling middleware
Data Flow
Menu Loading: Frontend fetches menu items from /api/menu-items endpoint
Category Filtering: Client-side filtering of menu items by category
Search Functionality: Real-time search filtering of menu items
Cart Management: Local state management with persistent cart operations
Order Placement: Form validation, customer data collection, and API submission
Order Processing: Backend creates order records and returns confirmation
External Dependencies
Frontend Dependencies
UI Framework: React with extensive Radix UI component library
Styling: Tailwind CSS with PostCSS processing
Form Handling: React Hook Form with Zod validation resolvers
Date Handling: date-fns for date formatting and manipulation
Icons: Lucide React for consistent iconography
Animations: Class Variance Authority for component variants
Backend Dependencies
Database: @neondatabase/serverless for PostgreSQL connection
ORM: Drizzle ORM with PostgreSQL dialect
Session Management: Connect-pg-simple for PostgreSQL session storage
Validation: Zod for runtime type checking and validation
Build Tools: ESBuild for production bundling, TSX for development
Development Tools
Package Manager: NPM with lockfile version 3
TypeScript: Strict type checking with modern ES modules
Linting/Formatting: ESLint and Prettier configuration
Development Server: Vite with HMR and error overlay
Deployment Strategy
Development Environment
Runtime: Node.js 20 with Replit modules
Database: PostgreSQL 16 module
Port Configuration: Internal port 5000, external port 4200
Hot Reload: Vite development server with middleware integration
Production Build
Build Process: Two-stage build (client with Vite, server with ESBuild)
Output: Optimized client assets in dist/public, server bundle in dist/index.js
Deployment Target: Autoscale deployment with build/run commands
Static Assets: Client files served from Express with Vite middleware in development
Environment Configuration
Database URL: Required environment variable for PostgreSQL connection
Session Management: PostgreSQL-backed sessions for user state
Asset Serving: Development vs production asset serving strategy
Changelog
Changelog:

June 26, 2025. Initial setup
December 27, 2025. Implementação completa de:
Sistema de configurações administrativas com ícone de engrenagem
Gestão de categorias personalizadas com ícones e limites min/max
Sistema de promoções com períodos configuráveis
Agendamento de pedidos para entrega e retirada
Carrossel de itens mais avaliados
Sistema de avaliação de satisfação dos clientes
Seletor de impressora de produção para itens do cardápio
Opção de desabilitar checkout (modo apenas visualização)
Rodapé com copyright personalizado
User Preferences
Preferred communication style: Simple, everyday language. Funcionalidades solicitadas:

Cadastro de impressoras de produção para cada item do cardápio
Sistema completo de promoções com valores originais e promocionais
Controle de checkout (permitir/desabilitar)
Agendamento de pedidos
Sistema de avaliações e satisfação
Carrossel de itens mais avaliados
