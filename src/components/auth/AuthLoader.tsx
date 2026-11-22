'use client'

import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchSupabaseUser, selectCurrentUser } from '@/store/user/authSlice'
import { fetchUserProfile } from '@/store/user/userSlice'

export default function AuthLoader() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const tried = useRef(false)

  useEffect(() => {
    if (!user && !tried.current) {
      dispatch(fetchSupabaseUser()).then(() => {
        tried.current = true
      })
    }
  }, [dispatch, user])

  // Fetch user profile from the database once user is loaded
  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, !!user])

  // Subscribe to auth state changes
  // This will ensure the user state across tabs is updated on login/logout
  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined
    void import('@/lib/supabase/client').then(({ supabase }) => {
      if (!active) return
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        dispatch(fetchSupabaseUser())
      })
      unsubscribe = () => subscription.unsubscribe()
    })
    return () => {
      active = false
      unsubscribe?.()
    }
  }, [dispatch])

  return null
}
