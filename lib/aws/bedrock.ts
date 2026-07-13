import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { BEDROCK_MODEL_ID, env, hasAws } from '@/lib/env';

let client: BedrockRuntimeClient | null = null;

function bedrock(): BedrockRuntimeClient {
  if (!client) {
    client = new BedrockRuntimeClient({
      region: env.awsRegion,
      credentials:
        env.awsAccessKeyId && env.awsSecretAccessKey
          ? {
              accessKeyId: env.awsAccessKeyId,
              secretAccessKey: env.awsSecretAccessKey,
            }
          : undefined,
    });
  }
  return client;
}

export interface InvokeOptions {
  system: string;
  user: string;
  maxTokens?: number;
  /** Seeds the assistant turn. Used to force a JSON-only response. */
  prefill?: string;
}

interface BedrockResponse {
  content: Array<{ type: string; text?: string }>;
  stop_reason: string;
}

/**
 * Invoke Claude on Bedrock and return the raw completion text.
 *
 * Bedrock's InvokeModel takes the Anthropic Messages body directly, with
 * `anthropic_version` in place of the model header. The model id itself is the
 * separate `modelId` field.
 */
export async function invoke(opts: InvokeOptions): Promise<string> {
  if (!hasAws) {
    throw new Error(
      'Bedrock is not configured. Callers must handle demo mode before invoking.',
    );
  }

  const body = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: opts.maxTokens ?? 4096,
    system: opts.system,
    messages: [
      { role: 'user', content: opts.user },
      ...(opts.prefill
        ? [{ role: 'assistant', content: opts.prefill }]
        : []),
    ],
  };

  const res = await bedrock().send(
    new InvokeModelCommand({
      modelId: BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(body),
    }),
  );

  const parsed = JSON.parse(
    new TextDecoder().decode(res.body),
  ) as BedrockResponse;

  return parsed.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('');
}

/**
 * Invoke Claude and parse a JSON object out of the response.
 *
 * The model is prefilled with `{` so the completion is a bare JSON body with
 * no preamble — the one failure mode that would otherwise break every
 * verification run is Claude opening with "Here is the analysis:".
 */
export async function invokeJson<T>(opts: InvokeOptions): Promise<T> {
  const raw = await invoke({ ...opts, prefill: '{' });
  const text = `{${raw}`;

  try {
    return JSON.parse(text) as T;
  } catch {
    // A truncated or fenced response still usually contains one complete object.
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
      return JSON.parse(text.slice(start, end + 1)) as T;
    }
    throw new Error('Bedrock returned a response that was not valid JSON.');
  }
}
