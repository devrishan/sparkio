"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react";

import { fadeInUp, viewport } from "@/components/marketing/animations";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Dashboard", href: "/member/dashboard" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com", external: true },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com", external: true },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", external: true },
];

export function SiteFooter() {
  return (
    <motion.footer
      className="border-t border-white/10 glass-nav px-6 py-16 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeInUp}
    >
      <div className="mx-auto max-w-6xl">
        {/* Main Footer Content */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-lg font-semibold text-primary">
                ✦
              </span>
              <span className="text-xl font-semibold tracking-tight">Earniq</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transparent, task-based earnings for India. Track referrals, wallets, and UPI withdrawals—no hidden fees.
            </p>
          </div>

          {/* Column 2: Product Links */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">Product</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/member/dashboard" className="transition hover:text-foreground hover:translate-x-1 inline-block">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/member/tasks" className="transition hover:text-foreground hover:translate-x-1 inline-block">
                  Tasks
                </Link>
              </li>
              <li>
                <Link href="/member/referrals" className="transition hover:text-foreground hover:translate-x-1 inline-block">
                  Referrals
                </Link>
              </li>
              <li>
                <Link href="/member/withdraw" className="transition hover:text-foreground hover:translate-x-1 inline-block">
                  Wallet
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">Company</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="transition hover:text-foreground hover:translate-x-1 inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-foreground hover:translate-x-1 inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/support" className="transition hover:text-foreground hover:translate-x-1 inline-block">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Links */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">Legal</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="transition hover:text-foreground hover:translate-x-1 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-foreground hover:translate-x-1 inline-block">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media & Newsletter */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">Connect</p>
            <div className="flex flex-col space-y-4">
              {/* Social Media Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  const linkProps = social.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {};
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 glass-card text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:scale-110"
                      aria-label={social.label}
                      {...linkProps}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
              
              {/* Newsletter Signup Placeholder */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Stay updated</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex h-9 w-full rounded-md border border-white/10 glass-card bg-white/5 px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  />
                  <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Trust Strip */}
        <div className="border-t border-white/10 pt-8 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Secure UPI payouts</span>
            <span>·</span>
            <span>OTP-based login</span>
            <span>·</span>
            <span>Fraud & duplicate filters</span>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            © {new Date().getFullYear()} Earniq. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

