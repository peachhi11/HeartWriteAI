export const DEFAULT_LOCAL_EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
export const DEFAULT_LOCAL_EMBEDDING_DIMENSIONS = 384;

export interface LocalEmbeddingProgress {
  file?: string;
  loaded?: number;
  progress?: number;
  status?: string;
  total?: number;
}

export interface GetLocalEmbeddingOptions {
  model?: string;
  onProgress?: (progress: LocalEmbeddingProgress) => void;
}

type FeatureExtractionPipeline = (
  text: string,
  options: { normalize: boolean; pooling: "mean" },
) => Promise<unknown>;

const embeddingPipelinePromises = new Map<string, Promise<FeatureExtractionPipeline>>();

export async function getLocalEmbedding(
  text: string,
  options: GetLocalEmbeddingOptions = {},
): Promise<number[]> {
  const extractor = await getLocalEmbeddingPipeline(options);
  const output = await extractor(text, {
    normalize: true,
    pooling: "mean",
  });
  const data = readTensorData(output);

  return Array.from(data);
}

export async function getLocalEmbeddingPipeline(
  options: GetLocalEmbeddingOptions = {},
): Promise<FeatureExtractionPipeline> {
  const model = options.model ?? DEFAULT_LOCAL_EMBEDDING_MODEL;
  const cachedPipeline = embeddingPipelinePromises.get(model);

  if (cachedPipeline) {
    return cachedPipeline;
  }

  const pipelinePromise = import("@huggingface/transformers").then(
    async ({ pipeline }) =>
      pipeline("feature-extraction", model, {
        progress_callback: options.onProgress
          ? (progress: unknown) => options.onProgress?.(readProgress(progress))
          : undefined,
      }) as Promise<FeatureExtractionPipeline>,
  );

  embeddingPipelinePromises.set(model, pipelinePromise);
  return pipelinePromise;
}

export function clearLocalEmbeddingPipelineCache(): void {
  embeddingPipelinePromises.clear();
}

function readTensorData(output: unknown): Float32Array | number[] {
  if (
    output &&
    typeof output === "object" &&
    "data" in output &&
    isNumericArrayLike((output as { data: unknown }).data)
  ) {
    return (output as { data: Float32Array | number[] }).data;
  }

  throw new Error("Local embedding pipeline returned an unreadable tensor.");
}

function readProgress(progress: unknown): LocalEmbeddingProgress {
  if (!progress || typeof progress !== "object") {
    return {};
  }

  const record = progress as Record<string, unknown>;

  return {
    file: readString(record.file),
    loaded: readNumber(record.loaded),
    progress: readNumber(record.progress),
    status: readString(record.status),
    total: readNumber(record.total),
  };
}

function isNumericArrayLike(value: unknown): value is Float32Array | number[] {
  return (
    value instanceof Float32Array ||
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
