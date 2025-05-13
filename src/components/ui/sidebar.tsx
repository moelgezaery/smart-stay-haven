
import * as React from "react";
import * as SidebarPrimitive from "@radix-ui/react-sidebar";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createContext } from "react";

// Create a context to track sidebar state
const SidebarContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  preserveScroll: boolean;
}>({
  open: true,
  setOpen: () => {},
  preserveScroll: true,
});

export const SidebarProvider = ({
  children,
  preserveScroll = true,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  preserveScroll?: boolean;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ open, setOpen, preserveScroll }}>
      {children}
    </SidebarContext.Provider>
  );
};

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

export function SidebarTrigger() {
  const { open, setOpen } = useSidebar();
  return (
    <Button
      variant="outline"
      size="icon"
      className="shrink-0"
      onClick={() => setOpen(!open)}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

// this needs to be here because it's used by SidebarContent
const sidebarContentVariants = cva(
  "flex h-full flex-col overflow-hidden transition-all",
  {
    variants: {
      collapsed: {
        true: "w-sidebar-collapsed px-2 py-2",
        false: "w-sidebar px-4 py-2",
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);

const Sidebar = React.forwardRef<
  React.ElementRef<typeof SidebarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SidebarPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const { open } = useSidebar();

  return (
    <SidebarPrimitive.Root
      ref={ref}
      open={open}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-transform data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0",
        open ? "w-sidebar" : "w-sidebar-collapsed",
        className
      )}
      {...props}
    >
      {children}
    </SidebarPrimitive.Root>
  );
});

Sidebar.displayName = "Sidebar";

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarContentVariants> {
  containerClassName?: string;
}

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  SidebarContentProps
>(({ className, collapsed, containerClassName, ...props }, ref) => {
  const { open, preserveScroll } = useSidebar();
  
  return (
    <div
      className={cn(
        "flex-1 overflow-auto",
        preserveScroll ? "overflow-x-hidden" : "", // Add overflow-x-hidden to prevent horizontal scrolling
        containerClassName
      )}
      ref={ref}
    >
      <div
        className={cn(
          sidebarContentVariants({ collapsed: !open }),
          className
        )}
        {...props}
      />
    </div>
  );
});

SidebarContent.displayName = "SidebarContent";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { showCloseButton?: boolean }
>(({ className, children, showCloseButton = true, ...props }, ref) => {
  const { open, setOpen } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-sidebar-header flex-none items-center justify-between border-b border-sidebar-border px-4",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
});

SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-sidebar-footer flex-none items-center justify-between border-t border-sidebar-border px-4 py-4",
      className
    )}
    {...props}
  />
));

SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col py-2",
        open ? "px-0" : "items-center px-0",
        className
      )}
      {...props}
    />
  );
});

SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebar();

  if (!open) return null;

  return (
    <span
      ref={ref}
      className={cn(
        "mb-1 px-2 text-xs font-medium text-sidebar-foreground-muted",
        className
      )}
      {...props}
    />
  );
});

SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        open ? "flex-col" : "flex-col items-center",
        className
      )}
      {...props}
    />
  );
});

SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
));

SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));

SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "group relative flex w-full cursor-pointer items-center gap-2 rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground",
        ghost: "text-sidebar-foreground hover:text-sidebar-foreground",
      },
      isActive: {
        true: "bg-sidebar-active text-sidebar-foreground-active hover:bg-sidebar-active/90",
        false: "",
      },
      size: {
        default: "h-9 px-2 py-1",
        sm: "h-8 px-2",
        lg: "h-10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isActive: false,
    },
  }
);

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      className,
      variant,
      size,
      isActive,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const { open } = useSidebar();
    const Comp = asChild ? "span" : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          sidebarMenuButtonVariants({ variant, size, isActive }),
          open ? "" : "justify-center",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    defaultCollapsed?: boolean;
    collapsible?: boolean;
  }
>(
  (
    {
      className,
      title,
      defaultCollapsed = false,
      collapsible = false,
      children,
      ...props
    },
    ref
  ) => {
    const { open } = useSidebar();
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

    const toggle = () => {
      if (collapsible) setCollapsed(!collapsed);
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col py-2", className)}
        {...props}
      >
        {title && (
          <div
            className={cn(
              "flex cursor-pointer items-center gap-1 px-4 py-1",
              collapsible && "cursor-pointer"
            )}
            onClick={toggle}
          >
            {collapsible && (
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  !collapsed && "rotate-90"
                )}
              />
            )}
            <h3
              className={cn(
                "flex-1 text-xs font-medium uppercase text-sidebar-foreground-muted",
                open ? "" : "hidden"
              )}
            >
              {title}
            </h3>
          </div>
        )}
        {!collapsed && children}
      </div>
    );
  }
);

SidebarSection.displayName = "SidebarSection";

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSection,
};
