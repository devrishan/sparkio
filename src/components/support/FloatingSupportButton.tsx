"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, X, HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function FloatingSupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Only show on member routes
  if (!pathname?.startsWith("/member")) {
    return null;
  }

  const handleOpenSupportCenter = () => {
    setIsOpen(false);
    router.push("/member/support");
  };

  const handleReadFaqs = () => {
    setIsOpen(false);
    router.push("/member/support#faqs");
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg md:bottom-6 md:right-6"
        size="icon"
        aria-label="Open support"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:w-96">
          <SheetHeader>
            <SheetTitle>Need help?</SheetTitle>
            <SheetDescription>
              Get support for your account, tasks, referrals, or withdrawals.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-3">
            <Button
              onClick={handleOpenSupportCenter}
              className="w-full"
              variant="default"
            >
              Open support center
            </Button>
            <Button
              onClick={handleReadFaqs}
              className="w-full"
              variant="outline"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Read FAQs
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

