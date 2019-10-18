// https://stackoverflow.com/a/2593661/710693
export const escapeRegex = (str: string) => `${str}`.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
