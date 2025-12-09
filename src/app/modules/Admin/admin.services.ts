import { adminSearchAbleFields } from "./admin.constance";
import prisma from "../../../shared/prisma";
import { Admin, Prisma, UserStatus } from "@prisma/client";
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
  // fileter soft deleted data \

  andConditions.push({
    isDeleted: false
  })

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
      id,
      isDeleted: false
    }
  })
  return result
}
const updateAdminIntoDB = async (id: string, data: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    }
  })
  const result = await prisma.admin.update({
    where: { id },
    data
  })
  return result
}
const deleteAdminIntoDB = async (id: string) => {

  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted:false
    }
  })
  const result = await prisma.$transaction(async (transactionClient) => {

    const adminDeleteData = await transactionClient.admin.delete({
      where: { id }
    })

    const userDeleteData = await transactionClient.user.delete({
      where: {
        email: adminDeleteData.email
      }
    })

    return adminDeleteData

  })
  return result
}

const softDeleteAdminIntoDB = async (id: string) => {

  await prisma.admin.findUniqueOrThrow({
    where: { id }
  });

  const result = await prisma.$transaction(async (transactionClient) => {

    const updatedAdmin = await transactionClient.admin.update({
      where: { id },
      data: {
        isDeleted: true
      }
    });

    const updatedUser = await transactionClient.user.update({
      where: {
        email: updatedAdmin.email
      },
      data: {
        status: UserStatus.DELETED
      }
    });

    return updatedAdmin;
  });

  return result;
};


export const adminService = {
  getAllAdminFromDB,
  getSinlgeAdminFromDB,
  updateAdminIntoDB,
  deleteAdminIntoDB,
  softDeleteAdminIntoDB
};
