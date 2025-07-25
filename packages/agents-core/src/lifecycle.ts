import { RunContext } from './runContext';
import type { Agent, AgentOutputType } from './agent';
import { Tool } from './tool';
import {
  RuntimeEventEmitter,
  EventEmitter,
  EventEmitterEvents,
} from './shims/shims';
import { TextOutput, UnknownContext } from './types';
import * as protocol from './types/protocol';

export abstract class EventEmitterDelegate<
  EventTypes extends EventEmitterEvents = Record<string, any[]>,
> implements EventEmitter<EventTypes>
{
  protected abstract eventEmitter: EventEmitter<EventTypes>;

  on<K extends keyof EventTypes>(
    type: K,
    listener: (...args: EventTypes[K]) => void,
  ): EventEmitter<EventTypes> {
    this.eventEmitter.on(type, listener);
    return this.eventEmitter;
  }
  off<K extends keyof EventTypes>(
    type: K,
    listener: (...args: EventTypes[K]) => void,
  ): EventEmitter<EventTypes> {
    this.eventEmitter.off(type, listener);
    return this.eventEmitter;
  }
  emit<K extends keyof EventTypes>(type: K, ...args: EventTypes[K]): boolean {
    return this.eventEmitter.emit(type, ...args);
  }
  once<K extends keyof EventTypes>(
    type: K,
    listener: (...args: EventTypes[K]) => void,
  ): EventEmitter<EventTypes> {
    this.eventEmitter.once(type, listener);
    return this.eventEmitter;
  }
}

export type AgentHookEvents<
  TContext = UnknownContext,
  TOutput extends AgentOutputType = TextOutput,
> = {
  /**
   * @param context - The context of the run
   */
  agent_start: [context: RunContext<TContext>, agent: Agent<TContext, TOutput>];
  /**
   * @param context - The context of the run
   * @param output - The output of the agent
   */
  agent_end: [context: RunContext<TContext>, output: string];
  /**
   * @param context - The context of the run
   * @param agent - The agent that is handing off
   * @param nextAgent - The next agent to run
   */
  agent_handoff: [context: RunContext<TContext>, nextAgent: Agent<any, any>];
  /**
   * @param context - The context of the run
   * @param agent - The agent that is starting a tool
   * @param tool - The tool that is starting
   */
  agent_tool_start: [
    context: RunContext<TContext>,
    tool: Tool<any>,
    details: { toolCall: protocol.ToolCallItem },
  ];
  /**
   * @param context - The context of the run
   * @param agent - The agent that is ending a tool
   * @param tool - The tool that is ending
   * @param result - The result of the tool
   */
  agent_tool_end: [
    context: RunContext<TContext>,
    tool: Tool<any>,
    result: string,
    details: { toolCall: protocol.ToolCallItem },
  ];
};

/**
 * Event emitter that every Agent instance inherits from and that emits events for the lifecycle
 * of the agent.
 */
export class AgentHooks<
  TContext = UnknownContext,
  TOutput extends AgentOutputType = TextOutput,
> extends EventEmitterDelegate<AgentHookEvents<TContext, TOutput>> {
  protected eventEmitter = new RuntimeEventEmitter<
    AgentHookEvents<TContext, TOutput>
  >();
}

export type RunHookEvents<
  TContext = UnknownContext,
  TOutput extends AgentOutputType = TextOutput,
> = {
  /**
   * @param context - The context of the run
   * @param agent - The agent that is starting
   */
  agent_start: [context: RunContext<TContext>, agent: Agent<TContext, TOutput>];
  /**
   * @param context - The context of the run
   * @param agent - The agent that is ending
   * @param output - The output of the agent
   */
  agent_end: [
    context: RunContext<TContext>,
    agent: Agent<TContext, TOutput>,
    output: string,
  ];
  /**
   * @param context - The context of the run
   * @param fromAgent - The agent that is handing off
   * @param toAgent - The next agent to run
   */
  agent_handoff: [
    context: RunContext<TContext>,
    fromAgent: Agent<any, any>,
    toAgent: Agent<any, any>,
  ];
  /**
   * @param context - The context of the run
   * @param agent - The agent that is starting a tool
   * @param tool - The tool that is starting
   */
  agent_tool_start: [
    context: RunContext<TContext>,
    agent: Agent<TContext, TOutput>,
    tool: Tool,
    details: { toolCall: protocol.ToolCallItem },
  ];
  /**
   * @param context - The context of the run
   * @param agent - The agent that is ending a tool
   * @param tool - The tool that is ending
   * @param result - The result of the tool
   */
  agent_tool_end: [
    context: RunContext<TContext>,
    agent: Agent<TContext, TOutput>,
    tool: Tool,
    result: string,
    details: { toolCall: protocol.ToolCallItem },
  ];
};

/**
 * Event emitter that every Runner instance inherits from and that emits events for the lifecycle
 * of the overall run.
 */
export class RunHooks<
  TContext = UnknownContext,
  TOutput extends AgentOutputType = TextOutput,
> extends EventEmitterDelegate<RunHookEvents<TContext, TOutput>> {
  protected eventEmitter = new RuntimeEventEmitter<
    RunHookEvents<TContext, TOutput>
  >();
}
