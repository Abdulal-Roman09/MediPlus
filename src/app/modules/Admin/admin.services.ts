import { adminSearchAbleFields } from "./admin.constance";
import { calculatePagination } from "../../../halpers/paginationAndSoringHalper";
import prisma from "../../../shared/prisma";
import { Prisma } from "@prisma/client";




const getAllAdminFromDB = async (params: any, options: any) => {
  const { skip, limit, sortBy, sortOrder } = calculatePagination(options);

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
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return result;
};

export const adminService = {
  getAllAdminFromDB,
};
