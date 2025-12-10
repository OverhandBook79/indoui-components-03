import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Menu, X, Code as CodeIcon, Eye, Copy, Check, Search, Download, Plus, Minus, Bell } from 'lucide-react';
import {
  Container, Flex, HStack, VStack, Heading, Text, Button, Badge, Input, Textarea, Select,
  Checkbox, Switch, Alert, Progress, Skeleton, Modal, ModalHeader, ModalBody, ModalFooter,
  Tabs, TabList, Tab, TabPanels, TabPanel, Accordion, AccordionItem, AccordionButton, AccordionPanel,
  ColorModeSwitch, Stack, Box, Divider, Radio, RadioGroup, Tooltip, Avatar, AvatarGroup, Tag,
  TagLabel, TagCloseButton, Code, Kbd, Stat, StatLabel, StatNumber, StatHelpText, StatArrow,
  Table, TableContainer, Thead, Tbody, Tr, Th, Td, Slider, PinInput, NumberInput, FileUpload,
  ColorPicker, DatePicker, Drawer, DrawerHeader, DrawerBody, DrawerFooter, TextEditor, FileTree,
  QRCode, SyntaxHighlighter, Spinner, EmptyState, PasswordInput, SegmentedControl, IconButton,
  Pagination, Timeline, Carousel, Image, List, ListItem, Breadcrumb, Steps, Clipboard, ClipboardButton,
  Mark, Highlight, Blockquote, Prose, Center, Wrap
} from '@/indoui';
import type { FileNode } from '@/indoui';
import { colorPalette, ColorScheme } from '@/indoui/theme/tokens';
import { toast } from 'sonner';

// Component card with flip to show code
interface ComponentCardProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}

// Animated gradient text component
const GradientText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

const ComponentCard: React.FC<ComponentCardProps> = ({ title, description, code, children }) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card mb-6 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-in">
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-muted/50 to-muted/30">
        <Flex justify="between" align="center">
          <div>
            <Text fontWeight="semibold" className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{title}</Text>
            <Text size="sm" className="text-muted-foreground">{description}</Text>
          </div>
          <HStack gap={2}>
            <Button
              size="xs"
              variant={showCode ? 'solid' : 'outline'}
              onClick={() => setShowCode(!showCode)}
              leftIcon={showCode ? <Eye className="h-3 w-3" /> : <CodeIcon className="h-3 w-3" />}
              className={showCode ? 'bg-gradient-to-r from-primary to-primary/80' : 'border-primary/30 hover:border-primary'}
            >
              {showCode ? 'Preview' : 'Code'}
            </Button>
            {showCode && (
              <Button
                size="xs"
                variant="ghost"
                onClick={copyCode}
                leftIcon={copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </HStack>
        </Flex>
      </div>
      
      <div className="p-6">
        {showCode ? (
          <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm border border-border/30">
            <code>{code}</code>
          </pre>
        ) : (
          <div className="flex flex-wrap gap-4 items-center">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
// Sidebar items with ALL components
const sidebarItems = [
  {
    category: 'Getting Started',
    items: [
      { id: 'installation', label: 'Installation' },
      { id: 'theming', label: 'Theming' },
      { id: 'colorscheme', label: 'Color Scheme' },
    ],
  },
  {
    category: 'Layout',
    items: [
      { id: 'box', label: 'Box' },
      { id: 'flex', label: 'Flex' },
      { id: 'stack', label: 'Stack' },
      { id: 'grid', label: 'Grid' },
      { id: 'container', label: 'Container' },
      { id: 'divider', label: 'Divider' },
      { id: 'center', label: 'Center & Wrap' },
    ],
  },
  {
    category: 'Typography',
    items: [
      { id: 'heading', label: 'Heading' },
      { id: 'text', label: 'Text' },
      { id: 'prose', label: 'Prose & Highlight' },
    ],
  },
  {
    category: 'Forms',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'iconbutton', label: 'Icon Button' },
      { id: 'input', label: 'Input' },
      { id: 'passwordinput', label: 'Password Input' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'select', label: 'Select' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'radio', label: 'Radio' },
      { id: 'switch', label: 'Switch' },
      { id: 'slider', label: 'Slider' },
      { id: 'pininput', label: 'Pin Input' },
      { id: 'numberinput', label: 'Number Input' },
      { id: 'fileupload', label: 'File Upload' },
      { id: 'colorpicker', label: 'Color Picker' },
      { id: 'datepicker', label: 'Date Picker' },
      { id: 'segmentedcontrol', label: 'Segmented Control' },
    ],
  },
  {
    category: 'Data Display',
    items: [
      { id: 'avatar', label: 'Avatar' },
      { id: 'badge', label: 'Badge' },
      { id: 'tag', label: 'Tag' },
      { id: 'code', label: 'Code & Kbd' },
      { id: 'syntaxhighlighter', label: 'Syntax Highlighter' },
      { id: 'qrcode', label: 'QR Code' },
      { id: 'stat', label: 'Stat' },
      { id: 'table', label: 'Table' },
      { id: 'list', label: 'List' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'clipboard', label: 'Clipboard' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'image', label: 'Image' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'texteditor', label: 'Text Editor' },
      { id: 'filetree', label: 'File Tree' },
    ],
  },
  {
    category: 'Feedback',
    items: [
      { id: 'alert', label: 'Alert' },
      { id: 'progress', label: 'Progress' },
      { id: 'skeleton', label: 'Skeleton' },
      { id: 'spinner', label: 'Spinner' },
      { id: 'emptystate', label: 'Empty State' },
    ],
  },
  {
    category: 'Overlay',
    items: [
      { id: 'modal', label: 'Modal' },
      { id: 'drawer', label: 'Drawer' },
    ],
  },
  {
    category: 'Navigation',
    items: [
      { id: 'tabs', label: 'Tabs' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
      { id: 'steps', label: 'Steps' },
    ],
  },
];

const CodeBlock: React.FC<{ children: string }> = ({ children }) => (
  <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm my-4">
    <code>{children}</code>
  </pre>
);

// ============= GETTING STARTED =============

const InstallationDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>Installation</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">Get started with IndoUI in your React project. IndoUI is a Chakra UI-inspired component library built with Tailwind CSS.</Text>
    
    <ComponentCard title="1. Install the package" description="Using npm or yarn" code={`npm install @indoui/react`}>
      <CodeBlock>{`npm install @indoui/react`}</CodeBlock>
    </ComponentCard>
    
    <ComponentCard
      title="2. Setup Provider"
      description="Wrap your app with IndoUIProvider for theming support"
      code={`import { IndoUIProvider } from '@indoui/react'

function App() {
  return (
    <IndoUIProvider>
      <YourApp />
    </IndoUIProvider>
  )
}`}
    >
      <Text>Wrap your application with IndoUIProvider to enable theming and color mode.</Text>
    </ComponentCard>
    
    <ComponentCard
      title="3. Use Components"
      description="Import and use any component"
      code={`import { Button, Input, Stack } from '@indoui/react'

function MyComponent() {
  return (
    <Stack spacing={4}>
      <Input placeholder="Enter text..." />
      <Button colorScheme="blue">Click me</Button>
    </Stack>
  )
}`}
    >
      <Stack gap={4}>
        <Input placeholder="Enter text..." className="max-w-xs" />
        <Button colorScheme="blue">Click me</Button>
      </Stack>
    </ComponentCard>
  </div>
);

const ThemingDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>Theming</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">IndoUI supports light/dark mode with automatic system detection. Use the built-in hooks and components to manage color modes.</Text>
    
    <ComponentCard
      title="Color Mode Switch"
      description="Toggle between light and dark mode"
      code={`import { ColorModeSwitch, useColorMode } from '@indoui/react'

// Using component
<ColorModeSwitch />

// Using hook
const { colorMode, toggleColorMode } = useColorMode()`}
    >
      <HStack gap={4}>
        <ColorModeSwitch />
        <Text>Click to toggle theme</Text>
      </HStack>
    </ComponentCard>
    
    <ComponentCard
      title="useColorModeValue"
      description="Use different values for light/dark mode"
      code={`import { useColorModeValue } from '@indoui/react'

// Supports color tokens!
const bg = useColorModeValue('blue.100', 'blue.900')
const text = useColorModeValue('gray.800', 'gray.100')`}
    >
      <Text>useColorModeValue supports color tokens like "red.500", "blue.300"</Text>
    </ComponentCard>
    
    <ComponentCard
      title="Sizes"
      description="All components support consistent sizes: xs, sm, md, lg, xl, 2xl"
      code={`<Button size="xs">XS</Button>
<Button size="sm">SM</Button>
<Button size="md">MD</Button>
<Button size="lg">LG</Button>
<Button size="xl">XL</Button>
<Button size="2xl">2XL</Button>`}
    >
      <HStack gap={2} className="flex-wrap">
        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
          <Button key={size} size={size}>{size}</Button>
        ))}
      </HStack>
    </ComponentCard>
  </div>
);

