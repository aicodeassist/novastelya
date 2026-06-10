export function validateMetadata(metadata: {
  title?: string;
  description?: string;
  canonical?: string;
}): string[] {
  if (process.env.NODE_ENV !== "development") return [];

  const errors: string[] = [];

  if (metadata.title) {
    if (metadata.title.length > 60) {
      errors.push(`Title занадто довгий: ${metadata.title.length} > 60`);
    }
    if (metadata.title.length < 30) {
      errors.push(`Title занадто короткий: ${metadata.title.length} < 30`);
    }
  }

  if (metadata.description) {
    if (metadata.description.length > 155) {
      errors.push(`Description занадто довгий: ${metadata.description.length} > 155`);
    }
  }

  return errors;
}
export { validateMetadata as validate };
