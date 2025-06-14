
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAI, AIProvider } from '@/hooks/useAI';

interface AIModelSelectorProps {
  type: 'text' | 'image' | 'audio';
  onModelChange?: (model: string, provider: AIProvider) => void;
}

export const AIModelSelector: React.FC<AIModelSelectorProps> = ({ type, onModelChange }) => {
  const { 
    selectedProvider, 
    setSelectedProvider, 
    selectedModel, 
    setSelectedModel, 
    getModelsByType 
  } = useAI();

  const availableModels = getModelsByType(type);

  const handleProviderChange = (provider: AIProvider) => {
    setSelectedProvider(provider);
    const firstModelOfProvider = availableModels.find(m => m.provider === provider);
    if (firstModelOfProvider) {
      setSelectedModel(firstModelOfProvider.id);
      onModelChange?.(firstModelOfProvider.id, provider);
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    const model = availableModels.find(m => m.id === modelId);
    if (model) {
      onModelChange?.(modelId, model.provider);
    }
  };

  const currentModel = availableModels.find(m => m.id === selectedModel);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI 服务商
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleProviderChange('siliconflow')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedProvider === 'siliconflow'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            硅基流动
          </button>
          <button
            onClick={() => handleProviderChange('openai')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedProvider === 'openai'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            OpenAI
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择模型
        </label>
        <Select value={selectedModel} onValueChange={handleModelChange}>
          <SelectTrigger>
            <SelectValue placeholder="选择AI模型" />
          </SelectTrigger>
          <SelectContent>
            {availableModels
              .filter(model => model.provider === selectedProvider)
              .map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{model.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {model.provider === 'siliconflow' ? '硅基' : 'OpenAI'}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        
        {currentModel && (
          <p className="text-sm text-gray-600 mt-1">
            {currentModel.description}
          </p>
        )}
      </div>
    </div>
  );
};