const ColorSchemeDocs = () => {
  const colorSchemes: ColorScheme[] = ['primary', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'cyan', 'lime', 'orange', 'teal', 'rose', 'coral', 'gray'];
  
  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">Color Scheme</Heading>
      <Text className="text-muted-foreground mb-8">
        IndoUI includes 20+ color palettes. Each color has shades from 50-900. Use colorScheme prop on any component.
      </Text>
      
      <ComponentCard
        title="Available Color Schemes"
        description="Use colorScheme prop on any component"
        code={`// Available colorSchemes:
// primary, neutral, gray, red, blue, green, yellow, pink,
// purple, cyan, lime, rose, brown, maroon, coral, tan,
// banana, orange, teal, black, white

<Button colorScheme="blue">Blue</Button>
<Button colorScheme="red">Red</Button>
<Button colorScheme="green">Green</Button>`}
      >
        <HStack gap={2} className="flex-wrap">
          {colorSchemes.map((color) => (
            <Button key={color} colorScheme={color} size="sm">{color}</Button>
          ))}
        </HStack>
      </ComponentCard>
      
      <ComponentCard
        title="Variants with ColorScheme"
        description="Combine variants with color schemes for different styles"
        code={`<Button variant="solid" colorScheme="blue">Solid</Button>
<Button variant="subtle" colorScheme="blue">Subtle</Button>
<Button variant="outline" colorScheme="blue">Outline</Button>
<Button variant="ghost" colorScheme="blue">Ghost</Button>`}
      >
        <VStack gap={4} align="start">
          {['solid', 'subtle', 'outline', 'ghost'].map((variant) => (
            <HStack key={variant} gap={2}>
              <Text size="sm" className="w-16">{variant}:</Text>
              {['blue', 'red', 'green', 'purple'].map((color) => (
                <Button
                  key={color}
                  variant={variant as any}
                  colorScheme={color as ColorScheme}
                  size="sm"
                >
                  {color}
                </Button>
              ))}
            </HStack>
          ))}
        </VStack>
      </ComponentCard>
    </div>
  );
};

// ============= LAYOUT =============

const BoxDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Box</Heading>
    <Text className="text-muted-foreground mb-8">The most abstract component - renders a div with style props. Use it as a building block for other components.</Text>
    
    <ComponentCard
      title="Basic Box"
      description="A simple container with padding and background"
      code={`<Box className="bg-primary/20 p-4 rounded-lg">
  <Text>I'm a Box!</Text>
</Box>`}
    >
      <Box className="bg-primary/20 p-4 rounded-lg">
        <Text>I am a Box!</Text>
      </Box>
    </ComponentCard>
  </div>
);

const FlexDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Flex</Heading>
    <Text className="text-muted-foreground mb-8">Flexbox layout component for arranging items horizontally or vertically. Includes HStack (horizontal) and VStack (vertical) helpers.</Text>
    
    <ComponentCard
      title="Basic Flex"
      description="Horizontal layout with gap"
      code={`<Flex gap={4}>
  <Box className="bg-primary/20 p-4 rounded">1</Box>
  <Box className="bg-primary/20 p-4 rounded">2</Box>
  <Box className="bg-primary/20 p-4 rounded">3</Box>
</Flex>`}
    >
      <Flex gap={4}>
        <div className="bg-primary/20 p-4 rounded">1</div>
        <div className="bg-primary/20 p-4 rounded">2</div>
        <div className="bg-primary/20 p-4 rounded">3</div>
      </Flex>
    </ComponentCard>
    
    <ComponentCard
      title="HStack & VStack"
      description="Shorthand for horizontal and vertical stacks"
      code={`<HStack gap={4}>
  <Box>H1</Box>
  <Box>H2</Box>
</HStack>

<VStack gap={4}>
  <Box>V1</Box>
  <Box>V2</Box>
</VStack>`}
    >
      <VStack gap={4} align="start">
        <div>
          <Text size="sm" className="mb-2">HStack:</Text>
          <HStack gap={4}>
            <div className="bg-blue-500/20 p-2 rounded">H1</div>
            <div className="bg-blue-500/20 p-2 rounded">H2</div>
            <div className="bg-blue-500/20 p-2 rounded">H3</div>
          </HStack>
        </div>
        <div>
          <Text size="sm" className="mb-2">VStack:</Text>
          <VStack gap={2}>
            <div className="bg-green-500/20 p-2 rounded">V1</div>
            <div className="bg-green-500/20 p-2 rounded">V2</div>
          </VStack>
        </div>
      </VStack>
    </ComponentCard>
  </div>
);

const StackDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Stack</Heading>
    <Text className="text-muted-foreground mb-8">Layout component for stacking elements with consistent spacing. Direction can be vertical or horizontal.</Text>
    
    <ComponentCard
      title="Vertical Stack"
      description="Stack items vertically (default)"
      code={`<Stack gap={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
</Stack>`}
    >
      <Stack gap={4}>
        <div className="bg-primary/20 p-4 rounded">Item 1</div>
        <div className="bg-primary/20 p-4 rounded">Item 2</div>
        <div className="bg-primary/20 p-4 rounded">Item 3</div>
      </Stack>
    </ComponentCard>
    
    <ComponentCard
      title="Horizontal Stack"
      description="Stack items horizontally"
      code={`<Stack direction="horizontal" gap={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Stack>`}
    >
      <Stack direction="horizontal" gap={4}>
        <div className="bg-primary/20 p-4 rounded">Item 1</div>
        <div className="bg-primary/20 p-4 rounded">Item 2</div>
        <div className="bg-primary/20 p-4 rounded">Item 3</div>
      </Stack>
    </ComponentCard>
  </div>
);

const GridDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Grid</Heading>
    <Text className="text-muted-foreground mb-8">CSS Grid layout component for complex layouts.</Text>
    
    <ComponentCard
      title="Basic Grid"
      description="3-column grid layout"
      code={`<Grid columns={3} gap={4}>
  {[1,2,3,4,5,6].map(i => (
    <Box key={i}>{i}</Box>
  ))}
</Grid>`}
    >
      <div className="grid grid-cols-3 gap-4 w-full">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-primary/20 p-4 rounded text-center">{i}</div>
        ))}
      </div>
    </ComponentCard>
  </div>
);

const ContainerDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Container</Heading>
    <Text className="text-muted-foreground mb-8">Constrains content width and centers it. Useful for page layouts.</Text>
    
    <ComponentCard
      title="Max Width Container"
      description="Container with different max widths"
      code={`<Container maxW="sm">Small</Container>
<Container maxW="md">Medium</Container>
<Container maxW="lg">Large</Container>
<Container maxW="xl">XL</Container>`}
    >
      <VStack gap={2} align="stretch" className="w-full">
        {['sm', 'md', 'lg'].map((size) => (
          <Container key={size} maxW={size as any} className="bg-primary/10 p-2 rounded">
            <Text size="sm">maxW="{size}"</Text>
          </Container>
        ))}
      </VStack>
    </ComponentCard>
  </div>
);

const DividerDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Divider</Heading>
    <Text className="text-muted-foreground mb-8">Visual separator between content sections.</Text>
    
    <ComponentCard
      title="Horizontal Divider"
      description="Separates content vertically"
      code={`<VStack gap={4}>
  <Text>Above</Text>
  <Divider />
  <Text>Below</Text>
</VStack>`}
    >
      <VStack gap={4} className="w-full">
        <Text>Content above</Text>
        <Divider />
        <Text>Content below</Text>
      </VStack>
    </ComponentCard>
  </div>
);

const CenterDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Center & Wrap</Heading>
    <Text className="text-muted-foreground mb-8">Utility layout components for centering and wrapping content.</Text>
    
    <ComponentCard
      title="Center"
      description="Centers content both horizontally and vertically"
      code={`<Center className="h-32 bg-muted rounded-lg">
  <Text>Centered Content</Text>
</Center>`}
    >
      <Center className="h-32 w-full bg-muted rounded-lg">
        <Text>Centered Content</Text>
      </Center>
    </ComponentCard>
    
    <ComponentCard
      title="Wrap"
      description="Wraps items to next line when space runs out"
      code={`<Wrap gap={2}>
  <Badge>Item 1</Badge>
  <Badge>Item 2</Badge>
  <Badge>Item 3</Badge>
</Wrap>`}
    >
      <Wrap spacing={2}>
        {['React', 'TypeScript', 'Tailwind', 'Vite', 'Node.js', 'GraphQL'].map((item) => (
          <Badge key={item} colorScheme="blue">{item}</Badge>
        ))}
      </Wrap>
    </ComponentCard>
  </div>
);

// ============= TYPOGRAPHY =============

const HeadingDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Heading</Heading>
    <Text className="text-muted-foreground mb-8">Heading component for titles. Supports different sizes and semantic HTML elements (h1-h6).</Text>
    
    <ComponentCard
      title="Heading Sizes"
      description="Different heading sizes from xs to 4xl"
      code={`<Heading size="4xl">Heading 4XL</Heading>
<Heading size="3xl">Heading 3XL</Heading>
<Heading size="2xl">Heading 2XL</Heading>
<Heading size="xl">Heading XL</Heading>
<Heading size="lg">Heading LG</Heading>`}
    >
      <VStack gap={2} align="start">
        <Heading size="4xl">Heading 4XL</Heading>
        <Heading size="3xl">Heading 3XL</Heading>
        <Heading size="2xl">Heading 2XL</Heading>
        <Heading size="xl">Heading XL</Heading>
        <Heading size="lg">Heading LG</Heading>
      </VStack>
    </ComponentCard>
  </div>
);

const TextDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Text</Heading>
    <Text className="text-muted-foreground mb-8">Text component for body text. Supports different sizes, weights, and colors.</Text>
    
    <ComponentCard
      title="Text Sizes"
      description="Different text sizes"
      code={`<Text size="xs">Extra Small</Text>
<Text size="sm">Small</Text>
<Text size="md">Medium</Text>
<Text size="lg">Large</Text>
<Text size="xl">Extra Large</Text>`}
    >
      <VStack gap={2} align="start">
        <Text size="xs">Extra Small Text</Text>
        <Text size="sm">Small Text</Text>
        <Text size="md">Medium Text (default)</Text>
        <Text size="lg">Large Text</Text>
        <Text size="xl">Extra Large Text</Text>
      </VStack>
    </ComponentCard>
    
    <ComponentCard
      title="Font Weights"
      description="Different font weights"
      code={`<Text fontWeight="normal">Normal</Text>
<Text fontWeight="medium">Medium</Text>
<Text fontWeight="semibold">Semibold</Text>
<Text fontWeight="bold">Bold</Text>`}
    >
      <VStack gap={2} align="start">
        <Text fontWeight="normal">Normal weight</Text>
        <Text fontWeight="medium">Medium weight</Text>
        <Text fontWeight="semibold">Semibold weight</Text>
        <Text fontWeight="bold">Bold weight</Text>
      </VStack>
    </ComponentCard>
  </div>
);

const ProseDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Prose & Highlight</Heading>
    <Text className="text-muted-foreground mb-8">Components for rich text content including Mark, Highlight, Blockquote, and Prose.</Text>
    
    <ComponentCard
      title="Mark & Highlight"
      description="Highlight text for emphasis"
      code={`<Text>
  This is <Mark>marked text</Mark> and{" "}
  <Highlight query="highlight">highlighted text</Highlight>
</Text>`}
    >
      <VStack gap={2} align="start">
        <Text>This contains <Mark>marked text</Mark> for emphasis</Text>
        <Text><Highlight query="important">This important text is highlighted</Highlight></Text>
      </VStack>
    </ComponentCard>
    
    <ComponentCard
      title="Blockquote"
      description="For quotations"
      code={`<Blockquote>
  The only way to do great work is to love what you do.
</Blockquote>`}
    >
      <Blockquote>
        The only way to do great work is to love what you do. - Steve Jobs
      </Blockquote>
    </ComponentCard>
  </div>
);

// ============= FORMS =============

const ButtonDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Button</Heading>
    <Text className="text-muted-foreground mb-8">A versatile button component with multiple variants, sizes, and color schemes. Supports loading states and icons.</Text>
    
    <ComponentCard
      title="Variants"
      description="6 different visual styles"
      code={`<Button variant="solid">Solid</Button>
<Button variant="subtle">Subtle</Button>
<Button variant="surface">Surface</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="plain">Plain</Button>`}
    >
      <Button variant="solid">Solid</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="surface">Surface</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="plain">Plain</Button>
    </ComponentCard>
    
    <ComponentCard
      title="Color Schemes"
      description="Use any color from the palette"
      code={`<Button colorScheme="blue">Blue</Button>
<Button colorScheme="red">Red</Button>
<Button colorScheme="green">Green</Button>
<Button colorScheme="purple">Purple</Button>`}
    >
      <Button colorScheme="blue">Blue</Button>
      <Button colorScheme="red">Red</Button>
      <Button colorScheme="green">Green</Button>
      <Button colorScheme="purple">Purple</Button>
      <Button colorScheme="orange">Orange</Button>
    </ComponentCard>
    
    <ComponentCard
      title="States"
      description="Loading and disabled states"
      code={`<Button loading>Loading</Button>
<Button disabled>Disabled</Button>`}
    >
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
    </ComponentCard>
  </div>
);

const IconButtonDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Icon Button</Heading>
    <Text className="text-muted-foreground mb-8">Button component for icon-only actions. Requires aria-label for accessibility.</Text>
    
    <ComponentCard
      title="Basic Icon Button"
      description="Different sizes and variants"
      code={`<IconButton icon={<Plus />} aria-label="Add" />
<IconButton icon={<Bell />} aria-label="Notifications" variant="outline" />
<IconButton icon={<Download />} aria-label="Download" colorScheme="blue" />`}
    >
      <HStack gap={2}>
        <IconButton icon={<Plus className="h-4 w-4" />} aria-label="Add" />
        <IconButton icon={<Bell className="h-4 w-4" />} aria-label="Notifications" variant="outline" />
        <IconButton icon={<Download className="h-4 w-4" />} aria-label="Download" colorScheme="blue" />
      </HStack>
    </ComponentCard>
    
    <ComponentCard
      title="Sizes"
      description="Different icon button sizes"
      code={`<IconButton size="xs" icon={<Plus />} aria-label="Add" />
<IconButton size="sm" icon={<Plus />} aria-label="Add" />
<IconButton size="md" icon={<Plus />} aria-label="Add" />
<IconButton size="lg" icon={<Plus />} aria-label="Add" />`}
    >
      <HStack gap={2}>
        <IconButton size="xs" icon={<Plus className="h-3 w-3" />} aria-label="Add" />
        <IconButton size="sm" icon={<Plus className="h-3.5 w-3.5" />} aria-label="Add" />
        <IconButton size="md" icon={<Plus className="h-4 w-4" />} aria-label="Add" />
        <IconButton size="lg" icon={<Plus className="h-5 w-5" />} aria-label="Add" />
      </HStack>
    </ComponentCard>
  </div>
);

const InputDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Input</Heading>
    <Text className="text-muted-foreground mb-8">Text input component with multiple variants. Supports different sizes and states.</Text>
    
    <ComponentCard
      title="Variants"
      description="3 input styles: outline, filled, flushed"
      code={`<Input variant="outline" placeholder="Outline" />
<Input variant="filled" placeholder="Filled" />
<Input variant="flushed" placeholder="Flushed" />`}
    >
      <Stack gap={4} className="w-full max-w-md">
        <Input variant="outline" placeholder="Outline variant" />
        <Input variant="filled" placeholder="Filled variant" />
        <Input variant="flushed" placeholder="Flushed variant" />
      </Stack>
    </ComponentCard>
    
    <ComponentCard
      title="Sizes"
      description="Different input sizes"
      code={`<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />`}
    >
      <Stack gap={4} className="w-full max-w-md">
        <Input size="sm" placeholder="Small" />
        <Input size="md" placeholder="Medium" />
        <Input size="lg" placeholder="Large" />
      </Stack>
    </ComponentCard>
  </div>
);

const PasswordInputDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Password Input</Heading>
    <Text className="text-muted-foreground mb-8">Password input with toggle visibility button.</Text>
    
    <ComponentCard
      title="Basic Password Input"
      description="Click the eye icon to toggle visibility"
      code={`<PasswordInput placeholder="Enter password" />`}
    >
      <div className="w-full max-w-md">
        <PasswordInput placeholder="Enter your password" />
      </div>
    </ComponentCard>
  </div>
);

const TextareaDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Textarea</Heading>
    <Text className="text-muted-foreground mb-8">Multi-line text input. Same variants as Input component.</Text>
    
    <ComponentCard
      title="Variants"
      description="Same variants as Input"
      code={`<Textarea variant="outline" placeholder="Write here..." />
<Textarea variant="filled" placeholder="Filled style" />`}
    >
      <Stack gap={4} className="w-full max-w-md">
        <Textarea variant="outline" placeholder="Outline variant" />
        <Textarea variant="filled" placeholder="Filled variant" />
      </Stack>
    </ComponentCard>
  </div>
);

const SelectDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Select</Heading>
    <Text className="text-muted-foreground mb-8">Dropdown select component for choosing from a list of options.</Text>
    
    <ComponentCard
      title="Basic Select"
      description="Dropdown with options"
      code={`<Select
  placeholder="Select option"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ]}
/>`}
    >
      <Select
        placeholder="Select an option"
        options={[
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
        ]}
        className="max-w-xs"
      />
    </ComponentCard>
  </div>
);

const CheckboxDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Checkbox</Heading>
    <Text className="text-muted-foreground mb-8">Checkbox input component for boolean selections. Supports color schemes.</Text>
    
    <ComponentCard
      title="Basic Checkbox"
      description="With label and states"
      code={`<Checkbox label="Option 1" />
<Checkbox label="Checked" defaultChecked />
<Checkbox label="Disabled" disabled />`}
    >
      <Stack gap={3}>
        <Checkbox label="Option 1" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Disabled" disabled />
      </Stack>
    </ComponentCard>
    
    <ComponentCard
      title="Color Schemes"
      description="Customize checkbox color"
      code={`<Checkbox colorScheme="blue" label="Blue" defaultChecked />
<Checkbox colorScheme="green" label="Green" defaultChecked />
<Checkbox colorScheme="red" label="Red" defaultChecked />`}
    >
      <HStack gap={4}>
        <Checkbox colorScheme="blue" label="Blue" defaultChecked />
        <Checkbox colorScheme="green" label="Green" defaultChecked />
        <Checkbox colorScheme="red" label="Red" defaultChecked />
      </HStack>
    </ComponentCard>
  </div>
);

const RadioDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Radio</Heading>
    <Text className="text-muted-foreground mb-8">Radio button for single selection from multiple options.</Text>
    
    <ComponentCard
      title="Radio Group"
      description="Group of radio buttons - only one can be selected"
      code={`<RadioGroup name="options" defaultValue="1">
  <Radio value="1" label="Option 1" />
  <Radio value="2" label="Option 2" />
  <Radio value="3" label="Option 3" />
</RadioGroup>`}
    >
      <RadioGroup name="demo" defaultValue="1">
        <Stack gap={2}>
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
          <Radio value="3" label="Option 3" />
        </Stack>
      </RadioGroup>
    </ComponentCard>
  </div>
);

const SwitchDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Switch</Heading>
    <Text className="text-muted-foreground mb-8">Toggle switch component for on/off states.</Text>
    
    <ComponentCard
      title="Basic Switch"
      description="Toggle on/off"
      code={`<Switch label="Enable notifications" />
<Switch label="Dark mode" defaultChecked />`}
    >
      <Stack gap={3}>
        <Switch label="Enable notifications" />
        <Switch label="Dark mode" defaultChecked />
      </Stack>
    </ComponentCard>
    
    <ComponentCard
      title="Sizes & Colors"
      description="Different sizes and color schemes"
      code={`<Switch size="sm" colorScheme="green" label="Small" />
<Switch size="md" colorScheme="blue" label="Medium" />
<Switch size="lg" colorScheme="purple" label="Large" />`}
    >
      <Stack gap={3}>
        <Switch size="sm" colorScheme="green" label="Small Green" defaultChecked />
        <Switch size="md" colorScheme="blue" label="Medium Blue" defaultChecked />
        <Switch size="lg" colorScheme="purple" label="Large Purple" defaultChecked />
      </Stack>
    </ComponentCard>
  </div>
);

const SliderDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Slider</Heading>
    <Text className="text-muted-foreground mb-8">Range slider input for selecting numeric values.</Text>
    
    <ComponentCard
      title="Basic Slider"
      description="Single value slider"
      code={`<Slider defaultValue={50} min={0} max={100} />`}
    >
      <div className="w-full max-w-md">
        <Slider defaultValue={50} min={0} max={100} />
      </div>
    </ComponentCard>
    
    <ComponentCard
      title="Color Schemes"
      description="Customize slider color"
      code={`<Slider colorScheme="blue" defaultValue={30} />
<Slider colorScheme="green" defaultValue={60} />
<Slider colorScheme="purple" defaultValue={80} />`}
    >
      <Stack gap={6} className="w-full max-w-md">
        <Slider colorScheme="blue" defaultValue={30} />
        <Slider colorScheme="green" defaultValue={60} />
        <Slider colorScheme="purple" defaultValue={80} />
      </Stack>
    </ComponentCard>
  </div>
);

const PinInputDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Pin Input</Heading>
    <Text className="text-muted-foreground mb-8">OTP/PIN code input for verification codes.</Text>
    
    <ComponentCard
      title="Basic Pin Input"
      description="4-digit PIN entry"
      code={`<PinInput length={4} />`}
    >
      <PinInput length={4} />
    </ComponentCard>
    
    <ComponentCard
      title="Masked Input"
      description="Hide entered values for security"
      code={`<PinInput length={6} mask />`}
    >
      <PinInput length={6} mask />
    </ComponentCard>
  </div>
);

const NumberInputDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Number Input</Heading>
    <Text className="text-muted-foreground mb-8">Numeric input with increment/decrement buttons.</Text>
    
    <ComponentCard
      title="Basic Number Input"
      description="With increment/decrement buttons"
      code={`<NumberInput defaultValue={10} min={0} max={100} step={1} />`}
    >
      <NumberInput defaultValue={10} min={0} max={100} step={1} />
    </ComponentCard>
  </div>
);

const FileUploadDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">File Upload</Heading>
    <Text className="text-muted-foreground mb-8">Drag and drop file upload with file type validation.</Text>
    
    <ComponentCard
      title="Dropzone"
      description="Drag files or click to upload"
      code={`<FileUpload
  accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
  maxFiles={5}
  onFilesChange={(files) => console.log(files)}
/>`}
    >
      <div className="w-full max-w-md">
        <FileUpload
          accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
          maxFiles={5}
          onFilesChange={(files) => console.log('Files:', files)}
        />
      </div>
    </ComponentCard>
  </div>
);

const ColorPickerDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Color Picker</Heading>
    <Text className="text-muted-foreground mb-8">Visual color selection component.</Text>
    
    <ComponentCard
      title="Basic Color Picker"
      description="Pick any color"
      code={`<ColorPicker defaultValue="#3b82f6" />`}
    >
      <ColorPicker defaultValue="#3b82f6" />
    </ComponentCard>
  </div>
);

const DatePickerDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Date Picker</Heading>
    <Text className="text-muted-foreground mb-8">Calendar-based date selection.</Text>
    
    <ComponentCard
      title="Basic Date Picker"
      description="Single date selection"
      code={`<DatePicker placeholder="Select date" />`}
    >
      <DatePicker placeholder="Select a date" />
    </ComponentCard>
  </div>
);

const SegmentedControlDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Segmented Control</Heading>
    <Text className="text-muted-foreground mb-8">Button group for switching between options. Great for view toggles.</Text>
    
    <ComponentCard
      title="Basic Segmented Control"
      description="Toggle between options"
      code={`<SegmentedControl
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'table', label: 'Table' },
  ]}
  defaultValue="list"
/>`}
    >
      <SegmentedControl
        options={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
          { value: 'table', label: 'Table' },
        ]}
        value="list"
        onChange={() => {}}
      />
    </ComponentCard>
  </div>
);

// ============= DATA DISPLAY =============

const AvatarDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Avatar</Heading>
    <Text className="text-muted-foreground mb-8">Display user profile images with fallback to initials.</Text>
    
    <ComponentCard
      title="Basic Avatar"
      description="With image or fallback initials"
      code={`<Avatar src="https://i.pravatar.cc/150?img=1" name="John Doe" />
<Avatar name="Jane Smith" />
<Avatar />`}
    >
      <HStack gap={4}>
        <Avatar src="https://i.pravatar.cc/150?img=1" name="John Doe" />
        <Avatar name="Jane Smith" />
        <Avatar />
      </HStack>
    </ComponentCard>
    
    <ComponentCard
      title="Sizes"
      description="Different avatar sizes"
      code={`<Avatar size="xs" name="XS" />
<Avatar size="sm" name="SM" />
<Avatar size="md" name="MD" />
<Avatar size="lg" name="LG" />
<Avatar size="xl" name="XL" />`}
    >
      <HStack gap={4} align="center">
        <Avatar size="xs" name="XS" />
        <Avatar size="sm" name="SM" />
        <Avatar size="md" name="MD" />
        <Avatar size="lg" name="LG" />
        <Avatar size="xl" name="XL" />
      </HStack>
    </ComponentCard>
    
    <ComponentCard
      title="Avatar Group"
      description="Stack multiple avatars with overflow"
      code={`<AvatarGroup max={3}>
  <Avatar src="https://i.pravatar.cc/150?img=1" />
  <Avatar src="https://i.pravatar.cc/150?img=2" />
  <Avatar src="https://i.pravatar.cc/150?img=3" />
  <Avatar src="https://i.pravatar.cc/150?img=4" />
</AvatarGroup>`}
    >
      <AvatarGroup max={3}>
        <Avatar src="https://i.pravatar.cc/150?img=1" name="User 1" />
        <Avatar src="https://i.pravatar.cc/150?img=2" name="User 2" />
        <Avatar src="https://i.pravatar.cc/150?img=3" name="User 3" />
        <Avatar src="https://i.pravatar.cc/150?img=4" name="User 4" />
        <Avatar src="https://i.pravatar.cc/150?img=5" name="User 5" />
      </AvatarGroup>
    </ComponentCard>
  </div>
);

const BadgeDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Badge</Heading>
    <Text className="text-muted-foreground mb-8">Small status descriptors for labels and counts.</Text>
    
    <ComponentCard
      title="Variants"
      description="4 badge styles"
      code={`<Badge variant="solid">Solid</Badge>
<Badge variant="subtle">Subtle</Badge>
<Badge variant="surface">Surface</Badge>
<Badge variant="outline">Outline</Badge>`}
    >
      <Badge variant="solid">Solid</Badge>
      <Badge variant="subtle">Subtle</Badge>
      <Badge variant="surface">Surface</Badge>
      <Badge variant="outline">Outline</Badge>
    </ComponentCard>
    
    <ComponentCard
      title="Color Schemes"
      description="Semantic colors for status"
      code={`<Badge colorScheme="green">Success</Badge>
<Badge colorScheme="red">Error</Badge>
<Badge colorScheme="yellow">Warning</Badge>
<Badge colorScheme="blue">Info</Badge>`}
    >
      <Badge colorScheme="green">Success</Badge>
      <Badge colorScheme="red">Error</Badge>
      <Badge colorScheme="yellow">Warning</Badge>
      <Badge colorScheme="blue">Info</Badge>
    </ComponentCard>
  </div>
);

const TagDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Tag</Heading>
    <Text className="text-muted-foreground mb-8">Labels for categorization with optional close button.</Text>
    
    <ComponentCard
      title="Basic Tag"
      description="With close button"
      code={`<Tag colorScheme="blue">
  <TagLabel>React</TagLabel>
  <TagCloseButton />
</Tag>`}
    >
      <HStack gap={2}>
        <Tag colorScheme="blue">
          <TagLabel>React</TagLabel>
          <TagCloseButton />
        </Tag>
        <Tag colorScheme="green">
          <TagLabel>TypeScript</TagLabel>
          <TagCloseButton />
        </Tag>
        <Tag colorScheme="purple">
          <TagLabel>Tailwind</TagLabel>
          <TagCloseButton />
        </Tag>
      </HStack>
    </ComponentCard>
  </div>
);

const CodeDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Code & Kbd</Heading>
    <Text className="text-muted-foreground mb-8">Display inline code snippets and keyboard shortcuts.</Text>
    
    <ComponentCard
      title="Inline Code"
      description="Highlight code in text"
      code={`<Text>
  Run <Code>npm install</Code> to install dependencies.
</Text>`}
    >
      <Text>Run <Code>npm install</Code> to install dependencies.</Text>
    </ComponentCard>
    
    <ComponentCard
      title="Keyboard Shortcuts"
      description="Display key combinations"
      code={`<HStack>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</HStack>`}
    >
      <HStack gap={1}>
        <Kbd>⌘</Kbd>
        <Text>+</Text>
        <Kbd>K</Kbd>
        <Text className="ml-4">to open command palette</Text>
      </HStack>
    </ComponentCard>
  </div>
);

const SyntaxHighlighterDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Syntax Highlighter</Heading>
    <Text className="text-muted-foreground mb-8">VS Code-style syntax highlighting for code blocks. Supports many languages with line numbers and copy button.</Text>
    
    <ComponentCard
      title="Basic Usage"
      description="Syntax highlighted code block with line numbers"
      code={`<SyntaxHighlighter language="typescript">
{\`const greeting = "Hello, World!";
console.log(greeting);\`}
</SyntaxHighlighter>`}
    >
      <div className="w-full">
        <SyntaxHighlighter language="typescript">
{`const greeting = "Hello, World!";
console.log(greeting);`}
        </SyntaxHighlighter>
      </div>
    </ComponentCard>
    
    <ComponentCard
      title="With Filename"
      description="Show file name in header"
      code={`<SyntaxHighlighter language="tsx" filename="App.tsx">
{\`function App() {
  return <div>Hello</div>;
}\`}
</SyntaxHighlighter>`}
    >
      <div className="w-full">
        <SyntaxHighlighter language="tsx" filename="App.tsx">
{`import React from 'react';

function App() {
  return (
    <div className="container">
      <h1>Hello, World!</h1>
    </div>
  );
}

export default App;`}
        </SyntaxHighlighter>
      </div>
    </ComponentCard>
    
    <ComponentCard
      title="Light Theme"
      description="Light mode syntax highlighting"
      code={`<SyntaxHighlighter language="typescript" theme="light">
{\`const sum = (a: number, b: number) => a + b;\`}
</SyntaxHighlighter>`}
    >
      <div className="w-full">
        <SyntaxHighlighter language="typescript" theme="light" filename="math.ts">
{`const sum = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;

export { sum, multiply };`}
        </SyntaxHighlighter>
      </div>
    </ComponentCard>
  </div>
);

const QRCodeDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">QR Code</Heading>
    <Text className="text-muted-foreground mb-8">Generate QR codes for URLs, text, or any data. Supports different sizes and error correction levels.</Text>
    
    <ComponentCard
      title="Basic QR Code"
      description="Generate a QR code from any string"
      code={`<QRCode value="https://indoui.dev" />`}
    >
      <QRCode value="https://indoui.dev" />
    </ComponentCard>
    
    <ComponentCard
      title="Sizes"
      description="Different QR code sizes"
      code={`<QRCode value="Hello" size="xs" />
<QRCode value="Hello" size="sm" />
<QRCode value="Hello" size="md" />
<QRCode value="Hello" size="lg" />`}
    >
      <HStack gap={4} align="end">
        <VStack gap={2}>
          <Text size="xs">xs</Text>
          <QRCode value="Hello IndoUI!" size="xs" />
        </VStack>
        <VStack gap={2}>
          <Text size="xs">sm</Text>
          <QRCode value="Hello IndoUI!" size="sm" />
        </VStack>
        <VStack gap={2}>
          <Text size="xs">md</Text>
          <QRCode value="Hello IndoUI!" size="md" />
        </VStack>
      </HStack>
    </ComponentCard>
  </div>
);

const StatDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Stat</Heading>
    <Text className="text-muted-foreground mb-8">Display statistics with labels and trend indicators.</Text>
    
    <ComponentCard
      title="Basic Stat"
      description="Number with label and help text"
      code={`<Stat>
  <StatLabel>Revenue</StatLabel>
  <StatNumber>$45,000</StatNumber>
  <StatHelpText>
    <StatArrow type="increase" />
    23.5%
  </StatHelpText>
</Stat>`}
    >
      <HStack gap={8}>
        <Stat>
          <StatLabel>Revenue</StatLabel>
          <StatNumber>$45,000</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.5%
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Users</StatLabel>
          <StatNumber>1,234</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            5.2%
          </StatHelpText>
        </Stat>
      </HStack>
    </ComponentCard>
  </div>
);

const TableDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Table</Heading>
    <Text className="text-muted-foreground mb-8">Display tabular data with sorting and styling options.</Text>
    
    <ComponentCard
      title="Basic Table"
      description="Simple data table"
      code={`<Table>
  <Thead>
    <Tr>
      <Th>Name</Th>
      <Th>Role</Th>
      <Th>Status</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>John Doe</Td>
      <Td>Developer</Td>
      <Td><Badge colorScheme="green">Active</Badge></Td>
    </Tr>
  </Tbody>
</Table>`}
    >
      <TableContainer className="w-full">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>John Doe</Td>
              <Td>Developer</Td>
              <Td><Badge colorScheme="green">Active</Badge></Td>
            </Tr>
            <Tr>
              <Td>Jane Smith</Td>
              <Td>Designer</Td>
              <Td><Badge colorScheme="blue">Away</Badge></Td>
            </Tr>
            <Tr>
              <Td>Bob Johnson</Td>
              <Td>Manager</Td>
              <Td><Badge colorScheme="yellow">Busy</Badge></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </ComponentCard>
  </div>
);

const ListDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">List</Heading>
    <Text className="text-muted-foreground mb-8">Display lists of items with optional icons.</Text>
    
    <ComponentCard
      title="Basic List"
      description="Simple list of items"
      code={`<List>
  <ListItem>First item</ListItem>
  <ListItem>Second item</ListItem>
  <ListItem>Third item</ListItem>
</List>`}
    >
      <List>
        <ListItem>First item</ListItem>
        <ListItem>Second item</ListItem>
        <ListItem>Third item</ListItem>
      </List>
    </ComponentCard>
  </div>
);

const TooltipDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Tooltip</Heading>
    <Text className="text-muted-foreground mb-8">Show contextual information on hover.</Text>
    
    <ComponentCard
      title="Basic Tooltip"
      description="Hover to see tooltip"
      code={`<Tooltip label="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>`}
    >
      <Tooltip label="This is a helpful tooltip!">
        <Button>Hover me</Button>
      </Tooltip>
    </ComponentCard>
  </div>
);

const ClipboardDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Clipboard</Heading>
    <Text className="text-muted-foreground mb-8">Copy text to clipboard with one click.</Text>
    
    <ComponentCard
      title="Basic Clipboard"
      description="Click to copy text"
      code={`<Clipboard value="Text to copy">
  <ClipboardButton />
</Clipboard>`}
    >
      <HStack gap={2}>
        <Code>npm install @indoui/react</Code>
        <ClipboardButton value="npm install @indoui/react" />
      </HStack>
    </ComponentCard>
  </div>
);

const TimelineDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Timeline</Heading>
    <Text className="text-muted-foreground mb-8">Display a sequence of events in chronological order.</Text>
    
    <ComponentCard
      title="Basic Timeline"
      description="Show events in order"
      code={`<Timeline
  items={[
    { title: 'Order placed', description: 'Your order has been confirmed' },
    { title: 'Processing', description: 'Order is being prepared' },
    { title: 'Shipped', description: 'On the way to you' },
  ]}
/>`}
    >
      <Timeline
        items={[
          { title: 'Order placed', description: 'Your order has been confirmed', time: '10:00 AM', status: 'complete' as const },
          { title: 'Processing', description: 'Order is being prepared', time: '11:30 AM', status: 'current' as const },
          { title: 'Shipped', description: 'On the way to you', time: '2:00 PM', status: 'pending' as const },
        ]}
      />
    </ComponentCard>
  </div>
);

const CarouselDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Carousel</Heading>
    <Text className="text-muted-foreground mb-8">Image/content carousel with navigation controls.</Text>
    
    <ComponentCard
      title="Basic Carousel"
      description="Slide through content"
      code={`<Carousel
  items={[
    <div className="bg-primary/20 h-48 rounded-lg flex items-center justify-center">Slide 1</div>,
    <div className="bg-blue-500/20 h-48 rounded-lg flex items-center justify-center">Slide 2</div>,
    <div className="bg-green-500/20 h-48 rounded-lg flex items-center justify-center">Slide 3</div>,
  ]}
/>`}
    >
      <div className="w-full max-w-md">
        <Carousel>
          <div className="bg-primary/20 h-48 rounded-lg flex items-center justify-center">Slide 1</div>
          <div className="bg-blue-500/20 h-48 rounded-lg flex items-center justify-center">Slide 2</div>
          <div className="bg-green-500/20 h-48 rounded-lg flex items-center justify-center">Slide 3</div>
        </Carousel>
      </div>
    </ComponentCard>
  </div>
);

const ImageDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Image</Heading>
    <Text className="text-muted-foreground mb-8">Enhanced image component with fallback support.</Text>
    
    <ComponentCard
      title="Basic Image"
      description="Image with border radius"
      code={`<Image
  src="https://picsum.photos/200"
  alt="Sample image"
  className="rounded-lg"
/>`}
    >
      <Image
        src="https://picsum.photos/200"
        alt="Sample image"
        className="rounded-lg"
      />
    </ComponentCard>
  </div>
);

const PaginationDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Pagination</Heading>
    <Text className="text-muted-foreground mb-8">Navigate through pages of content.</Text>
    
    <ComponentCard
      title="Basic Pagination"
      description="Page navigation controls"
      code={`<Pagination
  total={100}
  pageSize={10}
  currentPage={1}
  onPageChange={(page) => console.log(page)}
/>`}
    >
      <Pagination
        totalPages={10}
        currentPage={1}
        onPageChange={(page) => console.log('Page:', page)}
      />
    </ComponentCard>
  </div>
);

const TextEditorDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Text Editor</Heading>
    <Text className="text-muted-foreground mb-8">Rich text editor with formatting toolbar.</Text>
    
    <ComponentCard
      title="Basic Text Editor"
      description="Markdown-style text editor with formatting options"
      code={`<TextEditor
  placeholder="Start typing..."
  onChange={(value) => console.log(value)}
  minHeight="200px"
/>`}
    >
      <div className="w-full">
        <TextEditor placeholder="Start typing your content here..." minHeight="150px" />
      </div>
    </ComponentCard>
  </div>
);

// Sample file tree data
const sampleFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Button.tsx', type: 'file' },
          { name: 'Input.tsx', type: 'file' },
        ],
      },
      { name: 'App.tsx', type: 'file' },
      { name: 'main.tsx', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
];

const FileTreeDocs = () => {
  const [selectedPath, setSelectedPath] = useState<string>('');
  
  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">File Tree</Heading>
      <Text className="text-muted-foreground mb-8">Hierarchical file/folder navigation component.</Text>
      
      <ComponentCard
        title="Basic File Tree"
        description="Interactive file tree with expand/collapse"
        code={`const fileTree = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'App.tsx', type: 'file' },
    ],
  },
];

<FileTree data={fileTree} onFileClick={(file, path) => console.log(path)} />`}
      >
        <div className="w-full max-w-xs">
          <FileTree
            data={sampleFileTree}
            onFileClick={(file, path) => {
              setSelectedPath(path);
              toast.info(`Selected: ${path}`);
            }}
            selectedPath={selectedPath}
          />
        </div>
      </ComponentCard>
    </div>
  );
};

// ============= FEEDBACK =============

const AlertDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Alert</Heading>
    <Text className="text-muted-foreground mb-8">Display important messages with different status types.</Text>
    
    <ComponentCard
      title="Status Types"
      description="4 alert statuses: info, success, warning, error"
      code={`<Alert status="info" title="Info" description="Informational message" />
<Alert status="success" title="Success" description="Operation completed" />
<Alert status="warning" title="Warning" description="Please review" />
<Alert status="error" title="Error" description="Something went wrong" />`}
    >
      <Stack gap={4} className="w-full">
        <Alert status="info" title="Info" description="This is an informational message." />
        <Alert status="success" title="Success" description="Operation completed successfully." />
        <Alert status="warning" title="Warning" description="Please review before proceeding." />
        <Alert status="error" title="Error" description="Something went wrong." />
      </Stack>
    </ComponentCard>
  </div>
);

const ProgressDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Progress</Heading>
    <Text className="text-muted-foreground mb-8">Show progress indication for operations.</Text>
    
    <ComponentCard
      title="Basic Progress"
      description="Different values and colors"
      code={`<Progress value={30} />
<Progress value={60} colorScheme="green" />
<Progress value={80} colorScheme="orange" />`}
    >
      <Stack gap={4} className="w-full">
        <Progress value={30} />
        <Progress value={60} colorScheme="green" />
        <Progress value={80} colorScheme="orange" />
      </Stack>
    </ComponentCard>
    
    <ComponentCard
      title="Striped & Animated"
      description="Visual enhancements"
      code={`<Progress value={70} hasStripe isAnimated />`}
    >
      <Progress value={70} hasStripe isAnimated className="w-full" />
    </ComponentCard>
  </div>
);

const SkeletonDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Skeleton</Heading>
    <Text className="text-muted-foreground mb-8">Placeholder loading states for content.</Text>
    
    <ComponentCard
      title="Basic Skeleton"
      description="Loading placeholders"
      code={`<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-4 w-1/2" />`}
    >
      <Stack gap={4} className="w-full">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </Stack>
    </ComponentCard>
  </div>
);

const SpinnerDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Spinner</Heading>
    <Text className="text-muted-foreground mb-8">Loading spinner indicator.</Text>
    
    <ComponentCard
      title="Sizes"
      description="Different spinner sizes"
      code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`}
    >
      <HStack gap={4}>
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </HStack>
    </ComponentCard>
    
    <ComponentCard
      title="Colors"
      description="Different color schemes"
      code={`<Spinner colorScheme="blue" />
<Spinner colorScheme="green" />
<Spinner colorScheme="red" />`}
    >
      <HStack gap={4}>
        <Spinner colorScheme="blue" />
        <Spinner colorScheme="green" />
        <Spinner colorScheme="red" />
      </HStack>
    </ComponentCard>
  </div>
);

const EmptyStateDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Empty State</Heading>
    <Text className="text-muted-foreground mb-8">Display when no content is available.</Text>
    
    <ComponentCard
      title="Basic Empty State"
      description="With title, description, and action"
      code={`<EmptyState
  title="No items found"
  description="Try adjusting your search or filters"
  action={<Button>Add Item</Button>}
/>`}
    >
      <EmptyState
        title="No items found"
        description="Try adjusting your search or filters to find what you are looking for."
        action={<Button size="sm">Add Item</Button>}
      />
    </ComponentCard>
  </div>
);

// ============= OVERLAY =============

const ModalDocs = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">Modal</Heading>
      <Text className="text-muted-foreground mb-8">Display content in an overlay dialog.</Text>
      
      <ComponentCard
        title="Basic Modal"
        description="Dialog with header, body, and footer"
        code={`const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader onClose={() => setIsOpen(false)}>Title</ModalHeader>
  <ModalBody>Content here</ModalBody>
  <ModalFooter>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </ModalFooter>
</Modal>`}
      >
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalHeader onClose={() => setIsOpen(false)}>Modal Title</ModalHeader>
          <ModalBody>
            <Text>This is the modal content. You can put anything here.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </ModalFooter>
        </Modal>
      </ComponentCard>
    </div>
  );
};

const DrawerDocs = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">Drawer</Heading>
      <Text className="text-muted-foreground mb-8">Slide-in panel from screen edge.</Text>
      
      <ComponentCard
        title="Basic Drawer"
        description="Slides in from the right"
        code={`const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>Open Drawer</Button>

<Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <DrawerHeader onClose={() => setIsOpen(false)}>Title</DrawerHeader>
  <DrawerBody>Content here</DrawerBody>
  <DrawerFooter>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </DrawerFooter>
</Drawer>`}
      >
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerHeader onClose={() => setIsOpen(false)}>Drawer Title</DrawerHeader>
          <DrawerBody>
            <Text>This is drawer content. Great for side panels, navigation, or forms.</Text>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsOpen(false)}>Save</Button>
          </DrawerFooter>
        </Drawer>
      </ComponentCard>
    </div>
  );
};

// ============= NAVIGATION =============

const TabsDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Tabs</Heading>
    <Text className="text-muted-foreground mb-8">Organize content into tabbed sections.</Text>
    
    <ComponentCard
      title="Line Variant"
      description="Default tab style with underline indicator"
      code={`<Tabs variant="line">
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
    <Tab>Tab 3</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
    <TabPanel>Content 3</TabPanel>
  </TabPanels>
