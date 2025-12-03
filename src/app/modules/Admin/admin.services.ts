import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constance";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (params: any) => {
  const { serchTerm, ...filterData } = params
  // This must be an array
  const andConditions: any[] = [];

  if (params?.searchTerm) {
    andConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          
          contains: params.searchTerm,
          mode: "insensitive",
        }
      }))
    })
  }

  // If empty→ return all
  const whereCondition: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        }
      }))
    });
  }



  const result = await prisma.admin.findMany({
    where: whereCondition,
  });

  return result;
};

export const adminService = {
  getAllAdminFromDB,
};
