/** A page's own address (tennoform.com/farm/); the home page is "/". Clicks on these open in place (see src/js/001-page-urls.js). */
export const pagePath = (route: string) => (!route || route === "home" ? "/" : `/${route.replace(/^#/, "")}/`)
