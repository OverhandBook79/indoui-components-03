import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';
import { Container, Flex, HStack, Heading, Text, Button, ColorModeSwitch, VStack } from '@/indoui';

const Playground: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <Container maxW="7xl">
          <Flex justify="between" align="center" className="h-16">
            <Link to="/">
              <HStack gap={2}>
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">UI</span>
                </div>
                <span className="font-bold text-xl">IndoUI</span>
              </HStack>
            </Link>
            
            <HStack gap={4}>
              <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Docs
              </Link>
              <ColorModeSwitch size="sm" />
            </HStack>
          </Flex>
        </Container>
      </header>

      {/* Under Construction Content */}
      <Container maxW="7xl" className="py-16">
        <VStack gap={6} className="items-center justify-center min-h-[60vh] text-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <Construction className="w-12 h-12 text-muted-foreground" />
          </div>
          
          <Heading as="h1" size="4xl">Under Construction</Heading>
          
          <Text className="text-muted-foreground max-w-md">
            The playground is temporarily disabled while we're working on exciting new features. 
            Check back soon!
          </Text>
          
          <HStack gap={4} className="mt-4">
            <Link to="/docs">
              <Button colorScheme="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Go to Docs
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
    </div>
  );
};

export default Playground;