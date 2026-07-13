import { AdminSidebar } from './AdminSidebar';

export const DashboardContainer = ({ user, onLogout, children }) => (
    <div className='fw-dashboard-layout min-h-screen bg-[#f6f7fb] text-[#303040]'>
        <AdminSidebar user={user} onLogout={onLogout} />
        <main className='p-4 sm:p-6 md:p-[34px]'>{children}</main>
    </div>
);
