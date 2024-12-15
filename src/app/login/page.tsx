
export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <form
                action="/api/login"
                method="post"
                className="flex flex-col gap-4 p-4  rounded-lg shadow-lg">
                <label>
                    <span>Username</span>
                    <input className="text-black" type="text" name="username" />
                </label>
                <label>
                    <span>Password</span>
                    <input className="text-black" type="password" name="password" />
                </label>
                <button type="submit">Login</button>
            </form>
        </main>
    );
}