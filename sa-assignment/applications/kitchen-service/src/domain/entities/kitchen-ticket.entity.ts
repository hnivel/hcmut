import { v4 as uuidv4 } from 'uuid';
import { TicketStatus } from '@shared-kernel/constants/ticket-status.enum';
import { StationCategory } from '@shared-kernel/constants/station-category.enum';
import { TicketItem, CreateTicketItemProps } from './ticket-item.entity';

export interface CreateKitchenTicketProps {
  orderID: string;
  tableNumber: string;
  items: CreateTicketItemProps[];
  station: StationCategory;
  allergyNotes?: string;
}

export class KitchenTicket {
  private constructor(
    public readonly ticketID: string,
    public readonly orderID: string,
    public readonly tableNumber: string,
    public readonly items: ReadonlyArray<TicketItem>,
    private _status: TicketStatus,
    public readonly station: StationCategory,
    public readonly allergyNotes: string | undefined,
    public readonly createdAt: Date,
    public startedAt: Date | undefined,
    public readyAt: Date | undefined,
  ) {}

  // ──────────────────────────────────────────────
  // Factory methods
  // ──────────────────────────────────────────────

  static create(props: CreateKitchenTicketProps): KitchenTicket {
    if (!props.items || props.items.length === 0) {
      throw new Error('Kitchen ticket must contain at least one item');
    }

    const items = props.items.map((item) => TicketItem.create(uuidv4(), item));

    return new KitchenTicket(
      uuidv4(),
      props.orderID,
      props.tableNumber,
      items,
      TicketStatus.PENDING,
      props.station,
      props.allergyNotes,
      new Date(),
      undefined,
      undefined,
    );
  }

    static reconstitute(
    ticketID: string,
    orderID: string,
    tableNumber: string,
    items: TicketItem[],
    status: TicketStatus,
    station: StationCategory,
    allergyNotes: string | undefined,
    createdAt: Date,
    startedAt: Date | undefined,
    readyAt: Date | undefined,
  ): KitchenTicket {
    return new KitchenTicket(
      ticketID,
      orderID,
      tableNumber,
      items,
      status,
      station,
      allergyNotes,
      createdAt,
      startedAt,
      readyAt,
    );
  }

  // ──────────────────────────────────────────────
  // Read-only accessors
  // ──────────────────────────────────────────────

  get status(): TicketStatus {
    return this._status;
  }

  // ──────────────────────────────────────────────
  // State transitions
  // ──────────────────────────────────────────────

    start(): void {
    if (this._status !== TicketStatus.PENDING) {
      throw new Error(
        `Cannot start a ticket with status "${this._status}". Must be PENDING.`,
      );
    }
    this._status = TicketStatus.IN_PROGRESS;
    this.startedAt = new Date();
  }

    markReady(): void {
    if (this._status !== TicketStatus.IN_PROGRESS) {
      throw new Error(
        `Cannot mark a ticket ready with status "${this._status}". Must be IN_PROGRESS.`,
      );
    }
    this._status = TicketStatus.READY;
    this.readyAt = new Date();
  }
}
