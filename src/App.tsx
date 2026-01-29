import { useState, useMemo } from 'react';
import { 
  Container, Autocomplete, Button, Group, Card, Text, 
  Loader, Center, Alert, Grid, Stack, Select, Pagination, Title, 
  SegmentedControl 
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer,
  PieChart, Pie
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchGradeStats, fetchAllCourses } from './api';
import { Header } from './Header';

function App() {
  // FIX: Check URL immediately when initializing state (Lazy Initialization)
  // This avoids the "Cascading Render" error entirely.
  const [searchValue, setSearchValue] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('course')?.toUpperCase() || '';
  });

  // Initialize selectedCourse so the API fetches data immediately if URL has a course
  const [selectedCourse, setSelectedCourse] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('course')?.toUpperCase() || null;
  });

  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  // UI State
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [chartType, setChartType] = useState('bar'); 
  const [activePage, setActivePage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // 1. Fetch List
  const { data: courseList } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchAllCourses,
    staleTime: 1000 * 60 * 60, 
  });

  const filteredCourses = useMemo(() => {
    if (!courseList) return [];
    if (!debouncedSearch) return []; 
    return courseList
      .filter((code) => code.toLowerCase().includes(debouncedSearch.toLowerCase()))
      .slice(0, 10); 
  }, [courseList, debouncedSearch]);
  
  // 2. Fetch Stats
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['grades', selectedCourse],
    queryFn: () => fetchGradeStats(selectedCourse!),
    enabled: !!selectedCourse,
  });

  const getGradeColor = (grade: string) => {
    const g = grade.toUpperCase();
    if (g === 'U' || g === 'F' || g === 'FAIL') return '#fa5252'; 
    if (g === '3' || g === 'E' || g === 'D') return '#fab005';    
    if (g === '4' || g === 'C' || g === 'B') return '#82c91e';    
    if (g === '5' || g === 'A') return '#40c057';                 
    return '#228be6'; 
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; 
      const gradeName = data.name || label;

      return (
        <Card shadow="sm" padding="xs" radius="sm" withBorder>
          <Text fw={700} size="sm">Grade: {gradeName}</Text>
          <Text size="xs">Quantity: {data.quantity}</Text>
          <Text size="xs" c="dimmed">Percentage: {data.percentage}%</Text>
        </Card>
      );
    }
    return null;
  };

  // Update URL when searching
  const handleSearch = () => {
    if (searchValue) {
      const code = searchValue.toUpperCase();
      setSelectedCourse(code);
      setModuleFilter(null); 
      setActivePage(1);      

      // Update the browser URL without reloading
      const newUrl = `${window.location.pathname}?course=${code}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  };

  // 3. Process Data
  const processedModules = useMemo(() => {
    if (!stats) return [];
    let filtered = stats.modules;
    if (moduleFilter) filtered = filtered.filter(m => m.moduleCode === moduleFilter);
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return filtered;
  }, [stats, moduleFilter]);

  const totalPages = Math.ceil(processedModules.length / ITEMS_PER_PAGE);
  const currentModules = processedModules.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const uniqueModuleCodes = useMemo(() => {
    if (!stats) return [];
    return Array.from(new Set(stats.modules.map(m => m.moduleCode)));
  }, [stats]);

  return (
    <Container size="md" pb="xl">
      <Header />

      <Card withBorder shadow="sm" radius="md" mb="xl">
        <Group align="end">
          <Autocomplete
            label="Search Course"
            placeholder="e.g. TDDE35"
            data={filteredCourses}
            value={searchValue}
            onChange={setSearchValue}
            style={{ flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>Search</Button>
        </Group>
      </Card>

      {isLoading && <Center py="xl"><Loader size="lg" /></Center>}
      
      {isError && (
        <Alert color="red" title="Error" mb="lg">
          Failed to fetch data. <br/>{(error as Error).message}
        </Alert>
      )}

      {stats && (
        <Stack gap="lg">
          {/* Controls Bar */}
          <Card withBorder shadow="md" radius="md" bg="var(--mantine-color-blue-light)">
            <Stack gap="sm">
              <Group justify="space-between">
                <div>
                  <Text size="xs" fw={700} c="blue">{stats.courseCode}</Text>
                  <Title order={2} size="h3">{stats.courseNameEng}</Title>
                </div>
              </Group>
              
              <Group justify="space-between" mt="xs">
                <Select 
                  placeholder="Filter by Exam"
                  data={uniqueModuleCodes}
                  value={moduleFilter}
                  onChange={(val) => { setModuleFilter(val); setActivePage(1); }}
                  clearable
                  w={200}
                />
                
                <SegmentedControl
                  value={chartType}
                  onChange={setChartType}
                  data={[
                    { label: 'Bar Chart', value: 'bar' },
                    { label: 'Pie Chart', value: 'pie' },
                  ]}
                />
              </Group>
            </Stack>
          </Card>

          {/* Graphs Grid */}
          <Grid>
            {currentModules.map((mod, index) => (
              <Grid.Col span={{ base: 12, md: 6 }} key={`${mod.moduleCode}-${mod.date}-${index}`}>
                <Card withBorder shadow="sm" radius="md">
                  <Group justify="space-between" mb="sm">
                    <Text fw={700}>{mod.moduleCode}</Text>
                    <Text size="sm" c="dimmed">{new Date(mod.date).toLocaleDateString()}</Text>
                  </Group>
                  
                  {(() => {
                     const totalStudents = mod.grades.reduce((acc, curr) => acc + curr.quantity, 0);
                     
                     const chartData = [...mod.grades]
                       .sort((a, b) => a.gradeOrder - b.gradeOrder)
                       .map(g => ({
                         name: g.grade,
                         quantity: g.quantity,
                         percentage: totalStudents > 0 ? ((g.quantity / totalStudents) * 100).toFixed(1) : 0,
                         fill: getGradeColor(g.grade)
                       }));

                     return (
                       <div style={{ width: '100%', height: 300 }}>
                         <ResponsiveContainer>
                           {chartType === 'bar' ? (
                             <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                               <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                               <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                               <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                               <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
                                 {chartData.map((entry, i) => (
                                   <Cell key={`cell-${i}`} fill={entry.fill} />
                                 ))}
                               </Bar>
                             </BarChart>
                           ) : (
                             <PieChart>
                               <Tooltip content={<CustomTooltip />} />
                               <Pie
                                 data={chartData}
                                 dataKey="quantity"
                                 nameKey="name"
                                 cx="50%"
                                 cy="50%"
                                 outerRadius={100}
                                 label={({ name, percent }) => `${name} ${(percent as number * 100).toFixed(0)}%`}
                               >
                                 {chartData.map((entry, i) => (
                                   <Cell key={`cell-${i}`} fill={entry.fill} />
                                 ))}
                               </Pie>
                             </PieChart>
                           )}
                         </ResponsiveContainer>
                       </div>
                     );
                  })()}
                </Card>
              </Grid.Col>
            ))}
          </Grid>
          
          {currentModules.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">No exams found for this filter.</Text>
          )}

          {totalPages > 1 && (
            <Center mt="xl">
              <Pagination total={totalPages} value={activePage} onChange={setActivePage} />
            </Center>
          )}
        </Stack>
      )}
    </Container>
  );
}

export default App;