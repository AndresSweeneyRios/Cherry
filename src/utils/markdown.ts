export const escape = string => string.replace(/(\*|\_|\`|\||\~|\\|\<|\@|\#)/g, '\\$1')
