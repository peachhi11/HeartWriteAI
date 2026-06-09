export {
  BRAIN_LAYERS,
  SemanticBrainService,
  activateNode,
  buildPromptContext,
  cloneCharacterBrain,
  compileSemanticBrainContextFromSeedIds,
  createBrainFromSemanticSeeds,
  decayBrain,
  normalizeCharacterBrain,
  pick,
  semanticSeedNodeToBrainNode,
  toPromptProse,
} from "./character-card/semanticBrainService";
export type {
  BrainActivation,
  BrainLayer,
  BrainLink,
  BrainSpoke,
  BrainSpokeLayers,
  BrainSpokes,
  CharacterBrain,
  CharacterBrainTraits,
  CompileSemanticBrainContextOptions,
  CreateBrainFromSemanticSeedsOptions,
  SemanticBrainInputResult,
  SemanticBrainNode,
  SemanticBrainProcessInputOptions,
  SemanticBrainPromptContext,
  SemanticBrainPromptOptions,
} from "./character-card/semanticBrainService";
export {
  JulianBrainTemplate,
  SEMANTIC_BRAIN_TEMPLATES,
  createJulianBrainTemplate,
} from "./character-card/semanticBrainTemplates";
export {
  createSemanticBrainChatTurn,
  createSemanticBrainSystemPrompt,
} from "./character-card/semanticBrainChatTurn";
export {
  SemanticMathBrainService,
} from "./character-card/semanticMathBrain";
export {
  DEFAULT_LOCAL_EMBEDDING_DIMENSIONS,
  DEFAULT_LOCAL_EMBEDDING_MODEL,
  clearLocalEmbeddingPipelineCache,
  getLocalEmbedding,
  getLocalEmbeddingPipeline,
} from "./character-card/localEmbeddingExtractor";
export {
  BRAIN_ARCHETYPE_DICTIONARY,
  SemanticNodeGenerator,
  createSemanticNodeEmbeddingText,
  isLikelyMiniLmEmbedding,
} from "./character-card/semanticNodeGenerator";
export {
  VectorMath,
} from "./character-card/vectorMath";
export type {
  GetLocalEmbeddingOptions,
  LocalEmbeddingProgress,
} from "./character-card/localEmbeddingExtractor";
export type {
  CreateSemanticBrainChatTurnOptions,
  SemanticBrainChatMessage,
  SemanticBrainChatTurnResult,
} from "./character-card/semanticBrainChatTurn";
export type {
  MathBrainSpokes,
  SemanticMathBrainInputResult,
  SemanticMathBrainMatch,
  SemanticMathBrainPromptOptions,
  SemanticMathNode,
  VectorCharacterBrain,
} from "./character-card/semanticMathBrain";
export type {
  AutoGenerateSemanticNodeOptions,
  SemanticBrainArchetypeSeed,
  SemanticNodeEmbeddingProvider,
} from "./character-card/semanticNodeGenerator";
