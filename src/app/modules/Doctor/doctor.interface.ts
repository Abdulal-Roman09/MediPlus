export type IDoctorFilterRequest = {
    name?: string | undefined;
    email?: string | undefined;
    contactNumber?: string | undefined;
    searchTerm?: string | undefined;
    specialties?: string | undefined;
    apointmentFee?: number | undefined;
    gender?: number | undefined;
}

export type IDoctorUpdate = {
    name: string;
    profilePhoto: string;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    experience: number;
    gender: 'MALE' | 'FEMALE';
    apointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    specialties: ISpecialties[];
};

export type ISpecialties = {
    specialtiesId: string;
    isDeleted?: null;
};