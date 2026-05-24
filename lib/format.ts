export function formatSource(source: string): string {
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
