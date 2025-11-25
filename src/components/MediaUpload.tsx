import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
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
  const [imagePath, setImagePath] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');

  const handleAdd = () => {
    if (!imagePath.trim()) {
      toast({
        title: "路径不能为空",
        description: "请输入图片路径",
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

    onMediaAdd({
      url: imagePath,
      alt: altText,
      caption: caption || altText,
      type: 'image',
    });

    toast({
      title: "图片已添加",
      description: "图片已成功添加到项目",
    });

    // Reset form
    setImagePath('');
    setAltText('');
    setCaption('');
    setOpen(false);
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
          <DialogTitle>添加本地图片</DialogTitle>
          <DialogDescription>
            请将图片文件放入 <code className="bg-muted px-1 py-0.5 rounded">public/images/projects/</code> 目录，然后输入图片路径
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="image-path">图片路径 *</Label>
            <Input
              id="image-path"
              placeholder="/images/projects/项目名/图片.jpg"
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              示例: /images/projects/jintang-otter/1.jpg
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt-text">图片描述 (Alt) *</Label>
            <Input
              id="alt-text"
              placeholder="描述图片内容"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">图片说明 (可选)</Label>
            <Input
              id="caption"
              placeholder="图片标题或说明"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleAdd}>
            添加
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
