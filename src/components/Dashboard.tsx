
import React from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, FileText, Video, Image, TrendingUp, Clock } from 'lucide-react';

export const Dashboard = () => {
  const stats = [
    { title: '总资源数', value: '1,234', icon: BookOpen, color: 'bg-blue-500' },
    { title: '课件数量', value: '456', icon: FileText, color: 'bg-green-500' },
    { title: '视频资源', value: '123', icon: Video, color: 'bg-purple-500' },
    { title: '图像资源', value: '789', icon: Image, color: 'bg-orange-500' },
  ];

  const recentActivities = [
    { title: '创建了新课件：《机器学习基础》', time: '2小时前', type: 'create' },
    { title: '更新了练习题：《数据结构与算法》', time: '4小时前', type: 'update' },
    { title: '生成了教学视频：《Python编程入门》', time: '6小时前', type: 'generate' },
    { title: '分享了资源：《Web开发实战》', time: '1天前', type: 'share' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">工作台</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>最后更新：刚刚</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">创建课件</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
              <Video className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">生成视频</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
              <Image className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">制作图像</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">数据分析</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
