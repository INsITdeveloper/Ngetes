import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChakraProvider, Container, Box, Text, Input, Icon, Flex, Grid, Button } from '@chakra-ui/react';
import { FiSearch, FiEye, FiClock, FiBox, FiActivity } from 'react-icons/fi';

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
  const [isLoading, setIsLoading] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [curlCommand, setCurlCommand] = useState('');

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
    setInputPrompt(''); // Reset input prompt
    setApiResponse(null); // Reset API response
    setCurlCommand(''); // Reset cURL command
  };

  // Fungsi untuk memanggil API
  const handleExecute = async () => {
    setIsLoading(true);
    setApiResponse(null);
    setCurlCommand('');

    try {
      const response = await fetch(`/api/textoins?prompt=${encodeURIComponent(inputPrompt)}`);
      const data = await response.json();

      if (response.ok) {
        setApiResponse(data);
        // Generate cURL command
        setCurlCommand(
          `curl -X GET "http://localhost:3000/api/textoins?prompt=${encodeURIComponent(inputPrompt)}"`
        );
      } else {
        setApiResponse({ error: data.error || 'Failed to fetch data' });
      }
    } catch (error) {
      setApiResponse({ error: 'An error occurred while fetching data' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" p={0}>
        <Flex>
          {/* Sidebar */}
          <Box className="sidebar" w="250px" h="100vh" p={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Text fontSize="2xl" fontWeight="bold" mb={6}>
                API Documentation
              </Text>
              <Box position="relative" mb={6}>
                <Input
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  pl={10}
                />
                <Icon
                  as={FiSearch}
                  position="absolute"
                  left={3}
                  top={3}
                  color="gray.400"
                />
              </Box>
              <Box>
                {endpoints.map((endpoint, index) => (
                  <motion.div
                    key={endpoint.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Flex
                      align="center"
                      p={2}
                      mb={2}
                      cursor="pointer"
                      _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                      borderRadius="md"
                      onClick={() => handleEndpointClick(endpoint.path)} // Tambahkan ini
                    >
                      <span className={`api-method ${endpoint.method.toLowerCase()}`}>
                        {endpoint.method}
                      </span>
                      <Text ml={3}>{endpoint.name}</Text>
                    </Flex>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Box>

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
                <Flex direction="column" gap={4}>
                  {/* Input Prompt */}
                  <Input
                    placeholder="Enter a prompt (e.g., A young man wearing a cool black hoodie in a cyberpunk style)"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                  />

                  {/* Execute Button */}
                  <Button
                    onClick={handleExecute}
                    colorScheme="blue"
                    isLoading={isLoading}
                    loadingText="Executing..."
                  >
                    Execute
                  </Button>

                  {/* cURL Command */}
                  {curlCommand && (
                    <Box bg="gray.100" p={4} borderRadius="md">
                      <Text fontSize="sm" fontWeight="bold" mb={2}>
                        cURL Command:
                      </Text>
                      <Text fontSize="sm" fontFamily="monospace" whiteSpace="pre-wrap">
                        {curlCommand}
                      </Text>
                    </Box>
                  )}

                  {/* API Response */}
                  {apiResponse && (
                    <Box bg="gray.100" p={4} borderRadius="md">
                      <Text fontSize="sm" fontWeight="bold" mb={2}>
                        API Response:
                      </Text>
                      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                    </Box>
                  )}
                </Flex>
              </Box>
            </motion.div>
          </Box>
        </Flex>
      </Container>
    </ChakraProvider>
  );
}
