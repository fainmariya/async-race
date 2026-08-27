export type AnimationController = {
    cancel: () => void,
    finished: Promise<boolean>,
  };