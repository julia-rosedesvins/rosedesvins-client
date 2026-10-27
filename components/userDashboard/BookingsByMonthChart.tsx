'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { BookingChartPoint, DashboardPeriod } from '@/services/user.service';

interface BookingsChartProps {
  data: BookingChartPoint[];
  period: DashboardPeriod;
  isLoading?: boolean;
}

const CHART_COPY: Record<
  DashboardPeriod,
  { title: string; description: string; empty: string; tooltipPrefix: string }
> = {
  week: {
    title: 'Réservations cette semaine',
    description: 'Répartition du lundi au dimanche de la semaine en cours',
    empty: 'Aucune réservation cette semaine',
    tooltipPrefix: 'Jour',
  },
  month: {
    title: 'Réservations ce mois',
    description: 'Répartition jour par jour du 1er au dernier jour du mois en cours',
    empty: 'Aucune réservation ce mois-ci',
    tooltipPrefix: 'Jour',
  },
  year: {
    title: 'Réservations cette année',
    description: 'Évolution mensuelle de janvier à décembre',
    empty: 'Aucune réservation cette année',
    tooltipPrefix: 'Mois',
  },
};

export default function BookingsChart({ data, period, isLoading = false }: BookingsChartProps) {
  const copy = CHART_COPY[period];
  const hasData = data.some((entry) => entry.count > 0);
  const isDenseMonthView = period === 'month' && data.length > 20;

  return (
    <Card className="mb-6 lg:mb-8">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#318160]" />
          {copy.title}
        </CardTitle>
        <CardDescription className="text-sm">{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[280px] w-full rounded-lg" />
            <div className="flex justify-center gap-2">
              {Array.from({ length: period === 'week' ? 7 : period === 'year' ? 12 : 6 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-8" />
              ))}
            </div>
          </div>
        ) : !hasData ? (
          <div className="flex h-[280px] flex-col items-center justify-center text-muted-foreground">
            <BarChart3 className="mb-2 h-12 w-12 opacity-50" />
            <p className="text-sm">{copy.empty}</p>
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: isDenseMonthView ? 16 : 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#6b7280', fontSize: isDenseMonthView ? 10 : 12 }}
                  axisLine={false}
                  tickLine={false}
                  interval={isDenseMonthView ? 1 : 0}
                  angle={isDenseMonthView ? -45 : 0}
                  textAnchor={isDenseMonthView ? 'end' : 'middle'}
                  height={isDenseMonthView ? 50 : 30}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(49, 129, 96, 0.08)' }}
                  contentStyle={{
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                  }}
                  formatter={(value: number) => [`${value} réservation${value > 1 ? 's' : ''}`, 'Total']}
                  labelFormatter={(label) => `${copy.tooltipPrefix} : ${label}`}
                />
                <Bar dataKey="count" fill="#318160" radius={[6, 6, 0, 0]} maxBarSize={period === 'month' ? 20 : 48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
