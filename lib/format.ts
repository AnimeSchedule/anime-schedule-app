export function formatSource(source: string): string {
  if (!source) return "Unknown";
  return source
    .replace(/_/g, " ")
    .split(" ")
    .map((word) =>
      word
        ? word[0].toUpperCase() + word.slice(1).toLowerCase()
        : ""
    )
    .join(" ");
}
