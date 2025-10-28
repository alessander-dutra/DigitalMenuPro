# DigitalMenuPro

Aqui está um modelo de README para seu projeto GitHub, estruturado de forma clara, com seções detalhadas e linguagem simples para fácil compreensão, cobrindo arquitetura, componentes, dependências, fluxo de dados, estratégias de implantação e changelog, além das funcionalidades solicitadas:

## Visão Geral

Este é um aplicativo moderno de pedidos para restaurantes, desenvolvido com React, Express e PostgreSQL. Com ele, clientes navegam pelo cardápio, adicionam itens ao carrinho e realizam pedidos em uma interface limpa e responsiva para dispositivos móveis. O sistema oferece toda a experiência de delivery ou retirada, além de gestão de pedidos.

## Arquitetura do Sistema

### Arquitetura Frontend

- Framework: React 18 + TypeScript
- Rotas: Wouter para roteamento no cliente
- Gerenciamento de Estado: React hooks com lógica própria para carrinho
- Componentes UI: Biblioteca Shadcn/ui baseada em Radix UI
- Estilização: Tailwind CSS com variáveis customizadas
- Build: Vite para desenvolvimento rápido e builds otimizadas
- Fetching: TanStack Query (React Query) para gerenciar estado do servidor

### Arquitetura Backend

- Runtime: Node.js com Express
- Linguagem: TypeScript (ES Modules)
- ORM: Drizzle ORM para operações seguras com banco de dados
- Banco de Dados: PostgreSQL com driver Neon serverless
- API: Endpoints RESTful para itens, pedidos e configurações
- Desenvolvimento: Hot reload com integração Vite

## Esquema do Banco de Dados

Principais tabelas no PostgreSQL:

- menu_items: itens do cardápio, categorias, preços, disponibilidade
- orders: informações dos pedidos, dados de entrega e pagamento
- order_items: liga pedidos aos itens, com quantidades
- categories: categorias do cardápio e configurações
- Outras: configurações, promoções, avaliações, agendamento

## Componentes Principais

### Frontend

- Header: Navegação, busca e acesso rápido ao carrinho
- CategoryTabs: Filtragem do cardápio por categoria com ícones
- MenuSection: Exibe itens por categoria
- MenuItemCard: Card de cada item com botão de adicionar ao carrinho
- CartOverlay: Painel lateral do carrinho com controle de quantidade
- CheckoutModal: Formulário de dados e conclusão do pedido
- OrderConfirmation: Confirmação e detalhes pós-pedido

### Backend

- Storage Layer: Interface abstrata para o banco de dados
- Rotas: Endpoints para cardápio, pedidos e checkout
- Validação: Schemas Zod para garantir dados corretos
- Error Handling: Middleware centralizado para erros

## Fluxo de Dados

- Carregamento do menu: Frontend chama /api/menu-items
- Filtragem: Cards filtrados no cliente por categoria
- Busca: Filtro em tempo real no frontend
- Carrinho: Estado local, operações persistentes
- Realização do pedido: Validação, coleta de dados, envio via API
- Processamento: Backend salva registro e retorna confirmação

## Dependências Externas

### Frontend

- UI: React + Radix UI (Shadcn)
- Estilo: Tailwind CSS + PostCSS
- Formulários: React Hook Form + Zod
- Datas: date-fns
- Ícones: Lucide React
- Animações: Class Variance Authority

### Backend

- Banco: @neondatabase/serverless PostgreSQL
- ORM: Drizzle PostgreSQL
- Sessões: Connect-pg-simple
- Validação: Zod
- Build: ESBuild (produção), TSX (dev)

### Ferramentas de Desenvolvimento

- Package Manager: NPM (lockfile v3)
- TypeScript: Tipagem strict, ES Modules
- Lint/Format: ESLint e Prettier
- Dev Server: Vite com HMR e overlay de erros

## Estratégia de Implantação

### Ambiente de Desenvolvimento

- Runtime: Node.js 20 + módulos Replit
- Banco: PostgreSQL 16
- Portas: 5000 interna, 4200 externa
- Hot reload: Vite + middleware Express

### Build de Produção

- Processo: Dois estágios (client: Vite, server: ESBuild)
- Saída: Arquivos otimizados em dist/public e dist/index.js
- Alvo: Deploy autoscaling com comandos de build/run
- Assets: Servidos pelo Express no dev, estáticos em produção

### Configuração de Ambiente

- Database URL: variável obrigatória
- Sessão: Sessões persistidas em PostgreSQL
- Assets: Estratégia diferenciada para dev/prod

## Changelog

- 26/06/2025: Setup inicial
- 27/12/2025: Implementações:
    - Sistema de configurações administrativas (ícone de engrenagem)
    - Gestão de categorias personalizadas (ícones e limites min/max)
    - Promoções com períodos configuráveis
    - Agendamento de pedidos para entrega/retirada
    - Carrossel de itens mais avaliados
    - Avaliações de satisfação do cliente
    - Seletor de impressora de produção para itens do cardápio
    - Modo visualização com opção para desabilitar checkout
    - Rodapé personalizado

## Funcionalidades Solicitadas

- Cadastro de impressoras de produção por item do cardápio
- Promoções completas com valores originais e promocionais
- Controle de checkout (habilitar/desabilitar)
- Agendamento de pedidos
- Sistema de avaliações e satisfação
- Carrossel dos itens mais bem avaliados

## Comunicação

Preferência por linguagem simples e direta.

***

Este README cobre todos os detalhes técnicos e funcionais do seu sistema, organizado para facilitar entendimento e manutenção.
