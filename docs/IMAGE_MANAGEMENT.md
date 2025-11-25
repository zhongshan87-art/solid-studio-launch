# 图片管理指南（混合模式）

本项目支持两种图片管理方式：

1. **在 Lovable 中编辑**：使用云端存储，实时上传和预览
2. **下载到本地**：导出为完全本地化的项目，脱离云端依赖

---

## 🌐 在 Lovable 中使用（云端模式）

### 特点
- ✅ 实时上传图片到云端存储
- ✅ 即时预览效果
- ✅ 团队协作友好
- ✅ 自动备份

### 如何使用

1. **上传图片**
   - 在项目详情页点击"添加图片"
   - 选择本地图片文件
   - 填写图片描述（Alt）和说明
   - 点击"上传"，图片会自动上传到云端

2. **管理图片**
   - 按 `Ctrl+E` 进入编辑模式
   - 可以编辑图片信息、重新排序、删除图片
   - 所有更改自动保存到云端

3. **预览效果**
   - 在 Lovable 预览窗口实时查看
   - 支持拖拽排序
   - 支持批量管理

---

## 💾 导出为本地项目

### 何时使用本地模式？
- 需要完全脱离云端部署
- 想要完全控制图片文件
- 部署到不支持云端存储的环境
- 希望减少云端依赖

### 导出步骤

1. **在 Lovable 中点击"导出为本地项目"**
   - 位置：`/works` 页面顶部
   - 系统会自动下载所有云端图片
   - 生成更新后的代码
   - 打包成 ZIP 文件

2. **导出内容**
   ```
   lovable-project-export-xxxxx.zip
   ├── public/images/projects/     # 所有项目图片
   │   ├── jintang-otter/
   │   │   ├── main.jpg
   │   │   ├── 1.jpg
   │   │   └── 2.jpg
   │   └── ...
   ├── src/hooks/useProjectData.ts # 更新后的代码
   └── README.md                   # 导出说明
   ```

3. **使用导出的文件**
   ```bash
   # 1. 解压下载的 ZIP 文件
   unzip lovable-project-export-xxxxx.zip
   
   # 2. 复制图片文件夹到项目
   cp -r public/images/projects/* your-project/public/images/projects/
   
   # 3. 替换代码文件
   cp src/hooks/useProjectData.ts your-project/src/hooks/useProjectData.ts
   
   # 4. 运行项目
   cd your-project
   npm run dev
   ```

---

## 📁 本地项目的图片目录结构

导出后的本地项目使用以下目录结构：

```
public/
  images/
    projects/
      jintang-otter/          # 金塘水獭科普馆
        main.jpg              # 项目主图
        1.jpg                 # 详情图1
        2.jpg                 # 详情图2
        3.jpg                 # 详情图3
      futian/                 # 聚落浮田
        main.jpg
        1.jpg
        2.jpg
      mountain/               # 探索山岭
        main.jpg
        1.jpg
        2.jpg
      buzzing/                # 听，有嗡嗡声
        main.jpg
        1.jpg
        2.jpg
      yishi-yiyuan/           # 一室亦园
        main.jpg
        1.jpg
        2.jpg
      shicang/                # 食仓
        main.jpg
        1.jpg
        2.jpg
      kindergarten/           # 幼儿园
        main.jpg
        1.jpg
      liba/                   # 篱笆
        main.jpg
        1.jpg
      shouyi/                 # 手艺之家
        main.jpg
        1.jpg
      shuangpeng/             # 双棚
        main.jpg
        1.jpg
      rouhe/                  # 柔和过渡
        main.jpg
        1.jpg
      qingsong/               # 青松住宅
        main.jpg
        1.jpg
      guangying/              # 光影梧桐
        main.jpg
        1.jpg
      xiaohua/                # 小花野美
        main.jpg
        1.jpg
      fengqi/                 # 风栖·雪筑
        main.jpg
        1.jpg
```

---

## 📝 命名规范

### 文件夹命名
- 使用**拼音小写**或**英文**
- 多个单词用 `-` 连接
- 例如：`jintang-otter`, `futian`, `mountain`

### 图片文件命名
- **主图**：固定命名为 `main.jpg`
- **详情图**：按顺序命名 `1.jpg`, `2.jpg`, `3.jpg`, ...

### 支持的图片格式
- JPG / JPEG (推荐)
- PNG
- WebP

---

## 🖼️ 图片优化建议

### 尺寸建议
- **主图 (main.jpg)**：建议 1920x1080 或 2560x1440
- **详情图**：建议 1280x720 至 1920x1080

### 文件大小
- 主图：< 500KB
- 详情图：< 300KB

### 优化工具
推荐使用以下工具压缩图片：
- [TinyPNG](https://tinypng.com/) - 在线压缩
- [ImageOptim](https://imageoptim.com/) - Mac 应用
- [Squoosh](https://squoosh.app/) - Google 在线工具

---

## ⚠️ 注意事项

### 在 Lovable 云端模式下
1. 图片会自动上传到云端存储
2. URL 格式为：`https://...supabase.co/storage/v1/object/public/...`
3. 无需手动管理文件路径

### 在本地部署模式下
1. **图片路径**必须以 `/images/` 开头（不是 `public/images/`）
2. 文件夹和文件名**区分大小写**
3. **避免使用中文**命名文件夹和文件
4. 提交代码前确保图片文件已添加到 Git

---

## 🔄 切换模式

### 从云端模式切换到本地模式
1. 点击"导出为本地项目"按钮
2. 下载生成的 ZIP 文件
3. 解压并按说明部署

### 从本地模式切换到云端模式
⚠️ **不推荐** - 需要手动上传所有图片到云端存储

---

## 🆘 常见问题

### Q: 在 Lovable 中图片不显示怎么办？
1. 检查是否成功上传（查看控制台日志）
2. 确认 Supabase Storage bucket 权限正确
3. 尝试重新上传图片

### Q: 导出后的本地项目图片不显示？
1. 检查 `public/images/projects/` 文件夹是否存在
2. 确认图片文件已正确复制
3. 检查文件名大小写是否匹配
4. 刷新浏览器缓存（Ctrl+F5 / Cmd+Shift+R）

### Q: 可以同时使用云端和本地图片吗？
可以！`useProjectData.ts` 会自动识别 URL 类型：
- 云端 URL（以 `https://` 开头）直接使用
- 本地路径（以 `/images/` 开头）从 public 文件夹加载

### Q: 导出需要多长时间？
取决于图片数量和大小，通常每张图片需要 1-3 秒下载时间。

---

## 📚 相关文件

- **项目数据定义**：`src/hooks/useProjectData.ts`
- **图片上传组件**：`src/components/MediaUpload.tsx`
- **图片管理组件**：`src/components/ProjectImageManager.tsx`
- **项目导出组件**：`src/components/ProjectExporter.tsx`
- **项目类型定义**：`src/types/project.ts`

---

如有问题，请查看代码注释或联系开发团队。
