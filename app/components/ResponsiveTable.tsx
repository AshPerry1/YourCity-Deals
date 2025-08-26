'use client';

import { ReactNode } from 'react';

interface ResponsiveTableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export default function ResponsiveTable({ headers, children, className = '' }: ResponsiveTableProps) {
  return (
    <div className={`table-responsive ${className}`}>
      <table className="table table-card">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}

interface ResponsiveTableRowProps {
  children: ReactNode;
  dataLabels?: string[];
}

export function ResponsiveTableRow({ children, dataLabels }: ResponsiveTableRowProps) {
  return (
    <tr>
      {React.Children.map(children, (child, index) => (
        <td data-label={dataLabels?.[index] || ''}>
          {child}
        </td>
      ))}
    </tr>
  );
}
