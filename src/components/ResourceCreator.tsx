
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Video, Image, Mic, Upload, Sparkles, Play, Download } from 'lucide-react';

export const ResourceCreator = () => {
  const [selectedType, setSelectedType] = useState('courseware');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const resourceTypes = [
    { id: 'courseware', label: '课件制作', icon: FileText, description: '生成PPT课件和教学大纲' },
    { id: 'video', label: '视频内容', icon: Video, description: '创建教学视频和动画' },
    { id: 'image', label: '图像资源', icon: Image, description: '制作图表、插画和海报' },
    { id: 'audio', label: '音频内容', icon: Mic, description: '生成音频讲解和音效' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent('这是AI生成的教学内容示例...');
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">创建教学资源</h2>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          AI 驱动
        </Badge>
      </div>

      {/* Resource Type Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">选择资源类型</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          
          <Tabs defaultValue="text" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">文本输入</TabsTrigger>
              <TabsTrigger value="voice">语音输入</TabsTrigger>
              <TabsTrigger value="file">文件上传</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  教学主题
                </label>
                <Input placeholder="例如：机器学习基础概念" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  详细描述
                </label>
                <Textarea 
                  placeholder="描述您想要创建的教学内容，包括目标受众、知识点等..."
                  rows={6}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  关键词标签
                </label>
                <Input placeholder="用逗号分隔，例如：算法,数据结构,编程" />
              </div>
            </TabsContent>
            
            <TabsContent value="voice" className="space-y-4">
              <div className="text-center py-8">
                <Mic className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">点击开始录音，描述您的教学需求</p>
                <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                  <Mic className="h-4 w-4 mr-2" />
                  开始录音
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  拖拽文件到此处或点击上传
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  支持 PDF、DOC、PPT、TXT 等格式
                </p>
                <Button variant="outline">选择文件</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
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
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">生成预览</h3>
          
          {generatedContent ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                <p className="text-gray-800">{generatedContent}</p>
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
                <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600">
                  保存资源
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
    </div>
  );
};
