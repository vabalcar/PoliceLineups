// time from BE is in format described here: https://xml2rfc.tools.ietf.org/public/rfc/html/rfc3339.html#anchor14
// it has build-in support in JS
export const convertToLocalDateTime = (
  utcDateTime: number | string | Date
): Date => new Date(utcDateTime);
