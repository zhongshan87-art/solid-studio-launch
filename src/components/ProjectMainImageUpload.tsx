import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProjectMainImageUploadProps {
  projectId: number;
  onImageUpdate: (projectId: number, imageUrl: string) => void;
  className?: string;
}

export const ProjectMainImageUpload: React.FC<ProjectMainImageUploadProps> = ({ 
  projectId, 
  onImageUpdate, 
  className 
}) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "文件类型错误",
          description: "请选择图片文件",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      
      // 生成预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "请选择文件",
        description: "请先选择要上传的图片",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `projects/main/${fileName}`;

      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(data.path);

      onImageUpdate(projectId, publicUrl);

      toast({
        title: "上传成功",
        description: "主图片已成功更新",
      });

      setSelectedFile(null);
      setPreviewUrl('');
      setOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "上传过程中出现错误",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={className}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          更换主图
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>更换项目主图</DialogTitle>
          <DialogDescription>
            选择新的主图片并上传到云端存储
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="main-image-upload">选择图片 *</Label>
            <Input
              id="main-image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </div>
          
          {previewUrl && (
            <div className="space-y-2">
              <Label>预览</Label>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="预览" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
            取消
          </Button>
          <Button onClick={handleUpload} disabled={uploading || !selectedFile}>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? '上传中...' : '上传'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
