/**
 * Extrai o primeiro `File` de um valor de campo de formulário do tipo `type="file"`.
 *
 * O `react-hook-form` (via `register`) armazena o valor de inputs nativos `type="file"`
 * como um `FileList` (não um `File` único), então uma checagem `instanceof File` direta
 * nunca é verdadeira para esses campos. Esta função normaliza os dois formatos.
 */
export function extractSelectedFile(value: unknown): File | undefined {
  if (!value) return undefined;
  if (value instanceof File) return value;
  if (typeof FileList !== 'undefined' && value instanceof FileList) {
    return value.length > 0 ? value[0] : undefined;
  }
  return undefined;
}

/** Indica se um valor de campo `type="file"` possui algum arquivo selecionado. */
export function hasSelectedFile(value: unknown): boolean {
  return Boolean(extractSelectedFile(value));
}
