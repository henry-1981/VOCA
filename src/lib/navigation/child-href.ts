type ChildHrefInput = {
  pathname: string;
  childId?: string;
  params?: Record<string, string | number | undefined | null>;
};

export function buildChildHref({
  pathname,
  childId,
  params = {}
}: ChildHrefInput) {
  const search = new URLSearchParams();

  if (childId) {
    search.set("child", childId);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}
