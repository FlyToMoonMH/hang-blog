export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function decodeRouteSegments(values: string[]): string[] {
  return values.map((value) => decodeRouteParam(value));
}
