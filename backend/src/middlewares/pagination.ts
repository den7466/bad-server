export const paginationPage = (page: any) => Math.max(1, Number(page) || 1);

export const paginationLimit = (limit: any) => Math.min(10, Math.max(1, Number(limit) || 10));
