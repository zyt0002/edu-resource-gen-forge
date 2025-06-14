
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type AIProvider = 'openai' | 'siliconflow';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  type: 'text' | 'image' | 'audio';
  description: string;
}

export const AI_MODELS: AIModel[] = [
  // OpenAI 模型
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', type: 'text', description: '快速、经济的文本生成' },
  { id: 'gpt-image-1', name: 'DALL-E 3', provider: 'openai', type: 'image', description: '高质量图像生成' },
  
  // 硅基流动模型
  { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen2.5-72B', provider: 'siliconflow', type: 'text', description: '通义千问大模型，理解能力强' },
  { id: 'deepseek-ai/DeepSeek-V2.5', name: 'DeepSeek-V2.5', provider: 'siliconflow', type: 'text', description: '推理能力强，适合复杂任务' },
  { id: 'THUDM/glm-4-9b-chat', name: 'GLM-4-9B', provider: 'siliconflow', type: 'text', description: '智谱AI模型，中文优化' },
  { id: 'black-forest-labs/FLUX.1-schnell', name: 'FLUX.1 Schnell', provider: 'siliconflow', type: 'image', description: '快速高质量图像生成' },
  { id: 'stabilityai/stable-diffusion-3-5-large', name: 'SD 3.5 Large', provider: 'siliconflow', type: 'image', description: '稳定扩散模型，细节丰富' },
];

export const useAI = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('siliconflow');
  const [selectedModel, setSelectedModel] = useState('Qwen/Qwen2.5-72B-Instruct');

  const generateContent = async (prompt: string, type: string, model?: string, provider?: AIProvider) => {
    if (!user) {
      toast.error('请先登录');
      return null;
    }

    const useProvider = provider || selectedProvider;
    const useModel = model || selectedModel;

    setIsGenerating(true);
    try {
      const functionName = useProvider === 'siliconflow' ? 'ai-generate-siliconflow' : 'ai-generate';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { prompt, type, model: useModel },
      });

      if (error) throw error;

      // 保存AI生成历史
      await supabase.from('ai_generations').insert({
        user_id: user.id,
        prompt,
        generation_type: type,
        result_data: data,
        ai_provider: useProvider,
        model_name: useModel,
      });

      return data;
    } catch (error) {
      console.error('AI生成失败:', error);
      toast.error(`${useProvider === 'siliconflow' ? '硅基流动' : 'OpenAI'}生成失败，请重试`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async (prompt: string, model?: string, provider?: AIProvider) => {
    return generateContent(prompt, 'image', model, provider);
  };

  const generateText = async (prompt: string, model?: string, provider?: AIProvider) => {
    return generateContent(prompt, 'text', model, provider);
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

  const getModelsByType = (type: 'text' | 'image' | 'audio') => {
    return AI_MODELS.filter(model => model.type === type);
  };

  const getModelsByProvider = (provider: AIProvider) => {
    return AI_MODELS.filter(model => model.provider === provider);
  };

  return {
    generateContent,
    generateImage,
    generateText,
    textToSpeech,
    isGenerating,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    getModelsByType,
    getModelsByProvider,
    AI_MODELS,
  };
};
