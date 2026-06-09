import { AdminSidebar } from './AdminSidebar';

export const DashboardContainer = ({ user, onLogout, children }) => (
    <div className='min-h-screen grid bg-[#f6f7fb] text-[#303040]' style={{ gridTemplateColumns: '280px 1fr' }}>
        <AdminSidebar user={user} onLogout={onLogout} />
        <main className='p-[34px]'>{children}</main>
    </div>
);