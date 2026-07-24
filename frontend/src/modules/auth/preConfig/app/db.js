export const db = {
  changes: () => {
    const listener = {
      on: () => listener,
      cancel: () => {}
    };
    return listener;
  }
};
