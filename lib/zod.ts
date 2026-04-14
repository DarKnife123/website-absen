import { object, string  } from "zod"; 

export const SignInSchema = object({
    email: string().email("Invalid email"),
    password: string()
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

export const RegisterSchema = object({
    name: string().min(1, "Name must be more than 1 character"),
    email: string().email("Invalid email"),
    nis: string().min(4, "NIS must be at least 4 characters"),
    kelasId: string().min(1, "Please select a class"),
    password: string()
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
    confirmPassword: string()
        .min(8, "Confirm Password must be more than 8 characters")  
        .max(32, "Confirm Password must be less than 32 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});