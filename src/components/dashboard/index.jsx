import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
//custom components
import { Navbar } from '@components/navbar';
import { Userbar } from '@components/userbar';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { ProgressSpinner } from 'primereact/progressspinner';
export const Dashboard = ({ children }) => {
    const router = useRouter();
    const { status, data: session } = useSession();

    const small = useMediaQuery('(max-width: 768px)');
    if (status === 'loading') {
        return (
            <div className="flex justify-content-center flex-wrap">
                <ProgressSpinner animationDuration=".5s" />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        router.push('/login');
        return;
    }

    return (
        <div className="grid">
            {!small && (
                <div className="col-12 md:col-12 lg:col-12 ">
                    <Userbar />
                </div>
            )}

            <div className="col-12 md:col-3 lg:col-2">
                <Navbar />
            </div>
            <div className="col-12 md:col-9 lg:col-10">{children}</div>
        </div>
    );
};
