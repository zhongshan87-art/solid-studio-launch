import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Edit3 } from 'lucide-react';
import { ProjectImage } from '@/types/project';
import { ImageUpload } from './ImageUpload';

interface ProjectImageManagerProps {
  images: ProjectImage[];
  onImageAdd: (image: { url: string; alt: string; caption?: string }) => void;
  onImageRemove: (imageId: string) => void;
  onImageUpdate: (imageId: string, updates: Partial<ProjectImage>) => void;
}

export const ProjectImageManager: React.FC<ProjectImageManagerProps> = ({
  images,
  onImageAdd,
  onImageRemove,
  onImageUpdate,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingAlt, setEditingAlt] = React.useState('');

  const startEditing = (image: ProjectImage) => {
    setEditingId(image.id);
    setEditingAlt(image.alt);
  };

  const saveEdit = (imageId: string) => {
    onImageUpdate(imageId, { alt: editingAlt });
    setEditingId(null);
    setEditingAlt('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingAlt('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">Project Images</h4>
        <ImageUpload onImageAdd={onImageAdd} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {images.map((image) => (
          <div key={image.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-20 h-20 flex-shrink-0">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover rounded"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              {editingId === image.id ? (
                <div className="space-y-2">
                  <Label htmlFor={`alt-${image.id}`}>Alt Text</Label>
                  <Input
                    id={`alt-${image.id}`}
                    value={editingAlt}
                    onChange={(e) => setEditingAlt(e.target.value)}
                    placeholder="Describe this image..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(image.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">{image.alt}</p>
                  {image.caption && (
                    <p className="text-xs text-muted-foreground">{image.caption}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {editingId !== image.id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEditing(image)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onImageRemove(image.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No images added yet. Click "Add Image" to get started.</p>
        </div>
      )}
    </div>
  );
};