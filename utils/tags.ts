export const TAG_MAX_LENGTH = 50;

const addUnique = (target: string[], value: string) => {
  if (!target.includes(value)) {
    target.push(value);
  }
};

export const normalizeTags = (value: unknown): string[] => {
  const normalized: string[] = [];

  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (typeof item !== "string") return;
      const tag = item.trim();
      if (!tag) return;
      addUnique(normalized, tag);
    });
    return normalized;
  }

  if (typeof value === "string") {
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => addUnique(normalized, item));
    return normalized;
  }

  return normalized;
};

export const splitTagInput = (value: string): string[] =>
  value
    .split(",")
    .map((tagValue) => tagValue.trim())
    .filter(Boolean);

export const isTagTypeMismatchError = (message: string) =>
  message.includes('Attribute "tags" has invalid type');
