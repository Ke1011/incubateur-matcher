"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "incub_match_email_passed"

export function useGate() {
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

  return { isUnlocked, showGate, setShowGate, unlock }
}
