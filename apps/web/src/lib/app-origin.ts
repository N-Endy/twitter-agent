export function getAppOrigin(fallbackUrl?: string) {
  const explicitUrl = process.env.NEXTAUTH_URL ?? process.env.X_REDIRECT_URI;

  if (explicitUrl) {
    return new URL(explicitUrl).origin;
  }

  if (fallbackUrl) {
    return new URL(fallbackUrl).origin;
  }

  return "http://localhost:3000";
}

export function isSecureAppOrigin(fallbackUrl?: string) {
  return getAppOrigin(fallbackUrl).startsWith("https://");
}
