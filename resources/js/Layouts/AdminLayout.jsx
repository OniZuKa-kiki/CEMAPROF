import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminTopbar from '@/Components/Admin/AdminTopbar';
import FlashListener from '@/Components/Admin/FlashListener';

export default function AdminLayout({ children, title = 'Administration' }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <FlashListener />
            <AdminSidebar />
            <div className="flex flex-1 flex-col lg:ml-0">
                <AdminTopbar title={title} />
                <main className="flex-1 p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
