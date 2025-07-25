import { setDefaultModelProvider } from '@razroo/agents-core';
import { OpenAIProvider } from '@razroo/agents-openai';
import { setDefaultOpenAITracingExporter } from '@razroo/agents-openai';

setDefaultModelProvider(new OpenAIProvider());
setDefaultOpenAITracingExporter();

export * from '@razroo/agents-core';
export * from '@razroo/agents-openai';
export * as realtime from '@razroo/agents-realtime';
