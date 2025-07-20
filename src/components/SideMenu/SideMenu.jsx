'use client';

import React, { useState } from 'react';
import './index.css';

import Link from 'next/link';
import { Box, Home, Menu as MenuIcon, Users, X as CloseIcon } from '@geist-ui/icons';
import { usePathname } from 'next/navigation';

export default function SideMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", icon: Home, label: "Pedidos" },
    { href: "/client", icon: Users, label: "Clientes" },
    { href: "/product", icon: Box, label: "Produtos" },
  ];

  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <aside id="sidebar" className={isOpen ? 'open' : ''}>
        <ul id="list">
          {links.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link
                draggable={false}
                href={href}
                className={`menu-link ${pathname === href ? 'active' : ''}`}
                onClick={() => setIsOpen(false)} // fecha ao clicar no link
              >
                <Icon className="icon" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}