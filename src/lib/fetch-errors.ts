export type FetchErrorCode =
  | "invalid_url"
  | "unsupported_protocol"
  | "timeout"
  | "cors_blocked"
  | "fetch_failed"
  | "generic";

export class OgFetchError extends Error {
  readonly code: FetchErrorCode;

  constructor(code: FetchErrorCode) {
    super(code);
    this.name = "OgFetchError";
    this.code = code;
  }
}
