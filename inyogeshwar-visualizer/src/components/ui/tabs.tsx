import * as React from "react"

import { cn } from "@/lib/utils"

const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: string; onValueChange?: (value: string) => void }>(
  ({ className, value, onValueChange, ...props }, ref) => {
    const [activeValue, setActiveValue] = React.useState(value || "")
    
    const handleValueChange = (newValue: string) => {
      setActiveValue(newValue)
      onValueChange?.(newValue)
    }

    return (
      <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props} />
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md bg-white/5 p-1 text-white/70 border border-white/10",
          className
        )}
        {...props}
      />
    )
  }
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    const isActive = context?.value === value

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive 
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm" 
            : "hover:text-white hover:bg-white/5",
          className
        )}
        onClick={() => context?.onValueChange(value)}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    const isActive = context?.value === value

    if (!isActive) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state="active"
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

type TabsContextType = {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsContext }
