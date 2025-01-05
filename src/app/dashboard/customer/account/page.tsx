import Link from "next/link";
import { Logout } from "~/components/Logout";

export default function AccountPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-1"> 
            <Link href="/dashboard/profile">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Profil
                </button>
            </Link>
            
            <Link href="/dashboard/customer/account/addresses">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Adreslerim
                </button>
            </Link>

            <Link href="/dashboard/customer/account/orders">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Siparislerim
                </button>
            </Link>

            <Link href="/basket">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Sepetim
                </button>
            </Link>


            <Logout />
        </div>


    )

}