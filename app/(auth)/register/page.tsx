import FormRegister from "@/components/auth/form-register";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

const Register = async () => {
    // Fetch classes for the dropdown
    const db = await getDb();
    const classes = await db.collection("kelas").find().sort({ nama: 1 }).toArray();

    return (
    <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <FormRegister classes={classes.map((c: any) => ({ id: c._id.toString(), nama: c.nama }))} />
    </div>
    );
}
export default Register;