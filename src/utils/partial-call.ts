export function partialCall<
  THead extends readonly unknown[],
  TRemaining extends readonly unknown[],
  TResult
>(fn: (...args: [...THead, ...TRemaining]) => TResult, ...headArgs: THead) {
  return (...tailArgs: TRemaining) => fn(...headArgs, ...tailArgs);
}
