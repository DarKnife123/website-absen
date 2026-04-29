import { ObjectId } from "mongodb";

export type Role = "Admin" | "User";
export type Status = "hadir" | "sakit" | "izin" | "alpha";

export interface User {
  _id?: ObjectId;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;
  role: Role;
}

export interface Account {
  _id?: ObjectId;
  userId: ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface Session {
  _id?: ObjectId;
  sessionToken: string;
  userId: ObjectId;
  expires: Date;
}

export interface VerificationToken {
  _id?: ObjectId;
  identifier: string;
  token: string;
  expires: Date;
}

export interface Siswa {
  _id?: ObjectId;
  nis: string;
  userId: ObjectId;
  kelasId: ObjectId;
}

export interface Absensi {
  _id?: ObjectId;
  tanggal: Date;
  status: Status;
  siswaId: ObjectId;
  keterangan?: string | null;
  filePath?: string | null;
  createdAt: Date;
}

export interface Kelas {
  _id?: ObjectId;
  nama: string;
}
