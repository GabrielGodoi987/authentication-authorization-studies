export const cartKeys = {
  all: ["cart"] as const,
  current: () => [...cartKeys.all, "current"] as const,
  detail: (id: string) => [...cartKeys.all, id] as const,
}

export const productKeys = {
  all: ["product"] as const,
  detail: (id: string) => [...productKeys.all, id] as const,
}
