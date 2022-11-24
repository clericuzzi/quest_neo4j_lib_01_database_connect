export type CodeAndMessage = {
  code: string;
  message: string;
};

export function isCodeAndMessage(e: unknown): e is CodeAndMessage {
  if (typeof e == 'object') {
    //@ts-ignore Checking if row contains the given properties
    return !!e?.code && !!e?.message;
  } else return false;
}
export function isErrorResponse(e: unknown): e is ErrorResponse {
  return e instanceof ErrorResponse;
}

export class ErrorResponse extends Error {
  public errorList: CodeAndMessage[] = [];
  public pushError(code: string, message: string) {
    this.errorList.push({ code, message });
  }

  public get length() {
    return this.errorList.length;
  }
}
