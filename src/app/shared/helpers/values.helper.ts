export const hasValue = (value: any): boolean => {
  return value !== undefined && value !== null;
}

export const isMobile = (): boolean => window.innerWidth <= 768;
