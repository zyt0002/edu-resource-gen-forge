
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAI = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async (prompt: string, type: string) => {
    if (!user) {
      toast.error('请先登录');
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-generate', {
        body: { prompt, type },
      });

      if (error) throw error;

      // 保存AI生成历史
      await supabase.from('ai_generations').insert({
        user_id: user.id,
        prompt,
        generation_type: type,
        result_data: data,
      });

      return data;
    } catch (error) {
      console.error('AI生成失败:', error);
      toast.error('AI生成失败，请重试');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async (prompt: string) => {
    return generateContent(prompt, 'image');
  };

  const generateText = async (prompt: string) => {
    return generateContent(prompt, 'text');
  };

  const textToSpeech = async (text: string, voice: string = 'alloy') => {
    if (!user) {
      toast.error('请先登录');
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('文本转语音失败:', error);
      toast.error('文本转语音失败，请重试');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    generateImage,
    generateText,
    textToSpeech,
    isGenerating,
  };
};
