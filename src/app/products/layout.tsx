import { AuthProvider } from "@/Context/AuthContext";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Shopping",
  description: "Vinh IT",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
        
        <main>{children}</main>
      </AuthProvider>

    </>
  );
}
