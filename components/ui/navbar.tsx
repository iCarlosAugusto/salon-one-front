"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Scissors, Menu, BookOpen, Home } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Button } from "./button"


export function Navbar() {

    const [open, setOpen] = React.useState(false)
    const pathname = usePathname()
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Scissors className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl hidden sm:inline-block">
                        Cabelinho
                    </span>
                </Link>

                {/* Desktop Navigation - Using NavigationMenu from Shadcn */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/">Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/profile/schedules">Agendamentos</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right side - Desktop User Button + Mobile Menu */}
                <div className="flex items-center gap-2">
                    {/* User Button - Hidden on small mobile */}
                    <div className="hidden sm:block">
                        <Link href="/profile">Perfil</Link>
                    </div>

                    {/* Mobile Menu - Hamburger */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <Scissors className="h-5 w-5 text-primary" />
                                    Cabelinho
                                </SheetTitle>
                                {/* Mobile User Section */}
                                <div className="border-t pt-4 sm:hidden">
                                    <div className="flex gap-2 items-center">
                                        <Link href="/profile">Perfil</Link>
                                    </div>
                                </div>
                            </SheetHeader>



                            <div className="flex flex-col gap-4">
                                {/* Mobile Navigation Links */}
                                <nav className="flex flex-col space-y-2">
                                    <Link
                                        href="/"
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                                            pathname === '/'
                                                ? 'bg-accent text-foreground font-semibold'
                                                : 'text-muted-foreground'
                                        )}
                                    >
                                        <Home className="h-5 w-5" />
                                        Home
                                    </Link>

                                    <Link
                                        href="/profile/schedules"
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                                            pathname === '/profile/schedules'
                                                ? 'bg-accent text-foreground font-semibold'
                                                : 'text-muted-foreground'
                                        )}
                                    >
                                        <BookOpen className="h-5 w-5" />
                                        Agendamentos
                                    </Link>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}