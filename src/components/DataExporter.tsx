import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Copy, FileCode } from "lucide-react";
import { toast } from "sonner";
import { getProjectsData } from "@/lib/storage";
import type { Project } from "@/types/project";

export const DataExporter = () => {
  const [exportedCode, setExportedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const generateExportCode = async () => {
    setIsLoading(true);
    try {
      const data = await getProjectsData();
      
      if (!data || !data.projects || data.projects.length === 0) {
        toast.error("未找到项目数据");
        setIsLoading(false);
        return;
      }

      const projects = data.projects;
      
      // 检测base64图片和需要处理的图片
      const imageImports = new Set<string>();
      const imageVarMap = new Map<string, string>();
      let hasBase64Images = false;
      let base64Count = 0;
      
      // 辅助函数：检查是否为base64图片
      const isBase64Image = (url: string) => url && url.startsWith('data:image');
      
      // 辅助函数：处理图片URL
      const processImageUrl = (url: string): string => {
        if (!url) return '""';
        
        // 跳过base64图片
        if (isBase64Image(url)) {
          hasBase64Images = true;
          base64Count++;
          return '"[BASE64_IMAGE_PLACEHOLDER]"';
        }
        
        // 处理assets图片
        if (url.includes('/assets/')) {
          const match = url.match(/\/assets\/(.+?\.(jpg|jpeg|png|webp|gif))/i);
          if (match) {
            const imagePath = match[1];
            const varName = imagePath.replace(/[^a-zA-Z0-9]/g, '_').replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
            imageImports.add(`import ${varName} from "@/assets/${imagePath}";`);
            imageVarMap.set(url, varName);
            return varName;
          }
        }
        
        // 其他URL直接返回
        return `"${url.replace(/"/g, '\\"')}"`;
      };
      
      // 生成代码字符串
      let code = `import type { Project } from "@/types/project";\n\n`;
      
      // 添加图片imports
      if (imageImports.size > 0) {
        code += Array.from(imageImports).join('\n') + '\n\n';
      }
      
      code += `const defaultProjects: Project[] = [\n`;
      
      projects.forEach((project: Project, index: number) => {
        const mainImageRef = processImageUrl(project.mainImage);
        
        code += `  {\n`;
        code += `    id: ${project.id},\n`;
        code += `    title: "${project.title.replace(/"/g, '\\"')}",\n`;
        code += `    location: "${project.location.replace(/"/g, '\\"')}",\n`;
        code += `    mainImage: ${mainImageRef},\n`;
        code += `    images: [\n`;
        
        project.images.forEach((img, imgIndex) => {
          const imgUrl = processImageUrl(img.url);
          code += `      { id: '${img.id}', url: ${imgUrl}, alt: "${img.alt.replace(/"/g, '\\"')}"`;
          if (img.caption) code += `, caption: "${img.caption.replace(/"/g, '\\"')}"`;
          if (img.type) code += `, type: '${img.type}'`;
          if (img.thumbnail && !isBase64Image(img.thumbnail)) {
            code += `, thumbnail: "${img.thumbnail.replace(/"/g, '\\"')}"`;
          }
          code += ` }${imgIndex < project.images.length - 1 ? ',' : ''}\n`;
        });
        
        code += `    ],\n`;
        
        if (project.description) {
          code += `    description: "${project.description.replace(/"/g, '\\"')}",\n`;
        }
        
        code += `  }${index < projects.length - 1 ? ',' : ''}\n`;
      });
      
      code += `];\n\nexport { defaultProjects };`;
      
      setExportedCode(code);
      
      if (hasBase64Images) {
        toast.warning(`成功导出 ${projects.length} 个项目，但跳过了 ${base64Count} 个base64图片`, {
          duration: 6000
        });
      } else {
        toast.success(`成功导出 ${projects.length} 个项目数据`);
      }
    } catch (error) {
      console.error("导出数据失败:", error);
      toast.error("导出数据失败");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportedCode);
    toast.success("代码已复制到剪贴板");
  };

  const downloadAsFile = () => {
    const blob = new Blob([exportedCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'defaultProjects.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("文件已下载");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          onClick={generateExportCode}
          variant="outline"
          className="fixed bottom-4 right-4 z-50"
        >
          <FileCode className="mr-2 h-4 w-4" />
          导出项目数据
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>导出项目数据到代码</DialogTitle>
          <DialogDescription>
            将IndexedDB中的真实项目数据导出为TypeScript代码，可以复制后替换 src/hooks/useProjectData.ts 中的 defaultProjects 数组
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : exportedCode ? (
          <>
            <div className="flex gap-2 mb-4">
              <Button onClick={copyToClipboard} size="sm">
                <Copy className="mr-2 h-4 w-4" />
                复制代码
              </Button>
              <Button onClick={downloadAsFile} size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                下载为文件
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto bg-muted rounded-lg p-4">
              <pre className="text-xs">
                <code>{exportedCode}</code>
              </pre>
            </div>
            
            <div className="mt-4 p-4 bg-muted rounded-lg text-sm space-y-3">
              <div>
                <p className="font-semibold mb-2">📋 使用步骤：</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>点击"复制代码"按钮</li>
                  <li>告诉我，我会帮你更新到 useProjectData.ts 文件中</li>
                  <li>保存后刷新页面验证数据是否正确显示</li>
                </ol>
              </div>
              
              {exportedCode.includes('[BASE64_IMAGE_PLACEHOLDER]') && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                  <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-1">⚠️ 注意：检测到Base64图片</p>
                  <p className="text-xs text-muted-foreground">
                    您的项目包含base64编码的图片（已用占位符替换）。建议将这些图片保存为实际文件并上传到 src/assets/ 目录，然后在代码中使用import引用。
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            点击上方按钮开始导出数据...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
