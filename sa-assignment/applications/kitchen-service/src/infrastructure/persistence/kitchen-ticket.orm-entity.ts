import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { TicketStatus } from '@shared-kernel/constants/ticket-status.enum';
import { StationCategory } from '@shared-kernel/constants/station-category.enum';

@Entity('kitchen_tickets')
export class KitchenTicketOrmEntity {
  @PrimaryColumn('uuid')
  ticketID!: string;

  @Column('uuid')
  orderID!: string;

  @Column({ length: 50 })
  tableNumber!: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.PENDING,
  })
  status!: TicketStatus;

  @Column({
    type: 'enum',
    enum: StationCategory,
    default: StationCategory.GENERAL,
  })
  station!: StationCategory;

  @Column({ nullable: true, type: 'text' })
  allergyNotes?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  readyAt?: Date;

  @OneToMany(() => TicketItemOrmEntity, (item) => item.ticket, {
    cascade: true,
    eager: true,
  })
  items!: TicketItemOrmEntity[];
}

@Entity('ticket_items')
export class TicketItemOrmEntity {
  @PrimaryColumn('uuid')
  ticketItemID!: string;

  @ManyToOne(() => KitchenTicketOrmEntity, (ticket) => ticket.items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'ticketID' })
  ticket!: KitchenTicketOrmEntity;

  @Column('uuid')
  menuItemID!: string;

  @Column({ length: 255 })
  name!: string;

  @Column('int')
  quantity!: number;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column({ length: 50, default: 'GENERAL' })
  category!: string;
}
