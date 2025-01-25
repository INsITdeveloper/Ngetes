import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChakraProvider, Container, Box, Text, Input, Icon, Flex, Grid, Button } from '@chakra-ui/react';
import { FiSearch, FiEye, FiClock, FiBox, FiActivity, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const endpoints = [
  { method: 'GET', name: 'Stats', category: 'Analytics', path: '/api/stats' },
  { method: 'GET', name: 'Textoins', category: 'Utilities', path: '/api/textoins' },
  { method: 'GET', name: 'FFStalk', category: 'Gaming', path: '/api/ffstalk' },
];

const initialStats = [
  { label: 'Total Requests', value: 1142891, icon: FiActivity, color: 'blue.400' },
  { label: 'Total Visitors', value: 5173, icon: FiEye, color: 'green.400' },
  { label: 'Total Endpoints', value: 3, icon: FiBox, color: 'yellow.400' },
  { label: 'Runtime', value: '14 day, 7 hour', icon: FiClock, color: 'purple.400' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(initialStats);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [apiResult, setApiResult] = useState<any>(null);

  // Fungsi untuk memperbarui statistik
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => {
          if (stat.label === 'Total Requests' && typeof stat.value === 'number') {
            return { ...stat, value: stat.value + Math.floor(Math.random() * 100) };
          }
          if (stat.label === 'Total Visitors' && typeof stat.value === 'number') {
            return { ...stat, value: stat.value + Math.floor(Math.random() * 10) };
          }
          return stat; // Kembalikan stat tanpa perubahan jika tidak memenuhi kondisi
        })
      );
    }, 2000); // Update setiap 2 detik

    return () => clearInterval(interval); // Membersihkan interval saat komponen di-unmount
  }, []);

  // Fungsi untuk menangani klik pada endpoint
  const handleEndpointClick = (path: string) => {
    setIsSidebarVisible(true); // Munculkan sidebar
  };

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Fungsi untuk handle submit form
  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/textoins?prompt=${encodeURIComponent(inputValue)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setApiResult(data); // Simpan hasil API
    } catch (error) {
      console.error('Error fetching data:', error);
      setApiResult({ error: 'Failed to fetch data' }); // Tampilkan pesan error
    }
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" p={0}>
        <Flex>
          {/* Main Content */}
          <Box flex={1} p={8}>
            <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={8}>
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box className="card" p={6}>
                    <Flex align="center" justify="space-between">
                      <Box>
                        <Text color="gray.400" fontSize="sm" mb={1}>
                          {stat.label}
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold">
                          {typeof stat.value === 'number'
                            ? stat.value.toLocaleString() // Format angka dengan separator
                            : stat.value}
                        </Text>
                      </Box>
                      <Icon as={stat.icon} boxSize={6} color={stat.color} />
                    </Flex>
                  </Box>
                </motion.div>
              ))}
            </Grid>

            {/* API Documentation Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box className="card" p={8} minH="400px">
                <Flex justify="center" align="center" h="100%">
                  <Text color="gray.400">Select an endpoint to explore</Text>
                </Flex>
              </Box>
            </motion.div>
          </Box>
        </Flex>

        {/* Sidebar Bawah */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: isSidebarVisible ? 0 : '100%' }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50vh', // Sesuaikan tinggi sidebar
            backgroundColor: 'white',
            zIndex: 1000,
            boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box p={4}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Generate Image
            </Text>
            <Input
              placeholder="Enter a prompt"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              mb={4}
            />
            <Button onClick={handleSubmit} colorScheme="blue">
              Generate
            </Button>
            {apiResult && (
              <Box mt={4}>
                <Text fontSize="lg" fontWeight="bold">
                  Result:
                </Text>
                <pre>{JSON.stringify(apiResult, null, 2)}</pre>
              </Box>
            )}
          </Box>
          <Icon
            as={isSidebarVisible ? FiChevronDown : FiChevronUp}
            position="absolute"
            top={-8}
            left="50%"
            transform="translateX(-50%)"
            cursor="pointer"
            onClick={toggleSidebar}
          />
        </motion.div>
      </Container>
    </ChakraProvider>
  );
}
