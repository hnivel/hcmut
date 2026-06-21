# SOLID Principles Analysis in IRMS Architecture

This document serves as proof of adherence to the **SOLID principles** within the Intelligent Restaurant Management System (IRMS) codebase. By strictly following Clean Architecture and Domain-Driven Design (DDD), the repository ensures high maintainability, extensibility, and separation of concerns.

Below is a detailed breakdown of how each principle is applied in the actual codebase.

---

## 1. Single Responsibility Principle (SRP)
**Definition:** A class should have one, and only one, reason to change.

**How it's applied in IRMS:**
Instead of creating massive, monolithic "God Services" (e.g., an `OrderService` that handles HTTP, database queries, and business logic), the architecture divides responsibilities into highly focused components.

* **Use Cases:** Every business action is encapsulated in its own class. For example, `CreateOrderUseCase` handles strictly the application flow for creating an order. It delegates domain validation to the `Order` entity and persistence to the repository.
* **Mappers:** By introducing `order.mapper.ts` and `kitchen-ticket.mapper.ts`, the database serialization logic is entirely separated from the Domain layer. The domain entity (`Order`) knows nothing about PostgreSQL or TypeORM decorators. 

**Code Evidence:**
```typescript
// applications/orders-service/src/infrastructure/persistence/order.mapper.ts
export class OrderMapper {
  static toDomain(ormEntity: OrderOrmEntity): Order { ... }
  static toOrm(domainEntity: Order): OrderOrmEntity { ... }
}
```

---

## 2. Open/Closed Principle (OCP)
**Definition:** Software entities should be open for extension, but closed for modification.

**How it's applied in IRMS:**
The Event-Driven Architecture between the `orders-service` and `kitchen-service` is the perfect manifestation of OCP.

When an order is created, the `EventPublisher` inside the Order Service publishes an `OrderCreatedEvent` to Kafka. If the business decides to add a new `billing-service` to manage invoices tomorrow, we simply write a new subscriber in the new service. We **do not** need to touch or modify the existing `CreateOrderUseCase` or `Order` domain entity. The system naturally extends without altering existing heavily-tested code.

---

## 3. Liskov Substitution Principle (LSP)
**Definition:** Subtypes must be substitutable for their base types without altering the correctness of the program.

**How it's applied in IRMS:**
Our Application layer relies purely on abstraction (Interfaces). The infrastructure layer implements those interfaces.

For instance, `IOrderRepository` dictates how orders are stored and retrieved. `OrderRepositoryImpl` (using TypeORM) fulfills this contract flawlessly without unexpectedly throwing database-specific framework errors up to the application layer. If we choose to replace TypeORM with Prisma tomorrow, a new `PrismaOrderRepositoryImpl` could be swapped in without breaking the Application layer constraints.

---

## 4. Interface Segregation Principle (ISP)
**Definition:** Clients should not be forced to depend upon interfaces that they do not use.

**How it's applied in IRMS:**
We avoid generalized `IRepository<T>` patterns that bloat classes with unused methods. 

Instead, our interfaces are strictly segregated and tailored to exactly what the specific domain boundary requires.
* `IOrderRepository` handles `save()`, `findById()`.
* `IKitchenTicketRepository` has extremely specific methods like `findActiveTickets()` instead of inheriting a generalized query class that it doesn't need. 

**Code Evidence:**
```typescript
// applications/kitchen-service/src/domain/repositories/kitchen-ticket.repository.interface.ts
export interface IKitchenTicketRepository {
  save(ticket: KitchenTicket): Promise<void>;
  findById(id: string): Promise<KitchenTicket | null>;
  findActiveTickets(): Promise<KitchenTicket[]>; // Segregated specifically for KDS queues
}
```

---

## 5. Dependency Inversion Principle (DIP)
**Definition:** High-level modules should not depend on low-level modules. Both should depend on abstractions.

**How it's applied in IRMS:**
This is the cornerstone of Clean Architecture in this project. The inner core (Application and Domain layers) has absolutely zero dependencies on the outer layers (Infrastructure/TypeORM/Kafka).

The `CreateOrderUseCase` injects an abstraction (`IOrderRepository`) rather than a concrete database class. NestJS handles injecting the actual `OrderRepositoryImpl` at runtime using specialized injection tokens.

**Code Evidence:**
```typescript
// applications/orders-service/src/application/use-cases/create-order.use-case.ts
@Injectable()
export class CreateOrderUseCase {
  constructor(
    // Notice how it depends purely on the Interface token, completely blind to TypeORM
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: IOrderRepository,
    
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: IEventPublisher,
  ) {}
  
  // ...
}
```
