import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '@shared-kernel/constants/order-status.enum';

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryColumn('uuid')
  orderID!: string;

  @Column({ length: 50 })
  tableNumber!: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({ nullable: true, type: 'text' })
  allergyNotes?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => OrderItemOrmEntity, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items!: OrderItemOrmEntity[];
}

@Entity('order_items')
export class OrderItemOrmEntity {
  @PrimaryColumn('uuid')
  orderItemID!: string;

  @ManyToOne(() => OrderOrmEntity, (order) => order.items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'orderID' })
  order!: OrderOrmEntity;

  @Column('uuid')
  menuItemID!: string;

  @Column({ length: 255 })
  name!: string;

  @Column('int')
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column({ length: 50, default: 'GENERAL' })
  category!: string;
}
