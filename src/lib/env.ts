const clientEnv = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true",
};

const serverEnv = {
  API_BASE_URL: process.env.API_BASE_URL ?? clientEnv.NEXT_PUBLIC_API_BASE_URL,
  USE_MOCK_DATA: process.env.USE_MOCK_DATA === "true",
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

export const env = {
  ...clientEnv,
  ...serverEnv,
};

