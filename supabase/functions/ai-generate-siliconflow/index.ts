
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type, model = 'Qwen/Qwen2.5-72B-Instruct' } = await req.json();

    if (!prompt) {
      throw new Error('提示文本不能为空');
    }

    const siliconflowApiKey = Deno.env.get('SILICONFLOW_API_KEY');
    if (!siliconflowApiKey) {
      throw new Error('硅基流动API密钥未配置');
    }

    console.log(`硅基流动生成请求 - 类型: ${type}, 模型: ${model}, 提示: ${prompt}`);

    if (type === 'image') {
      // 图像生成
      const imageModel = model.includes('FLUX') ? model : 'black-forest-labs/FLUX.1-schnell';
      
      const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${siliconflowApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: imageModel,
          prompt: prompt,
          image_size: '1024x1024',
          batch_size: 1,
          num_inference_steps: 20,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '图像生成失败');
      }

      const data = await response.json();
      
      return new Response(
        JSON.stringify({ 
          image: data.images[0].url,
          type: 'image' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // 文本生成
      const systemPrompt = type === 'courseware' 
        ? '你是一个专业的教学内容创作助手。请根据用户的需求生成高质量的教学内容，包括清晰的结构和实用的教学要点。'
        : type === 'video'
        ? '你是一个视频脚本创作专家。请为用户生成详细的视频脚本，包括场景描述、对话内容和视觉元素建议。'
        : type === 'document'
        ? '你是一个教学文档编写专家。请生成结构清晰、内容详实的教学文档。'
        : '你是一个教育内容创作助手。请根据用户需求生成相应的教学内容。';

      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${siliconflowApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '文本生成失败');
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content;

      return new Response(
        JSON.stringify({ 
          generatedText,
          type: 'text' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('硅基流动生成错误:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || '生成失败，请重试' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
