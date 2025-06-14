
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, Download, Share, Edit, Trash2, Eye, Calendar } from 'lucide-react';

export const ResourceManager = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const resources = [
    {
      id: 1,
      title: '机器学习基础课件',
      type: '课件',
      category: '计算机科学',
      date: '2024-01-15',
      status: '已发布',
      downloads: 245,
      thumbnail: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Python编程入门视频',
      type: '视频',
      category: '编程语言',
      date: '2024-01-14',
      status: '草稿',
      downloads: 89,
      thumbnail: '/placeholder.svg'
    },
    {
      id: 3,
      title: '数据结构图解',
      type: '图像',
      category: '计算机科学',
      date: '2024-01-13',
      status: '已发布',
      downloads: 156,
      thumbnail: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Web开发实战案例',
      type: '课件',
      category: 'Web开发',
      date: '2024-01-12',
      status: '已发布',
      downloads: 321,
      thumbnail: '/placeholder.svg'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已发布':
        return 'bg-green-100 text-green-800';
      case '草稿':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '课件':
        return 'bg-blue-100 text-blue-800';
      case '视频':
        return 'bg-purple-100 text-purple-800';
      case '图像':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="courseware">课件</SelectItem>
                <SelectItem value="video">视频</SelectItem>
                <SelectItem value="image">图像</SelectItem>
                <SelectItem value="audio">音频</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
        </div>
      </Card>

      {/* Resources Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="p-4 hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-gray-400 text-4xl">📄</div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
                
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(resource.type)} variant="secondary">
                    {resource.type}
                  </Badge>
                  <Badge className={getStatusColor(resource.status)} variant="secondary">
                    {resource.status}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {resource.date}
                </div>
                
                <div className="text-sm text-gray-500">
                  下载次数: {resource.downloads}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y">
            {resources.map((resource) => (
              <div key={resource.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">📄</span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(resource.type)} variant="secondary">
                        {resource.type}
                      </Badge>
                      <Badge className={getStatusColor(resource.status)} variant="secondary">
                        {resource.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{resource.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {resource.date}
                  </div>
                  <div className="text-sm text-gray-500">
                    {resource.downloads} 下载
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
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
