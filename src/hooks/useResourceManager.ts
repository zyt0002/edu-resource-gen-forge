
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  type: 'courseware' | 'video' | 'image' | 'audio' | 'document';
  status: 'draft' | 'published' | 'archived';
  category_id: string | null;
  file_path: string | null;
  file_size: number | null;
  file_type: string | null;
  thumbnail_url: string | null;
  download_count: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
  };
}

export const useResourceManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 获取资源列表
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Resource[];
    },
    enabled: !!user,
  });

  // 创建资源
  const createResourceMutation = useMutation({
    mutationFn: async (resourceData: {
      title: string;
      description?: string;
      content?: string;
      type: Resource['type'];
      category_id?: string;
      file_path?: string;
      file_size?: number;
      file_type?: string;
    }) => {
      if (!user) throw new Error('用户未登录');

      const { data, error } = await supabase
        .from('resources')
        .insert({
          ...resourceData,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('资源创建成功！');
    },
    onError: (error) => {
      console.error('创建资源失败:', error);
      toast.error('创建资源失败，请重试');
    },
  });

  // 更新资源
  const updateResourceMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Resource> & { id: string }) => {
      const { data, error } = await supabase
        .from('resources')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('资源更新成功！');
    },
    onError: (error) => {
      console.error('更新资源失败:', error);
      toast.error('更新资源失败，请重试');
    },
  });

  // 删除资源
  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('资源删除成功！');
    },
    onError: (error) => {
      console.error('删除资源失败:', error);
      toast.error('删除资源失败，请重试');
    },
  });

  // 文件上传
  const uploadFile = async (file: File, bucket: string = 'resources') => {
    if (!user) throw new Error('用户未登录');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      path: data.path,
      url: publicUrl,
      size: file.size,
      type: file.type,
    };
  };

  return {
    resources,
    isLoading,
    createResource: createResourceMutation.mutate,
    updateResource: updateResourceMutation.mutate,
    deleteResource: deleteResourceMutation.mutate,
    uploadFile,
    isCreating: createResourceMutation.isPending,
    isUpdating: updateResourceMutation.isPending,
    isDeleting: deleteResourceMutation.isPending,
  };
};
