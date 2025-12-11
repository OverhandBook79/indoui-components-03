import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Palette, Zap, Moon, Sun, Code, Layers, Sparkles, Github, ExternalLink, Search } from 'lucide-react';
import { Container, Flex, HStack, VStack, Heading, Text, Button, Badge, ColorModeSwitch } from '@/indoui';
import SearchModal from '@/components/SearchModal';

const CodeExample = () => {
  const code = `import { Button, Input, Stack } from '@indoui/react'

function App() {
  return (
    <Stack spacing={4}>
      <Input placeholder="Enter your email" />
      <Button variant="solid" colorScheme="primary">
        Subscribe
      </Button>
    </Stack>
  )
}`;

  return (
    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm animate-fade-in">
      <code className="text-foreground">{code}</code>
    </pre>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay?: string }> = ({
  icon,
  title,
  description,
  delay = '0ms',
}) => (
  <div 
    className="p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 animate-fade-in"
    style={{ animationDelay: delay }}
  >
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

// Animated gradient text component
const GradientText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse ${className}`}>
    {children}
  </span>
);

const Landing: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcuts: "/" or Ctrl+F to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" key to open search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setSearchQuery('');
          setSearchOpen(true);
        }
      }
      // Ctrl+F to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchQuery('');
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Search Modal */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        initialQuery={searchQuery}
      />

      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <Container maxW="6xl">
          <Flex justify="between" align="center" className="h-16">
            <HStack gap={2} className="animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
                <span className="text-primary-foreground font-bold text-sm">UI</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">IndoUI</span>
            </HStack>
            
            <HStack gap={4}>
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline ml-2 px-1.5 py-0.5 text-xs bg-background rounded">/</kbd>
              </button>
              <Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Docs
              </Link>
              <Link to="/playground" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Playground
              </Link>
              <a 
                href="https://github.com/indokudev/indoui" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <ColorModeSwitch size="sm" />
            </HStack>
          </Flex>
        </Container>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 relative">
        <Container maxW="4xl" centerContent>
          <Badge variant="subtle" size="lg" className="mb-6 animate-fade-in bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
            v1.0.0 - Stable Release
          </Badge>
          
          <Heading as="h1" size="4xl" className="text-center mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Build beautiful React apps with{' '}
            <GradientText>IndoUI</GradientText>
          </Heading>
          
          <Text size="lg" className="text-muted-foreground text-center max-w-2xl mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
            A simple, modular, and accessible component library that gives you the building blocks to create stunning web applications with React and Tailwind CSS.
          </Text>
          
          <HStack gap={4} className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link to="/docs">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow bg-gradient-to-r from-primary to-primary/90">
                Get Started
              </Button>
            </Link>
            <a href="https://github.com/indokudev/indoui" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" leftIcon={<Github className="h-4 w-4" />} className="border-primary/30 hover:border-primary/60 hover:bg-primary/5">
                GitHub
              </Button>
            </a>
          </HStack>
        </Container>
      </section>

      {/* Code Preview */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <Container maxW="4xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <Heading as="h2" size="2xl" className="mb-4">
                Simple & <GradientText>Intuitive</GradientText> API
              </Heading>
              <Text className="text-muted-foreground mb-6">
                Write less code with our Chakra-inspired API. Props like <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">variant</code>, <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">size</code>, and <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">colorScheme</code> make customization a breeze.
              </Text>
              <HStack gap={2}>
                <Button size="sm" variant="solid" className="shadow-md hover:shadow-lg transition-shadow">Solid</Button>
                <Button size="sm" variant="subtle">Subtle</Button>
                <Button size="sm" variant="outline">Outline</Button>
                <Button size="sm" variant="ghost">Ghost</Button>
              </HStack>
            </div>
            <CodeExample />
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-20">
        <Container maxW="6xl">
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="mb-4 animate-fade-in">
              Why <GradientText>IndoUI</GradientText>?
            </Heading>
            <Text className="text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
              Built for developers who want the power of Chakra UI with the simplicity of Tailwind CSS.
            </Text>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Box className="h-6 w-6" />}
              title="Layout Primitives"
              description="Box, Flex, Stack, Grid - all the layout components you need with intuitive props like w, h, p, m."
              delay="0ms"
            />
            <FeatureCard
              icon={<Palette className="h-6 w-6" />}
              title="6 Variants"
              description="Every component supports solid, subtle, surface, outline, ghost, and plain variants out of the box."
              delay="100ms"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Responsive Sizes"
              description="From xs to 2xl, all components scale perfectly with consistent sizing tokens."
              delay="200ms"
            />
            <FeatureCard
              icon={<Moon className="h-6 w-6" />}
              title="Dark Mode Ready"
              description="Built-in color mode support with localStorage persistence and system preference detection."
              delay="300ms"
            />
            <FeatureCard
              icon={<Code className="h-6 w-6" />}
              title="TypeScript First"
              description="Full TypeScript support with comprehensive type definitions for all components."
              delay="400ms"
            />
            <FeatureCard
              icon={<Layers className="h-6 w-6" />}
              title="Separable Library"
              description="Designed as a standalone library you can extract and publish to npm."
              delay="500ms"
            />
          </div>
        </Container>
      </section>

      {/* Installation */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <Container maxW="4xl">
          <div className="text-center mb-10">
            <Heading as="h2" size="3xl" className="mb-4 animate-fade-in">
              Quick <GradientText>Start</GradientText>
            </Heading>
            <Text className="text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
              Get up and running in minutes.
            </Text>
          </div>
          
          <div className="bg-background rounded-xl border border-border/50 p-6 mb-6 shadow-xl shadow-primary/5 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 transition-shadow" style={{ animationDelay: '200ms' }}>
            <Text size="sm" fontWeight="medium" className="mb-3 text-primary">
              Installation
            </Text>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto border border-border/50">
              <code className="text-foreground">npm install @indokudev/indoui</code>
            </pre>
          </div>
          
          <div className="bg-background rounded-xl border border-border/50 p-6 shadow-xl shadow-primary/5 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 transition-shadow" style={{ animationDelay: '300ms' }}>
            <Text size="sm" fontWeight="medium" className="mb-3 text-primary">
              Setup Provider
            </Text>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm border border-border/50">
              <code className="text-foreground">{`import { IndoUIProvider } from '@indokudev/indoui'

function App() {
  return (
    <IndoUIProvider>
      <YourApp />
    </IndoUIProvider>
  )
}`}</code>
            </pre>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container maxW="4xl" centerContent>
          <Heading as="h2" size="3xl" className="text-center mb-4 animate-fade-in">
            Ready to build something <GradientText>amazing</GradientText>?
          </Heading>
          <Text className="text-muted-foreground text-center mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Explore the docs to see IndoUI in action.
          </Text>
          <HStack gap={4} className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Link to="/docs">
              <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow bg-gradient-to-r from-primary to-primary/90">
                Read the Docs
              </Button>
            </Link>
            <a href="https://www.npmjs.com/package/@indokudev/indoui" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" leftIcon={<ExternalLink className="h-4 w-4" />} className="border-primary/30 hover:border-primary/60 hover:bg-primary/5">
                npm Package
              </Button>
            </a>
          </HStack>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-muted/20">
        <Container maxW="6xl">
          <Flex justify="between" align="center" className="flex-col md:flex-row gap-4">
            <VStack align="start" gap={1}>
              <Text size="sm" className="text-muted-foreground">
                © 2024 IndoUI v1.0.0. Built with <span className="text-red-500">❤️</span> by{' '}
                <a 
                  href="https://github.com/indokudev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  indokudev
                </a>
              </Text>
            </VStack>
            <HStack gap={6}>
              <a 
                href="https://github.com/indokudev/indoui" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a 
                href="https://www.npmjs.com/package/@indokudev/indoui" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                npm
              </a>
            </HStack>
          </Flex>
        </Container>
      </footer>
    </div>
  );
};

export default Landing;