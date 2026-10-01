export const errors = {
  notFound: {
    title: "This page got lost in transit",
    description: "The page you're looking for doesn't exist or has been moved.",
    home: "Back to home",
    contact: "Contact support",
  },
  boundary: {
    title: "Something went wrong",
    description: "An unexpected error occurred. You can try again, or head back to the home page.",
    reference: "Ref: {digest}",
  },
  /** Fallback when an API error has no message. */
  network: "Couldn't reach the server. Check your connection and try again.",
};
