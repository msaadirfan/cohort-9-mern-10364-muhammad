export function mergeNote(existingNote, updatedFields) {
  return { ...existingNote, ...updatedFields };
}