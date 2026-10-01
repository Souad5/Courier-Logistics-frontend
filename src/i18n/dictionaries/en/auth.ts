export const auth = {
  login: {
    metaTitle: "Log in",
    metaDescription:
      "Log in to book parcels, pay securely and track every delivery — or try a one-click demo account.",
    title: "Welcome back",
    subtitle: "Log in to manage your parcels and deliveries.",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    submit: "Log in",
  },
  register: {
    metaTitle: "Create account",
    metaDescription:
      "Create a free account to send parcels as a customer, or sign up to deliver as a courier.",
    title: "Create your account",
    subtitle: "Send parcels as a customer, or sign up to deliver as a courier.",
    haveAccount: "Already have an account?",
    logIn: "Log in",
    submit: "Create account",
    roleLabel: "I want to",
    roleCustomer: "Send parcels (Customer)",
    roleCourier: "Deliver parcels (Courier)",
    phoneHint: "Optional — helps couriers reach you.",
    passwordHint: "At least 8 characters.",
  },
  fields: {
    email: "Email",
    password: "Password",
    fullName: "Full name",
    phone: "Phone",
    emailPlaceholder: "you@example.com",
  },
  errors: {
    invalidEmail: "Invalid email address",
    passwordRequired: "Password is required",
    nameMin: "Name must be at least 2 characters",
    passwordMin: "Password must be at least 8 characters",
    phoneMin: "Phone must be at least 6 characters",
  },
  demo: {
    heading: "1-click demo login",
    /** {role} is the translated role name. */
    loginAs: "Log in as demo {role}",
  },
  panel: {
    eyebrow: "Courier delivery in Bangladesh",
    loginTitle: "Welcome back. Your parcels are right where you left them.",
    loginPoints: [
      "Track every parcel with a timestamped history",
      "Pay pending parcels by card in a few clicks",
      "Couriers pick up their task list instantly",
    ],
    registerTitle: "Send your first parcel in four short steps.",
    registerPoints: [
      "See the exact fee before you pay",
      "Photo proof on every delivery",
      "Or sign up as a courier and start delivering",
    ],
    stripeNote: "Payments are processed by Stripe in test mode.",
  },
};
