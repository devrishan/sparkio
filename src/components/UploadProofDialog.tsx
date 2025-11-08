import { useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const UploadProofDialog = () => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setOpen(false);
      toast({
        title: "Proof verified — you're on a roll.",
        description: "Your referral has been added and is being reviewed.",
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full glow-sm" size="lg">
          <Upload className="mr-2 h-4 w-4" />
          Upload Proof
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">Submit Referral Proof</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload proof of your referral to earn rewards instantly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Referred Person's Name
            </Label>
            <Input
              id="name"
              placeholder="Enter full name"
              required
              className="border-border bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot" className="text-foreground">
              Screenshot/Proof
            </Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              required
              className="border-border bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Upload a clear screenshot showing the completed referral
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={uploading}
          >
            {uploading ? "Verifying..." : "Submit for Verification"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
