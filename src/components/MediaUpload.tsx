import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/uploadImage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MediaUploadProps {
  onMediaAdd: (media: { 
    url: string; 
    alt: string; 
    caption?: string;
    type: 'image' | 'video';
    thumbnail?: string;
  }) => void;
  className?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaAdd, className }) => {
  const [open, setOpen] = useState(false);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    if (!altText.trim()) {
      toast({
        title: "Alt文本不能为空",
        description: "请输入图片描述",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const publicUrl = await uploadImage(selectedFile, 'projects');

      onMediaAdd({
        url: publicUrl,
        alt: altText,
        caption: caption || altText,
        type: 'image',
      });

      toast({
        title: "上传成功",
        description: "图片已成功上传到云端",
      });

      setSelectedFile(null);
      setAltText('');
      setCaption('');
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
          className={className}
        >
          <Plus className="w-4 h-4 mr-2" />
          添加图片
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>上传项目图片</DialogTitle>
          <DialogDescription>
            选择图片文件并上传到云端存储
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">选择图片 *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              {selectedFile && (
                <span className="text-sm text-muted-foreground">
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt-text">图片描述 (Alt) *</Label>
            <Input
              id="alt-text"
              placeholder="描述图片内容"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              disabled={uploading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">图片说明 (可选)</Label>
            <Input
              id="caption"
              placeholder="图片标题或说明"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={uploading}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
            取消
          </Button>
          <Button onClick={handleUpload} disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? '上传中...' : '上传'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
