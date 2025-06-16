/********************************************************************************************************************
 * URL을 조합해서 반환
 * @param parts URL 조각
 * ******************************************************************************************************************/
export function urlJoin(...parts: string[]): string {
  return parts.reduce((acc, part) => {
    if (acc === '') {
      return part;
    } else if (part.startsWith('?')) {
      return `${acc}${part}`;
    } else if (acc.endsWith('/')) {
      return `${acc}${part.startsWith('/') ? part.substring(1) : part}`;
    } else {
      return `${acc}${part.startsWith('/') ? part : `/${part}`}`;
    }
  });
}

export default urlJoin;
