import FormRegister from "@/components/auth/form-register";
import { prisma } from "@/lib/prisma";

const Register = async () => {
    // Fetch classes for the dropdown
    const classes = await prisma.kelas.findMany({
        orderBy: { nama: "asc" }
    });

    return (
    <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <FormRegister classes={classes.map((c: any) => ({ id: c.id, nama: c.nama }))} />
    </div>
    );
}
export default Register;