# Restaurant Management System

> **Service-Based Architecture**: Orders & Kitchen services sharing a PostgreSQL database, communicating via Kafka.

## Table of Contents
- [Architecture](#architecture)
- [Services](#services)
- [Getting Started](#getting-started)

## Architecture
The system uses a highly decoupled Service-Based Architecture focusing on Clean Architecture + Domain-Driven Design (DDD).
- **Core database**: PostgreSQL (`restaurant_db`)
- **Event Bus**: Kafka for asynchronous messaging (e.g. `orders.created`, `orders.cancelled`)

## Services

### orders-service (`:3000`)
Handles the REST API for order creation and state management. Emits events to Kafka when orders are placed.

### kitchen-service (`:3001`)
Kitchen Display System (KDS) receives order events and manages preparation.

Lifecycle:
`PENDING -> IN_PROGRESS -> READY`

**Station routing** is automatically assigned based on dominant item category:
- `GRILL` > `FRYING` > `COLD` > `BEVERAGE` > `GENERAL`

## Getting Started

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 22

### 2. Start Infrastructure
```bash
npm run docker:up
```

### 3. Start services
```bash
# Terminal 1 - Orders Service (port 3000)
npm run start:orders

# Terminal 2 - Kitchen Service (port 3001)
npm run start:kitchen
```
