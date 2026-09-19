type AuthError = {
  code?: string;
  message?: string;
};

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") return fallback;

  const authError = error as AuthError;

  switch (authError.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "The email or password is incorrect.";
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
    case "USER_ALREADY_EXISTS":
      return "An account with this email already exists.";
    default:
      return authError.message || fallback;
  }
}

export { getAuthErrorMessage };
