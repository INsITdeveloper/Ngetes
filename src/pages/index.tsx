import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ChakraProvider, Box, Container, Heading, Text } from '@chakra-ui/react';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });
import 'swagger-ui-react/swagger-ui.css';

const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'FFStalk API Documentation',
    version: '1.0.0',
    description: 'API documentation for FFStalk service',
  },
  servers: [
    {
      url: '/api',
      description: 'API Server',
    },
  ],
  paths: {
    '/ffstalk': {
      get: {
        summary: 'Get FF user information',
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'FF user ID',
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                    },
                    data: {
                      type: 'object',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default function Home() {
  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={10}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading as="h1" size="2xl" mb={6} textAlign="center">
            FFStalk API Documentation
          </Heading>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Text fontSize="lg" mb={8} textAlign="center">
              Explore our API endpoints with interactive documentation
            </Text>
          </motion.div>

          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="xl"
            as={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }} // Update this line
          >
            <SwaggerUI spec={swaggerConfig} />
          </Box>
        </motion.div>
      </Container>
    </ChakraProvider>
  );
}
