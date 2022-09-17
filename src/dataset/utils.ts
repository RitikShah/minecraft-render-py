/**
 * Validates the format of a resource location
 * @param location resource location in formation namespace:path/to/item
 */
export function validateResourceLocation(location: string) {
  if (!/[0-9a-z_\-\.]+:[0-9a-z_\-\.\/]+/.test(location)) {
    throw new Error(`"${location}" is not a valid resource location.`);
  }
}

export function normalizeResourceLocation(namespace: string, identifier?: string): [string, string]
{
  if (identifier == undefined) {
    if(!namespace.includes(":"))
    {
      return ["minecraft", namespace];
    }
    return namespace.split(":", 2) as [string,string];
  }
  return [namespace, identifier];
}

export function resourceLocationAsString(namespace: string, identifier?: string): string
{
  if (identifier == undefined) {
    validateResourceLocation(namespace);
    return namespace;
  } else {
    validateResourceLocation(namespace + ":" + identifier);
    return namespace + ":" + identifier;
  }
}

export function parseJSON<T>(data: Uint8Array): T {
  return JSON.parse( (new TextDecoder).decode(data) ) as T;
}

export function constructPath(
  objectType: string,
  suffix: string,
  namespace: string,
  identifier?: string
): string {
  try {
    [namespace, identifier ] = normalizeResourceLocation(namespace, identifier);
    validateResourceLocation(namespace + ":" + identifier);
  } catch (e) {
    throw new Error("Failed to construct path, " + (e as Error).message, {cause : e});
  }

  return `${namespace}/${objectType}/${identifier}.${suffix}`;
}
