"use client";

import { useState, useEffect } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks: { label: string; href: Route | `#${string}` }[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Dashboard", href: "/member/dashboard" },
  { label: "Support", href: "/support" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Section highlighting
      const sections = ["hero", "features", "how-it-works"];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 border-b transition-all duration-300",
      scrolled 
        ? "border-white/20 bg-background/95 backdrop-blur-xl shadow-lg shadow-black/5" 
        : "border-white/10 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-[rgba(5,5,5,0.9)]"
    )}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" className="group inline-flex items-center gap-2" aria-label="Earniq home">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-lg font-semibold text-primary transition group-hover:bg-primary/30">
            ✦
          </span>
          <span className="text-lg font-semibold tracking-tight">Earniq</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => {
            const isHashLink = link.href.startsWith("#");
            const sectionId = isHashLink ? link.href.slice(1) : "";
            const isActive = isHashLink 
              ? activeSection === sectionId || (pathname === "/" && sectionId === "hero" && !activeSection)
              : link.href === pathname;
            const linkClasses = cn(
              "relative transition hover:text-foreground",
              isActive && "text-foreground"
            );

            return isHashLink ? (
              <a 
                key={link.label} 
                href={link.href} 
                className={linkClasses}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(sectionId);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
                )}
              </a>
            ) : (
              <Link key={link.label} href={link.href as Route} className={linkClasses}>
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full button-shine transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20">
            <Link href="/member/dashboard">Open Member Dashboard</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] border-white/10 bg-background/95 backdrop-blur-xl">
            <div className="flex flex-col gap-6 mt-8">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = link.href === pathname || (link.href.startsWith("#") && pathname === "/");
                  return link.href.startsWith("#") ? (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-3 text-sm font-medium rounded-lg transition",
                        isActive ? "text-foreground bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href as Route}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-3 text-sm font-medium rounded-lg transition",
                        isActive ? "text-foreground bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Button asChild variant="outline" className="w-full rounded-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full rounded-full button-shine" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/member/dashboard">Open Member Dashboard</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

