import React from 'react';
import { DollarSign, BarChart3, Calendar } from 'lucide-react';
import { StatCard } from './ui/StatCard';
import { useSettings } from '../contexts/SettingsContext';

export function RevenueCards({ dailySales, monthlySales, yearlySales, dailyProfit, monthlyProfit, yearlyProfit }) {
    const { settings } = useSettings();
    const fmt = (n) => `${settings.currency || 'Rs.'} ${(n || 0).toLocaleString('en-PK')}`;

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <StatCard
                title="Today's Revenue"
                value={fmt(dailySales)}
                icon={DollarSign}
                color="orange"
                sub="Gross sales today"
                trend="up"
                trendValue={fmt(dailyProfit)}
            />

            <StatCard
                title="Monthly Performance"
                value={fmt(monthlySales)}
                icon={BarChart3}
                color="rose"
                sub="Gross sales this month"
                trend="up"
                trendValue={fmt(monthlyProfit)}
            />

            <StatCard
                title="Yearly Total"
                value={fmt(yearlySales)}
                icon={Calendar}
                color="blue"
                sub="Gross sales this year"
                trend="up"
                trendValue={fmt(yearlyProfit)}
            />
        </div>
    );
}
