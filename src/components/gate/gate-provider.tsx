"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface GateContextValue {
  isUnlocked: boolean
  showGate: boolean
  setShowGate: (show: boolean) => void
  unlock: (email: string) => void
}

const GateContext = createContext<GateContextValue>({
  isUnlocked: false,
  showGate: false,
  setShowGate: () => {},
  unlock: () => {},
})

export function useGateContext() {
  return useContext(GateContext)
}

const STORAGE_KEY = "incub_match_email_passed"

export function GateProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showGate, setShowGate] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "true") setIsUnlocked(true)
  }, [])

  const unlock = useCallback((email: string) => {
    localStorage.setItem(STORAGE_KEY, "true")
    localStorage.setItem("incub_match_email", email)
    setIsUnlocked(true)
    setShowGate(false)
  }, [])

  return (
    <GateContext.Provider value={{ isUnlocked, showGate, setShowGate, unlock }}>
      {children}
    </GateContext.Provider>
  )
}
