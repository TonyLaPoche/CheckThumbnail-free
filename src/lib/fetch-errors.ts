export type FetchErrorCode = "invalid_url" | "fetch_failed";

export class OgFetchError extends Error {
  readonly code: FetchErrorCode;

  constructor(code: FetchErrorCode) {
    super(code);
    this.name = "OgFetchError";
    this.code = code;
  }
}
