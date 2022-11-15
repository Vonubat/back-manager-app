export function createError(statusCode: number, message: string) {
  return { statusCode, message };
}

export function checkBody(body: object, keys: string[]): string | null {
  const bodyKeys = Object.keys(body);
  if (bodyKeys.length === 0) {
    return 'body is required';
  }
  for (const key of keys) {
    if (!body.hasOwnProperty(key)) {
      return `${key} is required`;
    }
  }
  if (bodyKeys.length > keys.length) {
    const extraProps = bodyKeys.filter(prop => !keys.includes(prop));
    return `properties [ ${extraProps.join(',')} ] shouldn't exist`
  }
  return null;
}

export function defineErrorResponse(error: Error, context: string) {
  if (error.message === 'INVALID_ID') {
    return { code: 400, message: `${context}_ID_IS_INVALID` };
  }

  if (error.message === 'NOT_EXIST') {
    return { code: 404, message: `${context}_DOES_NOT_EXIST`};
  }

  console.log(error);

  return { code: 500, message: 'SERVER_ERROR' };
}
