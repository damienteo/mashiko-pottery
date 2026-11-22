'use client'

import { toast, Toaster, ToastOptions } from 'react-hot-toast'

export function ToasterContainer() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'bg-white border-l-4 border-blue-600 shadow-lg',
        success: { icon: '✅' },
        error: { icon: '❌' },
      }}
    />
  )
}

export const useToast = () => ({
  success: (msg: string, opts?: ToastOptions) => toast.success(msg, opts),
  error: (msg: string, opts?: ToastOptions) => toast.error(msg, opts),
  // info, loading, custom…
})
