import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Video, Image, Mic, Upload, Sparkles, Play, Download, Save } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { AIModelSelector } from '@/components/AIModelSelector';
import { useResourceManager } from '@/hooks/useResourceManager';
import { useCategories } from '@/hooks/useCategories';
import { useAI, AIProvider } from '@/hooks/useAI';
import { toast } from 'sonner';

export const ResourceCreator = () => {
  const [selectedType, setSelectedType] = useState<'courseware' | 'video' | 'image' | 'audio' | 'document'>('courseware');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState('');
  const [currentProvider, setCurrentProvider] = useState<AIProvider>('siliconflow');

  const { createResource, uploadFile, isCreating } = useResourceManager();
  const { categories } = useCategories();
  const { generateText, generateImage, textToSpeech, isGenerating } = useAI();

  const resourceTypes = [
    { id: 'courseware' as const, label: '课件制作', icon: FileText, description: '生成PPT课件和教学大纲' },
    { id: 'video' as const, label: '视频内容', icon: Video, description: '创建教学视频和动画' },
    { id: 'image' as const, label: '图像资源', icon: Image, description: '制作图表、插画和海报' },
    { id: 'audio' as const, label: '音频内容', icon: Mic, description: '生成音频讲解和音效' },
    { id: 'document' as const, label: '文档资料', icon: FileText, description: '创建教学文档和资料' },
  ];

  const handleModelChange = (model: string, provider: AIProvider) => {
    setCurrentModel(model);
    setCurrentProvider(provider);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('请输入生成提示');
      return;
    }

    try {
      if (selectedType === 'image') {
        const result = await generateImage(prompt, currentModel, currentProvider);
        if (result?.image) {
          setGeneratedContent(result.image);
        }
      } else if (selectedType === 'audio') {
        const result = await textToSpeech(prompt);
        if (result?.audioContent) {
          setGeneratedAudio(`data:audio/mp3;base64,${result.audioContent}`);
        }
      } else {
        const result = await generateText(prompt, currentModel, currentProvider);
        if (result?.generatedText) {
          setGeneratedContent(result.generatedText);
        }
      }
    } catch (error) {
      console.error('生成失败:', error);
      toast.error('生成失败，请重试');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('请输入资源标题');
      return;
    }

    try {
      let filePath = null;
      let fileSize = null;
      let fileType = null;

      // 如果有文件，先上传
      if (selectedFile) {
        const uploadResult = await uploadFile(selectedFile);
        filePath = uploadResult.path;
        fileSize = uploadResult.size;
        fileType = uploadResult.type;
      }

      // 创建资源
      createResource({
        title,
        description: description || null,
        content: generatedContent || null,
        type: selectedType,
        category_id: selectedCategoryId || null,
        file_path: filePath,
        file_size: fileSize,
        file_type: fileType,
      });

      // 重置表单
      setTitle('');
      setDescription('');
      setPrompt('');
      setGeneratedContent('');
      setGeneratedAudio(null);
      setSelectedFile(null);
      setSelectedCategoryId('');
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败，请重试');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">创建教学资源</h2>
        <div className="flex space-x-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            AI 驱动
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-700">
            多模型支持
          </Badge>
        </div>
      </div>

      {/* 基本信息 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              资源标题 *
            </label>
            <Input
              placeholder="请输入资源标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            资源描述
          </label>
          <Textarea
            placeholder="描述资源的用途和特点..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </Card>

      {/* Resource Type Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">选择资源类型</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {resourceTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-8 w-8 mb-3 ${selectedType === type.id ? 'text-blue-500' : 'text-gray-600'}`} />
                <h4 className="font-medium text-gray-900 mb-1">{type.label}</h4>
                <p className="text-sm text-gray-600">{type.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Content Creation Interface */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">内容输入</h3>
          
          <Tabs defaultValue="ai" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai">AI 生成</TabsTrigger>
              <TabsTrigger value="file">文件上传</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="space-y-4">
              {/* AI模型选择器 */}
              <AIModelSelector 
                type={selectedType === 'image' ? 'image' : selectedType === 'audio' ? 'audio' : 'text'}
                onModelChange={handleModelChange}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生成提示
                </label>
                <Textarea 
                  placeholder={
                    selectedType === 'image' 
                      ? "描述您想要生成的图像，例如：一个关于机器学习的信息图表..."
                      : selectedType === 'audio'
                      ? "输入要转换为语音的文本内容..."
                      : "描述您想要创建的教学内容，包括目标受众、知识点等..."
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                />
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    AI 正在生成...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    开始生成
                  </>
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4">
              <FileUpload
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                onRemoveFile={() => setSelectedFile(null)}
              />
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">生成预览</h3>
          
          {generatedContent || generatedAudio ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                {selectedType === 'image' && generatedContent ? (
                  <img src={generatedContent} alt="生成的图像" className="max-w-full h-auto rounded" />
                ) : selectedType === 'audio' && generatedAudio ? (
                  <div className="text-center">
                    <audio controls className="w-full">
                      <source src={generatedAudio} type="audio/mpeg" />
                      您的浏览器不支持音频播放。
                    </audio>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-gray-800">{generatedContent}</div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  预览
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  下载
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>AI 生成的内容将在这里显示</p>
            </div>
          )}
        </Card>
      </div>

      {/* 保存按钮 */}
      <Card className="p-6">
        <div className="flex justify-end space-x-4">
          <Button
            onClick={handleSave}
            disabled={isCreating || !title.trim()}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {isCreating ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存资源
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
