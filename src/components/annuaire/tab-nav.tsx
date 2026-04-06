"use client"

import { categories } from "@/lib/categories"

interface TabNavProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-bg-border bg-bg-base">
      <div className="mx-auto max-w-[900px]">
        <nav className="scrollbar-hide flex overflow-x-auto px-5" role="tablist">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(cat.id)}
                className={`shrink-0 border-b-2 px-5 py-3 text-[14px] font-semibold transition-colors ${
                  isActive
                    ? "text-text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
                style={{
                  borderBottomColor: isActive ? cat.color : "transparent",
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
