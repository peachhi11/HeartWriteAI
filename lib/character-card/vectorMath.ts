export class VectorMath {
  static cosineSimilarity(vecA: readonly number[], vecB: readonly number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) {
      throw new Error("Vectors must be of equal, non-zero length for spatial math.");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let index = 0; index < vecA.length; index += 1) {
      const valueA = vecA[index] ?? 0;
      const valueB = vecB[index] ?? 0;

      dotProduct += valueA * valueB;
      normA += valueA * valueA;
      normB += valueB * valueB;
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
