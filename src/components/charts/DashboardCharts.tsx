import React from 'react';

export const RevenueChart: React.FC = () => {
  const revenueData = [
    { month: 'Ene', amount: 35000 },
    { month: 'Feb', amount: 42000 },
    { month: 'Mar', amount: 38000 },
    { month: 'Abr', amount: 45000 },
    { month: 'May', amount: 48000 },
    { month: 'Jun', amount: 52000 }
  ];

  const maxAmount = Math.max(...revenueData.map(d => d.amount));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-48">
        {revenueData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-sm transition-all duration-300 hover:from-primary-600 hover:to-primary-500"
              style={{
                height: `${(data.amount / maxAmount) * 100}%`,
                minHeight: '20px'
              }}
            ></div>
            <span className="text-xs text-neutral-600 mt-2">{data.month}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-neutral-600">
        <span>Ingresos mensuales</span>
        <span className="font-semibold text-primary-600">
          ${revenueData[revenueData.length - 1].amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export const AttendanceChart: React.FC = () => {
  const attendanceData = [
    { day: 'Lun', present: 85, total: 100 },
    { day: 'Mar', present: 92, total: 100 },
    { day: 'Mié', present: 78, total: 100 },
    { day: 'Jue', present: 88, total: 100 },
    { day: 'Vie', present: 95, total: 100 },
    { day: 'Sáb', present: 82, total: 100 },
    { day: 'Dom', present: 75, total: 100 }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-48">
        {attendanceData.map((data, index) => {
          const percentage = (data.present / data.total) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full">
                <div
                  className="w-full bg-gradient-to-t from-success-500 to-success-400 rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${percentage * 1.5}px`,
                    minHeight: '20px'
                  }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs font-semibold text-success-700 bg-white px-1 rounded">
                    {data.present}%
                  </span>
                </div>
              </div>
              <span className="text-xs text-neutral-600 mt-2">{data.day}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-sm text-neutral-600">
        <span>Asistencia semanal</span>
        <span className="font-semibold text-success-600">
          {Math.round(attendanceData.reduce((acc, d) => acc + d.present, 0) / attendanceData.length)}% promedio
        </span>
      </div>
    </div>
  );
};
