import { adminSearchAbleFields } from "./admin.constance";
import prisma from "../../../shared/prisma";
import { Prisma } from "@prisma/client";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";

const getAllAdminFromDB = async (params: any, options: any) => {
  const { skip, limit, page, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.AdminWhereInput[] = [];

  // SEARCH TERM
  if (searchTerm) {
    andConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // DIRECT FIELD FILTERING
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  // FINAL WHERE CONDITION
  const whereCondition: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // QUERY
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.admin.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSinlgeAdminFromDB = async (id: string) => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id
    }
  })
  return result
}

export const adminService = {
  getAllAdminFromDB,
  getSinlgeAdminFromDB
};
