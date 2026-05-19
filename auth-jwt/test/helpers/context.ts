export const context = (name: string, fn: () => void) => {
  describe(name, () => {
    fn();
  });
};
