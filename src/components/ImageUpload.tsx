import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageAdd: (image: { url: string; alt: string; caption?: string }) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageAdd, className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB for better performance)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Convert file to Base64 DataURL for persistence
      const reader = new FileReader();
      
      reader.onload = () => {
        const dataUrl = reader.result as string;
        
        // Add image to project with persistent DataURL
        onImageAdd({
          url: dataUrl,
          alt: file.name.split('.')[0],
          caption: file.name,
        });

        toast({
          title: "Image uploaded",
          description: "Image has been added to the project.",
        });

        setUploading(false);
      };

      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "Failed to read image file. Please try again.",
          variant: "destructive",
        });
        setUploading(false);
      };

      // Read file as DataURL (Base64)
      reader.readAsDataURL(file);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={triggerFileSelect}
        disabled={uploading}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        {uploading ? "Uploading..." : "Add Image"}
      </Button>
    </div>
  );
};