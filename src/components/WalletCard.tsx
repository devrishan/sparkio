import { Wallet, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WalletCardProps {
  balance: number;
  onWithdraw: () => void;
}

export const WalletCard = ({ balance, onWithdraw }: WalletCardProps) => {
  const canWithdraw = balance >= 100;

  return (
    <Card className="relative overflow-hidden border-border bg-gradient-to-br from-card via-card to-card/50 p-6 spark-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Wallet Balance</h3>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">₹{balance}</span>
            <span className="text-lg text-muted-foreground">.00</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {canWithdraw 
              ? "Ready to withdraw! 🎉" 
              : `₹${100 - balance} more to unlock withdrawal`}
          </p>
        </div>

        <Button
          onClick={onWithdraw}
          disabled={!canWithdraw}
          className={`w-full ${canWithdraw ? 'animate-sparkle glow-md' : ''}`}
          variant={canWithdraw ? "default" : "secondary"}
        >
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Withdraw to UPI
        </Button>
      </div>
    </Card>
  );
};
