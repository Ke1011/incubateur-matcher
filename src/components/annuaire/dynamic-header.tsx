import type { Category } from "@/lib/types"

interface DynamicHeaderProps {
  category: Category
}

export function DynamicHeader({ category }: DynamicHeaderProps) {
  return (
    <div
      className="animate-fade-in px-5 py-10 md:px-8 md:py-12"
      style={{ background: category.gradient }}
    >
      <div className="mx-auto max-w-[900px]">
        <h1 className="mb-2 text-[22px] font-extrabold leading-tight text-text-primary md:text-[28px]">
          {category.title}
        </h1>
        <p className="text-sm text-text-secondary">{category.subtitle}</p>
      </div>
    </div>
  )
}
