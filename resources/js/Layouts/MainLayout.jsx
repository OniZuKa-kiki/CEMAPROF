import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import FloatingActions from "@/Components/FloatingActions";
import QuoteCartBar from "@/Components/QuoteCartBar";

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-[60px]">{children}</main>
            <Footer />
            <QuoteCartBar />
            <FloatingActions />
        </div>
    );
}
