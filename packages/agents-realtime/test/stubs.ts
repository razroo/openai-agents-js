import {
  Agent,
  Model,
  ModelProvider,
  ModelRequest,
  ModelResponse,
  protocol,
  tool,
  Usage,
} from '@razroo/agents-core';
import { RuntimeEventEmitter } from '@razroo/agents-core/_shims';
import { EventEmitterDelegate } from '@razroo/agents-core/utils';
import { z } from '@razroo/zod/v3';
import type {
  RealtimeClientMessage,
  RealtimeSessionConfig,
  RealtimeUserInput,
} from '../src/clientMessages';
import type { RealtimeItem } from '../src/items';
import type {
  RealtimeTransportLayer,
  RealtimeTransportLayerConnectOptions,
} from '../src/transportLayer';
import type { TransportToolCallEvent } from '../src/transportLayerEvents';
import { RealtimeTransportEventTypes } from '../src/transportLayerEvents';

export const TEST_MODEL_MESSAGE: protocol.AssistantMessageItem = {
  id: '123',
  status: 'completed' as const,
  type: 'message' as const,
  role: 'assistant' as const,
  content: [
    {
      type: 'output_text' as const,
      text: 'Hello World',
      providerData: {
        annotations: [],
      },
    },
  ],
};

export function fakeModelMessage(text: string): protocol.AssistantMessageItem {
  return {
    ...TEST_MODEL_MESSAGE,
    content: [
      {
        type: 'output_text' as const,
        text,
        providerData: {
          annotations: [],
        },
      },
    ],
  };
}

export const TEST_MODEL_FUNCTION_CALL: protocol.FunctionCallItem = {
  id: '123',
  type: 'function_call' as const,
  name: 'test',
  callId: '123',
  status: 'completed',
  arguments: '{"test": "test"}',
};

export const TEST_MODEL_RESPONSE_WITH_FUNCTION: ModelResponse = {
  output: [{ ...TEST_MODEL_FUNCTION_CALL }, { ...TEST_MODEL_MESSAGE }],
  usage: new Usage(),
};

export const TEST_MODEL_RESPONSE_BASIC: ModelResponse = {
  output: [{ ...TEST_MODEL_MESSAGE }],
  usage: new Usage(),
};

export const TEST_AGENT = new Agent({
  name: 'TestAgent',
  instructions: 'Test instructions',
  handoffDescription: 'Test handoff description',
  handoffs: [],
  model: 'gpt-4o',
  modelSettings: {
    temperature: 0.5,
    maxTokens: 100,
  },
});

export const TEST_TOOL = tool({
  name: 'test',
  description: 'Test tool',
  parameters: z.object({
    test: z.string(),
  }),
  execute: async (_input: any) => {
    return 'Hello World';
  },
});

export class FakeModel implements Model {
  constructor(private _responses: ModelResponse[] = []) {}

  async getResponse(_request: ModelRequest): Promise<ModelResponse> {
    const response = this._responses.shift();
    if (!response) {
      throw new Error('No response found');
    }
    return response;
  }

  /* eslint-disable require-yield */
  async *getStreamedResponse(
    _request: ModelRequest,
  ): AsyncIterable<protocol.StreamEvent> {
    throw new Error('Not implemented');
  }
}

export class FakeModelProvider implements ModelProvider {
  async getModel(_name: string): Promise<Model> {
    return new FakeModel([TEST_MODEL_RESPONSE_BASIC]);
  }
}

export class FakeTransport
  extends EventEmitterDelegate<RealtimeTransportEventTypes>
  implements RealtimeTransportLayer
{
  status: 'connected' | 'disconnected' | 'connecting' | 'disconnecting' =
    'disconnected';
  muted: boolean = false;
  connectCalls: RealtimeTransportLayerConnectOptions[] = [];
  sendEventCalls: RealtimeClientMessage[] = [];
  sendMessageCalls: [RealtimeUserInput, Record<string, any>][] = [];
  sendAudioCalls: [ArrayBuffer, { commit?: boolean }][] = [];
  updateSessionConfigCalls: Partial<RealtimeSessionConfig>[] = [];
  closeCalls = 0;
  eventEmitter = new RuntimeEventEmitter<RealtimeTransportEventTypes>();
  muteCalls: boolean[] = [];
  sendFunctionCallOutputCalls: [TransportToolCallEvent, string, boolean][] = [];
  interruptCalls = 0;
  resetHistoryCalls: [RealtimeItem[], RealtimeItem[]][] = [];

  async connect(options: RealtimeTransportLayerConnectOptions): Promise<void> {
    this.connectCalls.push(options);
  }

  sendEvent(event: RealtimeClientMessage): void {
    this.sendEventCalls.push(event);
  }

  sendMessage(
    message: RealtimeUserInput,
    otherEventData: Record<string, any>,
  ): void {
    this.sendMessageCalls.push([message, otherEventData]);
  }

  sendAudio(audio: ArrayBuffer, options: { commit?: boolean }): void {
    this.sendAudioCalls.push([audio, options]);
  }

  updateSessionConfig(config: Partial<RealtimeSessionConfig>): void {
    this.updateSessionConfigCalls.push(config);
  }

  close(): void {
    this.closeCalls += 1;
  }

  mute(muted: boolean): void {
    this.muted = muted;
    this.muteCalls.push(muted);
  }

  sendFunctionCallOutput(
    toolCall: TransportToolCallEvent,
    output: string,
    startResponse: boolean,
  ): void {
    this.sendFunctionCallOutputCalls.push([toolCall, output, startResponse]);
  }

  interrupt(): void {
    this.interruptCalls += 1;
  }

  resetHistory(oldHistory: RealtimeItem[], newHistory: RealtimeItem[]): void {
    this.resetHistoryCalls.push([oldHistory, newHistory]);
  }
}
