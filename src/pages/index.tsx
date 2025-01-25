import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChakraProvider, Container, Box, Text, Input, Icon, Flex, Grid } from '@chakra-ui/react';
import { FiSearch, FiEye, FiClock, FiBox, FiActivity } from 'react-icons/fi';

const endpoints = [
  { method: 'GET', name: 'Animagine', category: 'AI' },
  { method: 'GET', name: 'Anipix', category: 'AI' },
  { method: 'GET', name: 'Artify', category: 'AI' },
  { method: 'POST', name: 'Chat GPT', category: 'AI' },
  { method: 'GET', name: 'Claude', category: 'AI' },
  { method: 'GET', name: 'Copilot', category: 'AI' },
];

const stats = [
  { label: 'Total Requests', value: '1,142,891', icon: FiActivity, color: 'blue.400' },
  { label: 'Total Visitors', value: '5,173', icon: FiEye, color: 'green.400' },
  { label: 'Total Endpoints', value: '170', icon: FiBox, color: 'yellow.400' },
  { label: 'Runtime', value: '14 day, 7 hour', icon: FiClock, color: 'purple.400' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

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
                          {stat.value}
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
      </Container>
    </ChakraProvider>
  );
}
