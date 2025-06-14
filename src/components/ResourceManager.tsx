
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, Download, Share, Edit, Trash2, Eye, Calendar, AlertCircle } from 'lucide-react';
import { useResourceManager, Resource } from '@/hooks/useResourceManager';
import { useCategories } from '@/hooks/useCategories';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const ResourceManager = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { resources, isLoading, deleteResource, updateResource, isDeleting } = useResourceManager();
  const { categories } = useCategories();

  // 过滤资源
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         false;
    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'archived':
        return '已归档';
      default:
        return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'courseware':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'image':
        return 'bg-orange-100 text-orange-800';
      case 'audio':
        return 'bg-green-100 text-green-800';
      case 'document':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'courseware':
        return '课件';
      case 'video':
        return '视频';
      case 'image':
        return '图像';
      case 'audio':
        return '音频';
      case 'document':
        return '文档';
      default:
        return type;
    }
  };

  const handlePublish = (resource: Resource) => {
    updateResource({
      id: resource.id,
      status: resource.status === 'published' ? 'draft' : 'published',
    });
  };

  const handleDelete = (id: string) => {
    deleteResource(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">加载资源中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">资源管理</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索资源..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="courseware">课件</SelectItem>
                <SelectItem value="video">视频</SelectItem>
                <SelectItem value="image">图像</SelectItem>
                <SelectItem value="audio">音频</SelectItem>
                <SelectItem value="document">文档</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="archived">已归档</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {filteredResources.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                ? '未找到匹配的资源' 
                : '还没有创建任何资源'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? '请尝试调整搜索条件或筛选器'
                : '开始创建您的第一个教学资源'}
            </p>
          </div>
        </Card>
      ) : (
        /* Resources Grid/List */
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="p-4 hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {resource.thumbnail_url ? (
                    <img 
                      src={resource.thumbnail_url} 
                      alt={resource.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">
                      {resource.type === 'image' ? '🖼️' : 
                       resource.type === 'video' ? '🎥' : 
                       resource.type === 'audio' ? '🎵' : '📄'}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 truncate" title={resource.title}>
                    {resource.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getTypeColor(resource.type)} variant="secondary">
                      {getTypeText(resource.type)}
                    </Badge>
                    <Badge className={getStatusColor(resource.status)} variant="secondary">
                      {getStatusText(resource.status)}
                    </Badge>
                  </div>
                  
                  {resource.categories && (
                    <p className="text-sm text-gray-600 truncate">
                      {resource.categories.name}
                    </p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(resource.created_at)}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    下载: {resource.download_count} 次
                    {resource.file_size && (
                      <span className="ml-2">大小: {formatFileSize(resource.file_size)}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" title="预览">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="编辑">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="分享">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handlePublish(resource)}
                        title={resource.status === 'published' ? '取消发布' : '发布'}
                      >
                        {resource.status === 'published' ? '📤' : '📥'}
                      </Button>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" title="删除">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            您确定要删除资源 "{resource.title}" 吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(resource.id)}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting ? '删除中...' : '删除'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="divide-y">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">
                        {resource.type === 'image' ? '🖼️' : 
                         resource.type === 'video' ? '🎥' : 
                         resource.type === 'audio' ? '🎵' : '📄'}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTypeColor(resource.type)} variant="secondary">
                          {getTypeText(resource.type)}
                        </Badge>
                        <Badge className={getStatusColor(resource.status)} variant="secondary">
                          {getStatusText(resource.status)}
                        </Badge>
                        {resource.categories && (
                          <span className="text-sm text-gray-500">{resource.categories.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      {formatDate(resource.created_at)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {resource.download_count} 下载
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handlePublish(resource)}
                      >
                        {resource.status === 'published' ? '📤' : '📥'}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认删除</AlertDialogTitle>
                            <AlertDialogDescription>
                              您确定要删除资源 "{resource.title}" 吗？此操作无法撤销。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(resource.id)}
                              disabled={isDeleting}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {isDeleting ? '删除中...' : '删除'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      )}
    </div>
  );
};
