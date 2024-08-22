import {ReactNode} from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    )
}
