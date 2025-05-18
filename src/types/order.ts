export interface OrderSummary {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface OrderDetails extends OrderSummary {
  items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}
