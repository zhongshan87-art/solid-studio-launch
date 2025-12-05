import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";
import { toast } from "@/hooks/use-toast";

interface StudioImageUploadProps {
  onUpload: (imageUrl: string) => Promise<void>;
  className?: string;
}

export function StudioImageUpload({ onUpload, className }: StudioImageUploadProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, 'studio');
      await onUpload(publicUrl);

      toast({
        title: "Success",
        description: "Studio image updated successfully",
      });

      setOpen(false);
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Upload className="h-4 w-4 mr-2" />
          Change Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Studio Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setOpen(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading} className="flex-1">
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
