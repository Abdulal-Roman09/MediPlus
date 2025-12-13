export type IDoctorFilterRequest = {
    name?: string | undefined;
    email?: string | undefined;
    contactNumber?: string | undefined;
    searchTerm?: string | undefined;
    specialties?: string | undefined;
    apointmentFee?: number | undefined;
    gender?: number | undefined;
}