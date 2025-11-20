import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Edit3, GripVertical } from 'lucide-react';
import { ProjectImage } from '@/types/project';
import { MediaUpload } from './MediaUpload';
import { FileVideo } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProjectImageManagerProps {
  projectId: number;
  images: ProjectImage[];
  onImageAdd: (media: { 
    url: string; 
    alt: string; 
    caption?: string;
    type: 'image' | 'video';
    thumbnail?: string;
  }) => void;
  onImageRemove: (imageId: string) => void;
  onImageUpdate: (imageId: string, updates: Partial<ProjectImage>) => void;
  onReorder: (newOrder: string[]) => void;
}

interface SortableImageItemProps {
  image: ProjectImage;
  editingId: string | null;
  editingAlt: string;
  onStartEditing: (image: ProjectImage) => void;
  onSaveEdit: (imageId: string) => void;
  onCancelEdit: () => void;
  onRemove: (imageId: string) => void;
  onAltChange: (alt: string) => void;
}

const SortableImageItem: React.FC<SortableImageItemProps> = ({
  image,
  editingId,
  editingAlt,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onRemove,
  onAltChange,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 border rounded-lg bg-background"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="w-20 h-20 flex-shrink-0 relative">
        {image.type === 'video' ? (
          <>
            {image.thumbnail ? (
              <img
                src={image.thumbnail}
                alt={image.alt}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted rounded">
                <FileVideo className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded text-xs text-white">
              VIDEO
            </div>
          </>
        ) : (
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              console.error('Failed to load thumbnail:', image.url.substring(0, 50) + '...');
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        )}
      </div>

      <div className="flex-1 space-y-2">
        {editingId === image.id ? (
          <div className="space-y-2">
            <Label htmlFor={`alt-${image.id}`}>Alt Text</Label>
            <Input
              id={`alt-${image.id}`}
              value={editingAlt}
              onChange={(e) => onAltChange(e.target.value)}
              placeholder="Describe this image..."
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onSaveEdit(image.id)}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelEdit}>
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
            onClick={() => onStartEditing(image)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onRemove(image.id)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export const ProjectImageManager: React.FC<ProjectImageManagerProps> = ({
  projectId,
  images,
  onImageAdd,
  onImageRemove,
  onImageUpdate,
  onReorder,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingAlt, setEditingAlt] = React.useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      const reorderedImages = arrayMove(images, oldIndex, newIndex);
      onReorder(reorderedImages.map((img) => img.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">Project Images</h4>
        <MediaUpload projectId={projectId} onMediaAdd={onImageAdd} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-4">
            {images.map((image) => (
              <SortableImageItem
                key={image.id}
                image={image}
                editingId={editingId}
                editingAlt={editingAlt}
                onStartEditing={startEditing}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onRemove={onImageRemove}
                onAltChange={setEditingAlt}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No images added yet. Click "Add Image" to get started.</p>
        </div>
      )}
    </div>
  );
};