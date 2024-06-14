import stripe from "stripe";

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY ||
  "sk_test_51MZZl4HooFjFi8rDkSN7wx6e3X3hKr8D92sBjEyv8qD60FYX6lrtFykaYPUi6K2JjdPcgkf1OycVQInYBU4QzhpI00DZz64goG";
export const stripeClient = new stripe(stripeSecretKey);
