import React from 'react';

import Link from 'next/link';

export default function SideMenu() {
    return (
        <aside style={styles.sidebar}>
            <h2 style={styles.title}>Menu</h2>
            <ul style={styles.list}>
                <li><Link href="/">🏠 Home</Link></li>
                <li><Link href="/dashboard">📊 Dashboard</Link></li>
                <li><Link href="#">⚙️ Configurações</Link></li>
            </ul>
        </aside>
    );
}

const styles = {
    sidebar: {
        width: '200px',
        height: '100vh',
        background: '#1e293b',
        color: 'white',
        padding: '20px',
        boxSizing: 'border-box',
    },
    title: {
        fontSize: '1.2rem',
        marginBottom: '1rem',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        listStyleType: 'none',
    },
};
