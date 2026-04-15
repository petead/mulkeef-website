import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(fr|en|ar|ru|zh|de|es|pt|hi|it)/:path*"],
};
