export const EVENT_VIEW_ITEM = 'view_item'
export const EVENT_ADD_TO_CART = 'add_to_cart'
export const EVENT_BEGIN_CHECKOUT = 'begin_checkout'
export const EVENT_PURCHASE = 'purchase'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Generic GA4 event sender.
 */
export const gaEvent = (action: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params)
  }
}

/**
 * Log a product view.
 */
export const logViewItem = (product: {
  id: number
  title: string
  price: number
}) => {
  gaEvent(EVENT_VIEW_ITEM, {
    items: [
      {
        item_id: product.id.toString(),
        item_name: product.title,
        price: product.price,
      },
    ],
  })
}

/**
 * Log an add-to-cart action.
 */
export const logAddToCart = (
  product: { id: number; title: string; price: number },
  quantity = 1
) => {
  gaEvent(EVENT_ADD_TO_CART, {
    items: [
      {
        item_id: product.id.toString(),
        item_name: product.title,
        price: product.price,
        quantity,
      },
    ],
  })
}

/**
 * Log beginning of checkout.
 */
export const logBeginCheckout = (
  items: Array<{ id: number; quantity: number; price: number }>
) => {
  gaEvent(EVENT_BEGIN_CHECKOUT, {
    items: items.map((i) => ({
      item_id: i.id.toString(),
      quantity: i.quantity,
      price: i.price,
    })),
  })
}

/**
 * Log purchase completion.
 */
export const logPurchase = (order: {
  id: number
  total: number
  items: Array<{ id: number; quantity: number; price: number }>
}) => {
  gaEvent(EVENT_PURCHASE, {
    transaction_id: order.id.toString(),
    value: order.total,
    currency: 'JPY',
    items: order.items.map((i) => ({
      item_id: i.id.toString(),
      quantity: i.quantity,
      price: i.price,
    })),
  })
}
