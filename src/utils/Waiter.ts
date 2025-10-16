export const Waiter = (sleepTime: number) => {
  return new Promise((resolve) => setTimeout(resolve, sleepTime));
}