</Tabs>`}
    >
      <Tabs variant="line" className="w-full">
        <TabList>
          <Tab>Account</Tab>
          <Tab>Security</Tab>
          <Tab>Notifications</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Account settings content</TabPanel>
          <TabPanel>Security settings content</TabPanel>
          <TabPanel>Notification preferences</TabPanel>
        </TabPanels>
      </Tabs>
    </ComponentCard>
    
    <ComponentCard
      title="Soft Rounded"
      description="Pill-style tabs"
      code={`<Tabs variant="soft-rounded">...</Tabs>`}
    >
      <Tabs variant="soft-rounded" className="w-full">
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Content 1</TabPanel>
          <TabPanel>Content 2</TabPanel>
          <TabPanel>Content 3</TabPanel>
        </TabPanels>
      </Tabs>
    </ComponentCard>
  </div>
);

const AccordionDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Accordion</Heading>
    <Text className="text-muted-foreground mb-8">Expandable content sections for FAQs and more.</Text>
    
    <ComponentCard
      title="Basic Accordion"
      description="Collapsible panels"
      code={`<Accordion allowMultiple>
  <AccordionItem>
    <AccordionButton>Section 1</AccordionButton>
    <AccordionPanel>Content 1</AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <AccordionButton>Section 2</AccordionButton>
    <AccordionPanel>Content 2</AccordionPanel>
  </AccordionItem>
</Accordion>`}
    >
      <Accordion allowMultiple className="w-full">
        <AccordionItem>
          <AccordionButton>What is IndoUI?</AccordionButton>
          <AccordionPanel>
            IndoUI is a React component library inspired by Chakra UI, built with Tailwind CSS.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>How do I install it?</AccordionButton>
          <AccordionPanel>
            Run npm install @indoui/react and wrap your app with IndoUIProvider.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>Is it free?</AccordionButton>
          <AccordionPanel>
            Yes! IndoUI is open source and free to use.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </ComponentCard>
  </div>
);

const BreadcrumbDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Breadcrumb</Heading>
    <Text className="text-muted-foreground mb-8">Navigation breadcrumbs showing the current page location.</Text>
    
    <ComponentCard
      title="Basic Breadcrumb"
      description="Show navigation path"
      code={`<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Details', isCurrentPage: true },
  ]}
/>`}
    >
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Electronics', href: '/products/electronics' },
          { label: 'Phones' },
        ]}
      />
    </ComponentCard>
  </div>
);

const StepsDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Steps</Heading>
    <Text className="text-muted-foreground mb-8">Step indicator for multi-step processes.</Text>
    
    <ComponentCard
      title="Basic Steps"
      description="Show progress through a process"
      code={`<Steps
  currentStep={1}
  steps={[
    { title: 'Account', description: 'Create account' },
    { title: 'Profile', description: 'Add details' },
    { title: 'Complete', description: 'Finish setup' },
  ]}
/>`}
    >
      <div className="w-full">
        <Steps
          currentStep={1}
          steps={[
            { title: 'Account', description: 'Create account' },
            { title: 'Profile', description: 'Add details' },
            { title: 'Complete', description: 'Finish setup' },
          ]}
        />
      </div>
    </ComponentCard>
  </div>
);

// ============= COMPONENT MAPPING =============

const componentDocs: Record<string, React.FC> = {
  installation: InstallationDocs,
  theming: ThemingDocs,
  colorscheme: ColorSchemeDocs,
  box: BoxDocs,
  flex: FlexDocs,
  stack: StackDocs,
  grid: GridDocs,
  container: ContainerDocs,
  divider: DividerDocs,
  center: CenterDocs,
  heading: HeadingDocs,
  text: TextDocs,
  prose: ProseDocs,
  button: ButtonDocs,
  iconbutton: IconButtonDocs,
  input: InputDocs,
  passwordinput: PasswordInputDocs,
  textarea: TextareaDocs,
  select: SelectDocs,
  checkbox: CheckboxDocs,
  radio: RadioDocs,
  switch: SwitchDocs,
  slider: SliderDocs,
  pininput: PinInputDocs,
  numberinput: NumberInputDocs,
  fileupload: FileUploadDocs,
  colorpicker: ColorPickerDocs,
  datepicker: DatePickerDocs,
  segmentedcontrol: SegmentedControlDocs,
  avatar: AvatarDocs,
  badge: BadgeDocs,
  tag: TagDocs,
  code: CodeDocs,
  syntaxhighlighter: SyntaxHighlighterDocs,
  qrcode: QRCodeDocs,
  stat: StatDocs,
  table: TableDocs,
  list: ListDocs,
  tooltip: TooltipDocs,
  clipboard: ClipboardDocs,
  timeline: TimelineDocs,
  carousel: CarouselDocs,
  image: ImageDocs,
  pagination: PaginationDocs,
  texteditor: TextEditorDocs,
  filetree: FileTreeDocs,
  alert: AlertDocs,
  progress: ProgressDocs,
  skeleton: SkeletonDocs,
  spinner: SpinnerDocs,
  emptystate: EmptyStateDocs,
  modal: ModalDocs,
  drawer: DrawerDocs,
  tabs: TabsDocs,
  accordion: AccordionDocs,
  breadcrumb: BreadcrumbDocs,
  steps: StepsDocs,
};

// ============= MAIN DOCS PAGE =============

const Docs: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('installation');
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Get all searchable items
  const allItems = useMemo(() => {
    return sidebarItems.flatMap(section => section.items);
  }, []);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return allItems.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allItems]);

  // Scroll to section when clicking sidebar
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setSearchQuery('');
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setSidebarOpen(false);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredItems && filteredItems.length > 0) {
      scrollToSection(filteredItems[0].id);
      toast.success(`Jumped to ${filteredItems[0].label}`);
    } else if (searchQuery.trim()) {
      toast.error('No matching component found');
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const [id, ref] of Object.entries(sectionRefs.current)) {
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <Container maxW="7xl">
          <Flex justify="between" align="center" className="h-16">
            <HStack gap={4}>
              <button
                className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link to="/">
                <HStack gap={2} className="hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
                    <span className="text-primary-foreground font-bold text-sm">UI</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">IndoUI</span>
                </HStack>
              </Link>
            </HStack>
            
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs flex-1 mx-4">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              {filteredItems && filteredItems.length > 0 && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-lg shadow-xl shadow-primary/5 z-50 max-h-64 overflow-y-auto animate-fade-in">
                  {filteredItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </form>
            
            <HStack gap={4}>
              <Link to="/playground" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Playground
              </Link>
              <ColorModeSwitch size="sm" />
            </HStack>
          </Flex>
        </Container>
      </header>

      <Container maxW="7xl">
        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 
              bg-background/95 backdrop-blur-sm border-r border-border/50 overflow-y-auto
              transition-transform duration-300 z-40
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <nav className="p-4 space-y-6">
              {sidebarItems.map((section, sectionIndex) => (
                <div key={section.category} className="animate-fade-in" style={{ animationDelay: `${sectionIndex * 50}ms` }}>
                  <Text size="sm" fontWeight="semibold" className="text-primary/80 mb-2 uppercase tracking-wider text-xs">
                    {section.category}
                  </Text>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`
                            w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                            ${activeSection === item.id 
                              ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-medium border-l-2 border-primary' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:translate-x-1'
                            }
                          `}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content - All sections rendered */}
          <main className="flex-1 min-w-0 py-8 px-4 lg:px-8">
            <div className="max-w-4xl space-y-16">
              {Object.entries(componentDocs).map(([id, Component]) => (
                <section
                  key={id}
                  id={id}
                  ref={(el) => { if (el) sectionRefs.current[id] = el; }}
                  className="scroll-mt-20 animate-fade-in"
                >
                  <Component />
                  <Divider className="mt-12 opacity-30" />
                </section>
              ))}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
};

export default Docs;
