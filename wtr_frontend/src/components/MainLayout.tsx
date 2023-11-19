"use client"

import React from 'react';
import Image from 'next/image';
import { Layout } from 'antd';
import { HomeOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

import styles from '@/styles/MainLayout.module.css';
import UserAvatarDropdown from './UserAvatarDropdown';

export default function MainLayout({ children }: { children: React.ReactNode }): JSX.Element {
    const [currentPage, setCurrentPage] = React.useState<number>(0);

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
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                    <BottomNavigation
                        showLabels
                        value={currentPage}
                        onChange={(_, newValue) => setCurrentPage(newValue)}
                    >
                        <BottomNavigationAction label="Home" icon={<HomeOutlined />} />
                        <BottomNavigationAction label="Family" icon={<UsergroupDeleteOutlined />} />
                    </BottomNavigation>
                </div>
            </Layout.Footer>
        </Layout>
    );
}