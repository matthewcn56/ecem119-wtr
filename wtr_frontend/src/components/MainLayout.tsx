"use client"

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Layout } from 'antd';
import { HomeOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';

import BottomNavigation, { BottomNavigationItem } from './BottomNavigation';
import UserAvatarDropdown from './UserAvatarDropdown';
import styles from '@/styles/MainLayout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }): JSX.Element {
    const router = useRouter();

    const [currentPage, setCurrentPage] = React.useState<number>(0);

    function _handlePageChange(event: React.SyntheticEvent, newPage: number) {
        setCurrentPage(newPage);

        switch (newPage) {
            case 0:
                router.push('/');
                break;
            case 1:
                router.push('/family');
                break;
        }
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout.Header className={styles.header}>
                <Image
                    src="next.svg"
                    width="100"
                    height="50"
                    alt="wtr logo"
                />
                <UserAvatarDropdown />
            </Layout.Header>
            <Layout.Content>
                { children }
            </Layout.Content>
            <Layout.Footer className={styles.footer}>
                <BottomNavigation>
                    <BottomNavigationItem label="Home" icon={<HomeOutlined />} />
                    <BottomNavigationItem label="Family" icon={<UsergroupDeleteOutlined />} />
                </BottomNavigation>
            </Layout.Footer>
        </Layout>
    );
}