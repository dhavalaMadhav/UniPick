import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="breadcrumb">
            {items.map((crumb, index) => {
                const isLast = index === items.length - 1;
                if (crumb.url && !isLast) {
                    return (
                        <Link key={index} to={crumb.url}>
                            {crumb.name}
                        </Link>
                    );
                }
                return (
                    <span key={index} style={{ color: '#002b5e', fontWeight: 500 }}>
                        {crumb.name}
                    </span>
                );
            })}
        </div>
    );
}


