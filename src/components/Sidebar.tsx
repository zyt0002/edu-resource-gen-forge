
import React from 'react';
import { Home, Plus, FolderOpen, BarChart3, BookOpen, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: '工作台', icon: Home },
  { id: 'create', label: '创建资源', icon: Plus },
  { id: 'manage', label: '资源管理', icon: FolderOpen },
  { id: 'analytics', label: '数据分析', icon: BarChart3 },
  { id: 'templates', label: '模板库', icon: BookOpen },
  { id: 'collaboration', label: '协作空间', icon: Users },
  { id: 'settings', label: '系统设置', icon: Settings },
];

export const Sidebar = ({ isOpen, activeSection, onSectionChange }: SidebarProps) => {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/90 backdrop-blur-sm border-r border-gray-200 transition-all duration-300 z-40",
        isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
      )}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                  activeSection === item.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
