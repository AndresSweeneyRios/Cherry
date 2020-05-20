export const escape = (string): string => string.replace(/(\*|\_|\`|\||\~|\\|\<|\@|\#)/g, '\\$1')
