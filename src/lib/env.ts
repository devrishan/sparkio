function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

const clientEnv = {
  NEXT_PUBLIC_API_BASE_URL: normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost/sparkio/sparkio",
  ),
};

const serverEnv = {
  API_BASE_URL: normalizeBaseUrl(process.env.API_BASE_URL ?? clientEnv.NEXT_PUBLIC_API_BASE_URL),
};

export const env = {
  ...clientEnv,
  ...serverEnv,
};

