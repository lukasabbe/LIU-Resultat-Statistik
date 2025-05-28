import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function CircleChart({ course }) {
  // State for dynamic text color
  const [textColor, setTextColor] = useState(
    getComputedStyle(document.documentElement).getPropertyValue('--text') || '#222'
  );

  // Update textColor when theme changes
  useEffect(() => {
    const updateColor = () => {
      setTextColor(
        getComputedStyle(document.documentElement).getPropertyValue('--text') || '#222'
      );
    };
    // Listen for theme changes (attribute change)
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Also update on mount
    updateColor();

    return () => observer.disconnect();
  }, []);

  const data = {
    labels: course.grades.map((grade) => grade.grade),
    datasets: [
      {
        label: 'Votes',
        data: course.grades.map((grade) => grade.quantity),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: [course.moduleCode + " - " + new Date(course.date).toLocaleDateString(),
          "totalt "+course.grades.reduce((acc, grade) => acc + grade.quantity, 0) + " studenter"
        ],
        color: textColor,
        font: {
          size: 18,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
  };

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <Pie data={data} options={options} />
    </div>
  );
}