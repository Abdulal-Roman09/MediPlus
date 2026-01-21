export type IPagination = {
    page?: number,
    limit?: number,
    sortOrder?: string,
    sortBy?: string
}
type IPaginationResult = {
    page: number;
    limit: number;
    sortOrder: string;
    sortBy: string;
    skip: number;
};

export const calculatePagination = (
    options: IPagination
): IPaginationResult => {

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";

    return {
        skip,
        limit,
        page,
        sortBy,
        sortOrder,
    };
};
