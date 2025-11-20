import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { uploadMediaToSupabase } from '@/lib/uploadImage';

interface MediaUploadProps {
  onMediaAdd: (media: { 
    url: string; 
    alt: string; 
    caption?: string;
    type: 'image' | 'video';
    thumbnail?: string;
  }) => void;
  className?: string;
  projectId: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaAdd, className, projectId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const generateVideoThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;
      video.currentTime = 1;

      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };

      video.onerror = () => reject(new Error('Failed to load video'));
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const file = files[0];
      
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        toast({
          title: "Invalid file type",
          description: "Please select an image (JPG, PNG, GIF, WebP) or video (MP4, WebM, MOV) file.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `Please select a ${isImage ? 'image' : 'video'} smaller than ${maxSize / (1024 * 1024)}MB.`,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // 上传到 Supabase Storage
      const uploadResult = await uploadMediaToSupabase(file, projectId);
      
      if (uploadResult.error) {
        toast({
          title: "Upload failed",
          description: uploadResult.error,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      const mediaType = isImage ? 'image' : 'video';
      let thumbnail: string | undefined;
      
      // 如果是视频，生成缩略图并上传
      if (isVideo) {
        try {
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          
          const thumbnailDataUrl = await generateVideoThumbnail(dataUrl);
          
          // 将缩略图转换为 Blob 并上传
          const thumbnailBlob = await fetch(thumbnailDataUrl).then(r => r.blob());
          const thumbnailFile = new File([thumbnailBlob], `${file.name}-thumb.jpg`, { type: 'image/jpeg' });
          const thumbnailResult = await uploadMediaToSupabase(thumbnailFile, projectId);
          
          if (!thumbnailResult.error) {
            thumbnail = thumbnailResult.url;
          }
        } catch (error) {
          console.warn('Failed to generate video thumbnail:', error);
        }
      }
      
      onMediaAdd({
        url: uploadResult.url,
        alt: file.name.split('.')[0],
        caption: file.name,
        type: mediaType,
        thumbnail,
      });

      toast({
        title: `${mediaType === 'image' ? 'Image' : 'Video'} uploaded`,
        description: `${mediaType === 'image' ? 'Image' : 'Video'} has been saved to cloud storage.`,
      });

      setUploading(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
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
        accept="image/*,video/mp4,video/webm,video/quicktime"
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
        {uploading ? "Uploading..." : "Add Image/Video"}
      </Button>
    </div>
  );
};
