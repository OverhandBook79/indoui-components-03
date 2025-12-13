import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Menu, X, Code as CodeIcon, Eye, Copy, Check, Search, Download, Plus, Minus, Bell } from 'lucide-react';
import SearchModal from '@/components/SearchModal';
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
  Mark, Highlight, Blockquote, Prose, Center, Wrap, Splitter, Toast, ToastContainer,
  CodeEditor, WebPlayer, DownloadTrigger,
  AspectImage, AspectVideo, AspectIframe,
  SimpleVideoCall, RoomCodeDisplay, JoinRoomForm, ChatRoom, useLocalMedia,
  useColorMode, useColorModeValue, useBreakpointValue, useThemeToken
} from '@/indoui';
import { Menu as MenuComponent, ContextMenu, MenuDivider } from '@/indoui/components/overlay/Menu';
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

// Live Video Demo for docs
const LiveVideoDemo = () => {
  const { localStream, isVideoEnabled, isMicEnabled, startMedia, stopMedia, toggleVideo, toggleMic } = useLocalMedia();
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = async () => {
    await startMedia();
    setIsStarted(true);
  };

  const handleEnd = () => {
    stopMedia();
    setIsStarted(false);
  };

  if (!isStarted) {
    return (
      <Box className="p-8 border border-border rounded-lg bg-muted/30 text-center">
        <Text className="text-muted-foreground mb-4">Click to start camera preview</Text>
        <Button onClick={handleStart}>Start Camera</Button>
      </Box>
    );
  }

  return (
    <Box w="full">
      <SimpleVideoCall
        localStream={localStream}
        isVideoEnabled={isVideoEnabled}
        isMicEnabled={isMicEnabled}
        onToggleVideo={toggleVideo}
        onToggleMic={toggleMic}
        onEndCall={handleEnd}
        h="300px"
      />
      <Text size="xs" className="text-muted-foreground mt-2 text-center">
        Test room code: TEST-123-DEMO (Share this to connect with others)
      </Text>
    </Box>
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
    category: 'Hooks',
    items: [
      { id: 'usecolormode', label: 'useColorMode' },
      { id: 'usecolormodevalue', label: 'useColorModeValue' },
      { id: 'usebreakpointvalue', label: 'useBreakpointValue' },
      { id: 'usethemetoken', label: 'useThemeToken' },
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
      { id: 'splitter', label: 'Splitter' },
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
      { id: 'downloadtrigger', label: 'Download Trigger' },
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
      { id: 'aspectratio', label: 'Aspect Ratio' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'texteditor', label: 'Text Editor' },
      { id: 'filetree', label: 'File Tree' },
    ],
  },
  {
    category: 'Feedback',
    items: [
      { id: 'alert', label: 'Alert' },
      { id: 'toast', label: 'Toast' },
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
      { id: 'menu', label: 'Menu' },
    ],
  },
  {
    category: 'Advanced',
    items: [
      { id: 'codeeditor', label: 'Code Editor' },
      { id: 'webplayer', label: 'Web Player' },
      { id: 'videocall', label: 'Video Call' },
      { id: 'chatroom', label: 'Chat Room' },
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
    
    <ComponentCard title="1. Install the package" description="Using npm or yarn" code={`npm install @indokudev/indoui`}>
      <CodeBlock>{`npm install @indokudev/indoui`}</CodeBlock>
    </ComponentCard>
    
    <ComponentCard
      title="2. Setup Provider"
      description="Wrap your app with IndoUIProvider for theming support"
      code={`import { IndoUIProvider } from '@indokudev/indoui'

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
      code={`import { Button, Input, Stack } from '@indokudev/indoui'

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

// ============= HOOKS =============

const UseColorModeDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>useColorMode</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">Hook to manage and toggle between light and dark color modes.</Text>
    
    <ComponentCard
      title="Basic Usage"
      description="Get and toggle color mode"
      code={`import { useColorMode } from '@indokudev/indoui'

function MyComponent() {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  
  return (
    <div>
      <p>Current mode: {colorMode}</p>
      <button onClick={toggleColorMode}>Toggle</button>
      <button onClick={() => setColorMode('dark')}>Set Dark</button>
    </div>
  );
}`}
    >
      <VStack gap={4} align="start">
        <Text>Current mode: <Code>{useColorMode().colorMode}</Code></Text>
        <HStack gap={2}>
          <Button size="sm" onClick={useColorMode().toggleColorMode}>Toggle Mode</Button>
          <ColorModeSwitch />
        </HStack>
      </VStack>
    </ComponentCard>
    
    <ComponentCard
      title="Return Values"
      description="What the hook returns"
      code={`const { 
  colorMode,      // 'light' | 'dark'
  toggleColorMode, // () => void
  setColorMode,   // (mode: 'light' | 'dark') => void
  setTheme,       // (theme: string) => void
} = useColorMode();`}
    >
      <Table variant="simple" size="sm">
        <Thead>
          <Tr><Th>Property</Th><Th>Type</Th><Th>Description</Th></Tr>
        </Thead>
        <Tbody>
          <Tr><Td><Code>colorMode</Code></Td><Td>'light' | 'dark'</Td><Td>Current color mode</Td></Tr>
          <Tr><Td><Code>toggleColorMode</Code></Td><Td>() =&gt; void</Td><Td>Toggle between modes</Td></Tr>
          <Tr><Td><Code>setColorMode</Code></Td><Td>(mode) =&gt; void</Td><Td>Set specific mode</Td></Tr>
        </Tbody>
      </Table>
    </ComponentCard>
  </div>
);

const UseColorModeValueDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>useColorModeValue</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">Returns different values based on the current color mode. Supports color token resolution.</Text>
    
    <ComponentCard
      title="Basic Usage"
      description="Use different values for light/dark mode"
      code={`import { useColorModeValue } from '@indokudev/indoui'

function MyComponent() {
  const bg = useColorModeValue('white', 'gray.900');
  const color = useColorModeValue('gray.800', 'gray.100');
  
  return (
    <div style={{ background: bg, color }}>
      Content that adapts to color mode
    </div>
  );
}`}
    >
      <Box className="p-4 rounded-lg border border-border">
        <Text>This box uses <Code>useColorModeValue</Code> for adaptive colors</Text>
      </Box>
    </ComponentCard>
    
    <ComponentCard
      title="With Color Tokens"
      description="Supports color tokens like 'red.500'"
      code={`// Supports color tokens!
const color = useColorModeValue('blue.500', 'blue.300');
const bg = useColorModeValue('gray.100', 'gray.800');

// Also works with any values
const padding = useColorModeValue(4, 6);`}
    >
      <Text>Color tokens like <Code>"red.500"</Code> are automatically resolved to their RGB values.</Text>
    </ComponentCard>
  </div>
);

const UseBreakpointValueDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>useBreakpointValue</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">Returns values based on the current viewport breakpoint. Great for responsive designs.</Text>
    
    <ComponentCard
      title="Basic Usage"
      description="Different values for different screen sizes"
      code={`import { useBreakpointValue } from '@indokudev/indoui'

function MyComponent() {
  const columns = useBreakpointValue({ 
    base: 1, 
    sm: 2, 
    md: 3, 
    lg: 4 
  });
  
  const padding = useBreakpointValue({ base: 2, md: 4, lg: 8 });
  
  return <Grid columns={columns} p={padding}>...</Grid>;
}`}
    >
      <Text>Resize the window to see values change based on breakpoint.</Text>
    </ComponentCard>
    
    <ComponentCard
      title="Available Breakpoints"
      description="Default breakpoint values"
      code={`// Breakpoints
base: 0px
sm: 640px  
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px`}
    >
      <Table variant="simple" size="sm">
        <Thead>
          <Tr><Th>Breakpoint</Th><Th>Min Width</Th></Tr>
        </Thead>
        <Tbody>
          <Tr><Td><Code>base</Code></Td><Td>0px</Td></Tr>
          <Tr><Td><Code>sm</Code></Td><Td>640px</Td></Tr>
          <Tr><Td><Code>md</Code></Td><Td>768px</Td></Tr>
          <Tr><Td><Code>lg</Code></Td><Td>1024px</Td></Tr>
          <Tr><Td><Code>xl</Code></Td><Td>1280px</Td></Tr>
          <Tr><Td><Code>2xl</Code></Td><Td>1536px</Td></Tr>
        </Tbody>
      </Table>
    </ComponentCard>
    
    <ComponentCard
      title="Related Hooks"
      description="Other breakpoint utilities"
      code={`import { 
  useBreakpoint, 
  useBreakpointUp, 
  useBreakpointDown 
} from '@indokudev/indoui'

const current = useBreakpoint(); // 'base' | 'sm' | 'md' | ...
const isDesktop = useBreakpointUp('lg'); // true if >= lg
const isMobile = useBreakpointDown('sm'); // true if <= sm`}
    >
      <VStack gap={2} align="start">
        <Text><Code>useBreakpoint()</Code> - Returns current breakpoint key</Text>
        <Text><Code>useBreakpointUp(bp)</Code> - True if at least the specified size</Text>
        <Text><Code>useBreakpointDown(bp)</Code> - True if at most the specified size</Text>
      </VStack>
    </ComponentCard>
  </div>
);

const UseThemeTokenDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>useThemeToken</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">Access theme tokens directly in your components. Get colors, sizes, spacing, and more.</Text>
    
    <ComponentCard
      title="Basic Usage"
      description="Access theme values programmatically"
      code={`import { useThemeToken } from '@indokudev/indoui'

function MyComponent() {
  const { 
    getColor, 
    getSize, 
    getSpacing, 
    getRadius, 
    getFontSize,
    getShadow 
  } = useThemeToken();
  
  const primaryColor = getColor('blue', 500);
  const mediumSize = getSize('md');
  
  return <div style={{ color: primaryColor }}>...</div>;
}`}
    >
      <Text>Access any theme token value for custom styling.</Text>
    </ComponentCard>
    
    <ComponentCard
      title="Available Methods"
      description="All methods from useThemeToken"
      code={`const {
  getColor,      // (scheme, shade) => rgb color
  resolveToken,  // (token) => resolved value
  getSize,       // (size) => size value
  getSpacing,    // (space) => spacing value
  getRadius,     // (radius) => border-radius
  getFontSize,   // (size) => font-size
  getShadow,     // (shadow) => box-shadow
  
  // Direct access to token objects
  colors,
  sizes,
  spacing,
  radii,
  fontSizes,
  shadows,
} = useThemeToken();`}
    >
      <Table variant="simple" size="sm">
        <Thead>
          <Tr><Th>Method</Th><Th>Example</Th><Th>Returns</Th></Tr>
        </Thead>
        <Tbody>
          <Tr><Td><Code>getColor</Code></Td><Td>getColor('red', 500)</Td><Td>'rgb(239 68 68)'</Td></Tr>
          <Tr><Td><Code>resolveToken</Code></Td><Td>resolveToken('blue.500')</Td><Td>'rgb(59 130 246)'</Td></Tr>
          <Tr><Td><Code>getSize</Code></Td><Td>getSize('md')</Td><Td>'1rem'</Td></Tr>
          <Tr><Td><Code>getSpacing</Code></Td><Td>getSpacing(4)</Td><Td>'1rem'</Td></Tr>
        </Tbody>
      </Table>
    </ComponentCard>
  </div>
);

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

const SplitterDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">Splitter</Heading>
    <Text className="text-muted-foreground mb-8">Resizable split pane component. Drag the divider to resize panels.</Text>
    
    <ComponentCard
      title="Horizontal Splitter"
      description="Drag the divider to resize left and right panels"
      code={`<Splitter h="200px" w="100%">
  <div className="p-4 bg-primary/10">Left Panel</div>
  <div className="p-4 bg-purple-500/10">Right Panel</div>
</Splitter>`}
    >
      <Splitter h="200px" w="100%" className="border border-border rounded-lg overflow-hidden">
        <div className="p-4 bg-primary/10 h-full">
          <Text fontWeight="semibold">Left Panel</Text>
          <Text size="sm" className="text-muted-foreground">Drag the divider to resize</Text>
        </div>
        <div className="p-4 bg-purple-500/10 h-full">
          <Text fontWeight="semibold">Right Panel</Text>
          <Text size="sm" className="text-muted-foreground">This panel resizes too</Text>
        </div>
      </Splitter>
    </ComponentCard>
    
    <ComponentCard
      title="Vertical Splitter"
      description="Top and bottom panels"
      code={`<Splitter orientation="vertical" h="300px">
  <div className="p-4">Top Panel</div>
  <div className="p-4">Bottom Panel</div>
</Splitter>`}
    >
      <Splitter orientation="vertical" h="300px" w="100%" className="border border-border rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-500/10 w-full">
          <Text fontWeight="semibold">Top Panel</Text>
          <Text size="sm" className="text-muted-foreground">Drag vertically to resize</Text>
        </div>
        <div className="p-4 bg-green-500/10 w-full">
          <Text fontWeight="semibold">Bottom Panel</Text>
          <Text size="sm" className="text-muted-foreground">Adjusts with top panel</Text>
        </div>
      </Splitter>
    </ComponentCard>
    
    <ComponentCard
      title="Custom Default Sizes"
      description="Set initial panel sizes"
      code={`<Splitter defaultSizes={[30, 70]} minSize={20}>
  <div>30% Panel</div>
  <div>70% Panel</div>
</Splitter>`}
    >
      <Splitter defaultSizes={[30, 70]} minSize={15} h="150px" w="100%" className="border border-border rounded-lg overflow-hidden">
        <div className="p-4 bg-orange-500/10 h-full">
          <Text size="sm">30% default</Text>
        </div>
        <div className="p-4 bg-teal-500/10 h-full">
          <Text size="sm">70% default</Text>
        </div>
      </Splitter>
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

const SegmentedControlDocs = () => {
  const [view, setView] = useState('list');
  const [size, setSize] = useState('md');
  
  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">Segmented Control</Heading>
      <Text className="text-muted-foreground mb-8">Button group for switching between options. Great for view toggles.</Text>
      
      <ComponentCard
        title="Interactive Segmented Control"
        description="Click to toggle between options"
        code={`const [view, setView] = useState('list');

<SegmentedControl
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'table', label: 'Table' },
  ]}
  value={view}
  onChange={setView}
/>`}
      >
        <VStack gap={4} align="start">
          <SegmentedControl
            options={[
              { value: 'list', label: 'List' },
              { value: 'grid', label: 'Grid' },
              { value: 'table', label: 'Table' },
            ]}
            value={view}
            onChange={setView}
          />
          <Text size="sm" className="text-muted-foreground">Selected: <Code>{view}</Code></Text>
        </VStack>
      </ComponentCard>
      
      <ComponentCard
        title="Sizes"
        description="Small, medium, and large sizes"
        code={`<SegmentedControl size="sm" ... />
<SegmentedControl size="md" ... />
<SegmentedControl size="lg" ... />`}
      >
        <VStack gap={4} align="start">
          <SegmentedControl
            size="sm"
            options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]}
            defaultValue="a"
          />
          <SegmentedControl
            size="md"
            options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]}
            defaultValue="a"
          />
          <SegmentedControl
            size="lg"
            options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]}
            defaultValue="a"
          />
        </VStack>
      </ComponentCard>
      
      <ComponentCard
        title="Full Width"
        description="Expand to fill container"
        code={`<SegmentedControl fullWidth ... />`}
      >
        <div className="w-full max-w-md">
          <SegmentedControl
            fullWidth
            options={[
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ]}
            defaultValue="week"
          />
        </div>
      </ComponentCard>
    </div>
  );
};

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

const QRCodeDocs = () => {
  const [qrValue, setQrValue] = useState('https://indoui.dev');
  
  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">QR Code</Heading>
      <Text className="text-muted-foreground mb-8">Generate QR codes for URLs, text, or any data. Supports different sizes and error correction levels.</Text>
      
      <ComponentCard
        title="Interactive QR Code Generator"
        description="Enter any text or URL to generate a QR code"
        code={`const [qrValue, setQrValue] = useState('https://indoui.dev');

<Input 
  value={qrValue} 
  onChange={(e) => setQrValue(e.target.value)}
  placeholder="Enter URL or text"
/>
<QRCode value={qrValue} />`}
      >
        <VStack gap={4} align="start" className="w-full">
          <Input 
            value={qrValue} 
            onChange={(e) => setQrValue(e.target.value)}
            placeholder="Enter URL or text to generate QR"
            className="max-w-md"
          />
          <HStack gap={6} align="end">
            <VStack gap={2}>
              <Text size="sm" className="text-muted-foreground">Generated QR:</Text>
              <QRCode value={qrValue || 'https://indoui.dev'} size="lg" />
            </VStack>
          </HStack>
        </VStack>
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
};

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

const PaginationDocs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">Pagination</Heading>
      <Text className="text-muted-foreground mb-8">Navigate through pages of content.</Text>
      
      <ComponentCard
        title="Interactive Pagination"
        description="Click to navigate between pages"
        code={`const [currentPage, setCurrentPage] = useState(1);

<Pagination
  totalPages={10}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
/>`}
      >
        <VStack gap={4} align="start">
          <Text size="sm" className="text-muted-foreground">Current Page: <strong className="text-foreground">{currentPage}</strong></Text>
          <Pagination
            totalPages={10}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </VStack>
      </ComponentCard>
      
      <ComponentCard
        title="Sizes & Variants"
        description="Different pagination styles"
        code={`<Pagination size="sm" variant="ghost" />
<Pagination size="md" variant="outline" />
<Pagination size="lg" variant="solid" />`}
      >
        <VStack gap={4} align="start">
          <HStack gap={2}>
            <Text size="sm" className="w-16">Small:</Text>
            <Pagination totalPages={5} currentPage={1} onPageChange={() => {}} size="sm" />
          </HStack>
          <HStack gap={2}>
            <Text size="sm" className="w-16">Medium:</Text>
            <Pagination totalPages={5} currentPage={2} onPageChange={() => {}} size="md" />
          </HStack>
        </VStack>
      </ComponentCard>
    </div>
  );
};

const TextEditorDocs = () => {
  const [editorContent, setEditorContent] = useState('');
  
  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">Text Editor</Heading>
      <Text className="text-muted-foreground mb-8">Rich text editor with formatting toolbar. Supports Markdown syntax.</Text>
      
      <ComponentCard
        title="Interactive Text Editor"
        description="Try the formatting toolbar - select text and click buttons, or use keyboard shortcuts (Ctrl+B, Ctrl+I)"
        code={`const [content, setContent] = useState('');

<TextEditor
  value={content}
  onChange={setContent}
  placeholder="Start typing..."
  minHeight="200px"
/>`}
      >
        <VStack gap={4} className="w-full" align="start">
          <div className="w-full">
            <TextEditor 
              value={editorContent}
              onChange={setEditorContent}
              placeholder="Try typing here... Select text and use the toolbar to format. Supports **bold**, _italic_, `code`, and more!"
              minHeight="180px"
            />
          </div>
          {editorContent && (
            <VStack gap={2} align="start" className="w-full">
              <Text size="sm" fontWeight="medium" className="text-muted-foreground">Raw Output:</Text>
              <pre className="bg-muted p-3 rounded-lg text-xs w-full overflow-x-auto border border-border">
                {editorContent}
              </pre>
            </VStack>
          )}
        </VStack>
      </ComponentCard>
    </div>
  );
};

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

// ============= MENU =============

const MenuDocs = () => {
  const [toastVisible, setToastVisible] = useState(false);
  
  const menuItems = [
    { label: 'New File', shortcut: 'Ctrl+N', onClick: () => toast.success('New file created!') },
    { label: 'Open File', shortcut: 'Ctrl+O', onClick: () => toast.success('Opening file...') },
    { label: 'Save', shortcut: 'Ctrl+S', onClick: () => toast.success('File saved!') },
    { 
      label: 'Export', 
      children: [
        { label: 'Export as PDF', onClick: () => toast.success('Exporting as PDF...') },
        { label: 'Export as PNG', onClick: () => toast.success('Exporting as PNG...') },
        { label: 'Export as SVG', onClick: () => toast.success('Exporting as SVG...') },
      ]
    },
    { label: 'Delete', danger: true, onClick: () => toast.error('File deleted!') },
  ];

  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">
        <GradientText>Menu</GradientText>
      </Heading>
      <Text className="text-muted-foreground mb-8">Dropdown menu and context menu components for actions.</Text>
      
      <ComponentCard
        title="Basic Menu"
        description="Dropdown menu with trigger button"
        code={`import { Menu } from '@indokudev/indoui'

const items = [
  { label: 'New File', shortcut: 'Ctrl+N', onClick: () => {} },
  { label: 'Open File', shortcut: 'Ctrl+O', onClick: () => {} },
  { label: 'Save', shortcut: 'Ctrl+S', onClick: () => {} },
  { label: 'Delete', danger: true, onClick: () => {} },
];

<Menu 
  trigger={<Button>Open Menu</Button>}
  items={items}
/>`}
      >
        <MenuComponent
          trigger={<Button>Open Menu</Button>}
          items={menuItems}
        />
      </ComponentCard>
      
      <ComponentCard
        title="Menu with Submenus"
        description="Nested menu items"
        code={`const items = [
  { label: 'File' },
  { 
    label: 'Export', 
    children: [
      { label: 'Export as PDF' },
      { label: 'Export as PNG' },
    ]
  },
];

<Menu trigger={<Button>Actions</Button>} items={items} />`}
      >
        <MenuComponent
          trigger={<Button variant="outline">Actions</Button>}
          items={[
            { label: 'Edit', onClick: () => toast.success('Editing...') },
            { label: 'Duplicate', onClick: () => toast.success('Duplicated!') },
            { 
              label: 'Move to', 
              children: [
                { label: 'Folder 1', onClick: () => toast.success('Moved to Folder 1') },
                { label: 'Folder 2', onClick: () => toast.success('Moved to Folder 2') },
                { label: 'Archive', onClick: () => toast.success('Archived!') },
              ]
            },
            { label: 'Delete', danger: true, onClick: () => toast.error('Deleted!') },
          ]}
        />
      </ComponentCard>
      
      <ComponentCard
        title="Menu Alignment"
        description="Align menu to start, center, or end"
        code={`<Menu trigger={...} items={...} align="start" />
<Menu trigger={...} items={...} align="center" />
<Menu trigger={...} items={...} align="end" />`}
      >
        <HStack gap={4}>
          <MenuComponent
            trigger={<Button size="sm">Left</Button>}
            items={[{ label: 'Item 1' }, { label: 'Item 2' }]}
            align="start"
          />
          <MenuComponent
            trigger={<Button size="sm">Center</Button>}
            items={[{ label: 'Item 1' }, { label: 'Item 2' }]}
            align="center"
          />
          <MenuComponent
            trigger={<Button size="sm">Right</Button>}
            items={[{ label: 'Item 1' }, { label: 'Item 2' }]}
            align="end"
          />
        </HStack>
      </ComponentCard>
      
      <ComponentCard
        title="Context Menu"
        description="Right-click to open context menu"
        code={`<ContextMenu
  items={[
    { label: 'Copy', shortcut: 'Ctrl+C' },
    { label: 'Paste', shortcut: 'Ctrl+V' },
    { label: 'Delete', danger: true },
  ]}
>
  <div>Right-click me!</div>
</ContextMenu>`}
      >
        <ContextMenu
          items={[
            { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => toast.success('Copied!') },
            { label: 'Cut', shortcut: 'Ctrl+X', onClick: () => toast.success('Cut!') },
            { label: 'Paste', shortcut: 'Ctrl+V', onClick: () => toast.success('Pasted!') },
            { label: 'Delete', danger: true, onClick: () => toast.error('Deleted!') },
          ]}
        >
          <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-muted/30 cursor-context-menu">
            <Text className="text-muted-foreground">Right-click here to open context menu</Text>
          </div>
        </ContextMenu>
      </ComponentCard>
    </div>
  );
};

// ============= TOAST =============

const ToastDocs = () => {
  const [showToast, setShowToast] = useState<string | null>(null);

  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">
        <GradientText>Toast</GradientText>
      </Heading>
      <Text className="text-muted-foreground mb-8">Toast notifications for feedback messages.</Text>
      
      <ComponentCard
        title="Toast Statuses"
        description="Different status styles for toasts"
        code={`import { Toast, ToastContainer } from '@indokudev/indoui'

// Info toast
<Toast status="info" title="Info" description="This is info" />

// Success toast
<Toast status="success" title="Success" description="Done!" />

// Warning toast
<Toast status="warning" title="Warning" description="Careful!" />

// Error toast
<Toast status="error" title="Error" description="Error!" />`}
      >
        <VStack gap={3} align="stretch" className="w-full max-w-md">
          <Toast status="info" title="Info" description="This is an informational message" />
          <Toast status="success" title="Success" description="Operation completed successfully!" />
          <Toast status="warning" title="Warning" description="Please be careful with this action" />
          <Toast status="error" title="Error" description="Something went wrong. Please try again." />
        </VStack>
      </ComponentCard>
      
      <ComponentCard
        title="Toast Sizes"
        description="Different toast sizes"
        code={`<Toast size="sm" title="Small" description="Small toast" />
<Toast size="md" title="Medium" description="Medium toast" />
<Toast size="lg" title="Large" description="Large toast" />`}
      >
        <VStack gap={3} align="stretch">
          <Toast size="sm" status="info" title="Small Toast" description="A compact notification" />
          <Toast size="md" status="success" title="Medium Toast" description="Standard size notification" />
          <Toast size="lg" status="warning" title="Large Toast" description="A larger notification for more content" />
        </VStack>
      </ComponentCard>
      
      <ComponentCard
        title="Using with Sonner"
        description="We recommend using sonner for toast notifications"
        code={`import { toast } from 'sonner'

// Trigger toasts
toast.success('Successfully saved!')
toast.error('Failed to save')
toast.info('New update available')
toast.warning('Low storage space')

// Custom toast
toast('Custom message', {
  description: 'With description',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
})`}
      >
        <HStack gap={2} className="flex-wrap">
          <Button size="sm" colorScheme="blue" onClick={() => toast.info('Info toast!')}>Info</Button>
          <Button size="sm" colorScheme="green" onClick={() => toast.success('Success toast!')}>Success</Button>
          <Button size="sm" colorScheme="yellow" onClick={() => toast.warning('Warning toast!')}>Warning</Button>
          <Button size="sm" colorScheme="red" onClick={() => toast.error('Error toast!')}>Error</Button>
        </HStack>
      </ComponentCard>
    </div>
  );
};

// ============= CODE EDITOR =============

const CodeEditorDocs = () => {
  const [code, setCode] = useState(`function greet(name: string) {
  console.log(\`Hello, \${name}!\`);
}

greet('IndoUI');`);

  return (
    <div>
      <Heading as="h1" size="3xl" className="mb-4">
        <GradientText>Code Editor</GradientText>
      </Heading>
      <Text className="text-muted-foreground mb-8">Monaco-like code editor with syntax highlighting, auto-indent, and multi-file support.</Text>
      
      <ComponentCard
        title="Basic Code Editor"
        description="Editable code with syntax highlighting"
        code={`import { CodeEditor } from '@indokudev/indoui'

const [code, setCode] = useState('console.log("Hello!")');

<CodeEditor
  value={code}
  onChange={setCode}
  language="typescript"
  filename="example.ts"
/>`}
      >
        <Box w="full">
          <CodeEditor
            value={code}
            onChange={setCode}
            language="typescript"
            filename="example.ts"
            h="200px"
          />
        </Box>
      </ComponentCard>
      
      <ComponentCard
        title="Read-only Mode"
        description="Display code without editing"
        code={`<CodeEditor
  value={code}
  readOnly
  language="javascript"
/>`}
      >
        <Box w="full">
          <CodeEditor
            value={`const app = express();
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(3000);`}
            readOnly
            language="javascript"
            filename="server.js"
            h="180px"
          />
        </Box>
      </ComponentCard>
      
      <ComponentCard
        title="Multi-file Editor"
        description="Editor with multiple file tabs"
        code={`<CodeEditor
  files={[
    { name: 'App.tsx', language: 'tsx', content: '...' },
    { name: 'styles.css', language: 'css', content: '...' },
  ]}
  activeFile="App.tsx"
  onFileChange={(file) => console.log(file)}
/>`}
      >
        <Box w="full">
          <CodeEditor
            files={[
              { name: 'App.tsx', language: 'tsx', content: `import React from 'react';\n\nexport const App = () => {\n  return <div>Hello!</div>;\n};` },
              { name: 'styles.css', language: 'css', content: `.container {\n  padding: 20px;\n  background: #f0f0f0;\n}` },
              { name: 'config.json', language: 'json', content: `{\n  "name": "my-app",\n  "version": "1.0.0"\n}` },
            ]}
            activeFile="App.tsx"
            h="220px"
          />
        </Box>
      </ComponentCard>
      
      <ComponentCard
        title="Light Theme with Minimap"
        description="Light theme variant with code minimap"
        code={`<CodeEditor
  value={code}
  theme="light"
  showMinimap
/>`}
      >
        <Box w="full">
          <CodeEditor
            value={`// React component example
import React, { useState } from 'react';

interface Props {
  title: string;
  count?: number;
}

export const Counter: React.FC<Props> = ({ title, count = 0 }) => {
  const [value, setValue] = useState(count);
  
  return (
    <div className="counter">
      <h2>{title}</h2>
      <p>Count: {value}</p>
      <button onClick={() => setValue(v => v + 1)}>
        Increment
      </button>
    </div>
  );
};`}
            theme="light"
            showMinimap
            language="tsx"
            filename="Counter.tsx"
            h="300px"
          />
        </Box>
      </ComponentCard>
    </div>
  );
};

// ============= WEB PLAYER =============

const WebPlayerDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>Web Player</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">Sandbox component for rendering HTML/CSS/JS with console output.</Text>
    
    <ComponentCard
      title="Basic Web Player"
      description="Render HTML, CSS, and JavaScript"
      code={`import { WebPlayer } from '@indokudev/indoui'

<WebPlayer
  html="<h1>Hello World</h1><p>Welcome!</p>"
  css="h1 { color: blue; } p { color: gray; }"
  js="console.log('Page loaded!');"
/>`}
    >
      <Box w="full">
        <WebPlayer
          html={`<div class="container">
  <h1>Hello World!</h1>
  <p>This is a live preview.</p>
  <button onclick="handleClick()">Click me</button>
</div>`}
          css={`
.container { padding: 20px; font-family: system-ui; }
h1 { color: #3b82f6; margin-bottom: 10px; }
p { color: #6b7280; margin-bottom: 15px; }
button { 
  background: #3b82f6; 
  color: white; 
  border: none; 
  padding: 8px 16px; 
  border-radius: 6px; 
  cursor: pointer;
}
button:hover { background: #2563eb; }`}
          js={`function handleClick() {
  console.log('Button clicked!');
  alert('Hello from WebPlayer!');
}`}
          showConsole
          h="350px"
        />
      </Box>
    </ComponentCard>
    
    <ComponentCard
      title="With Console"
      description="View console output from the sandbox"
      code={`<WebPlayer
  html="<button onclick='test()'>Log</button>"
  js="function test() { console.log('Clicked!'); }"
  showConsole
  consoleHeight={120}
/>`}
    >
      <Box w="full">
        <WebPlayer
          html={`<div style="padding: 20px; font-family: system-ui;">
  <h2>Console Demo</h2>
  <button onclick="logInfo()">Log Info</button>
  <button onclick="logWarn()">Log Warning</button>
  <button onclick="logError()">Log Error</button>
</div>`}
          css={`button { margin: 5px; padding: 8px 12px; border-radius: 4px; border: none; cursor: pointer; }
button:nth-child(2) { background: #3b82f6; color: white; }
button:nth-child(3) { background: #f59e0b; color: white; }
button:nth-child(4) { background: #ef4444; color: white; }`}
          js={`function logInfo() { console.log('This is an info message'); }
function logWarn() { console.warn('This is a warning'); }
function logError() { console.error('This is an error'); }
console.log('WebPlayer loaded!');`}
          showConsole
          consoleHeight={100}
          h="320px"
        />
      </Box>
    </ComponentCard>
    
    <ComponentCard
      title="Using srcDoc"
      description="Pass complete HTML document"
      code={`<WebPlayer
  srcDoc={\`<!DOCTYPE html>
<html>
  <head>
    <style>body { background: #f0f0f0; }</style>
  </head>
  <body>
    <h1>Complete Document</h1>
  </body>
</html>\`}
/>`}
    >
      <Box w="full">
        <WebPlayer
          srcDoc={`<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      margin: 0; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      min-height: 150px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: system-ui;
    }
    .card {
      background: white;
      padding: 20px 40px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      text-align: center;
    }
    h1 { margin: 0; color: #1a1a2e; }
    p { margin: 8px 0 0; color: #666; }
  </style>
</head>
<body>
  <div class="card">
    <h1>✨ Beautiful Card</h1>
    <p>Built with WebPlayer</p>
  </div>
</body>
</html>`}
          h="250px"
        />
      </Box>
    </ComponentCard>
  </div>
);

// ============= DOWNLOAD TRIGGER =============

const DownloadTriggerDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>Download Trigger</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">A component that triggers file downloads from URLs with customizable UI.</Text>
    
    <ComponentCard
      title="Basic Download"
      description="Simple download button"
      code={`import { DownloadTrigger } from '@indokudev/indoui'

<DownloadTrigger 
  url="/files/document.pdf" 
  filename="document.pdf" 
/>`}
    >
      <DownloadTrigger url="https://example.com/file.txt" filename="example.txt" />
    </ComponentCard>
    
    <ComponentCard
      title="Custom Trigger"
      description="Use any element as download trigger"
      code={`<DownloadTrigger url="/file.pdf" filename="download.pdf">
  <Button variant="outline" leftIcon={<Download />}>
    Download PDF
  </Button>
</DownloadTrigger>`}
    >
      <DownloadTrigger url="https://example.com/file.txt" filename="example.txt">
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
          Custom Download Button
        </Button>
      </DownloadTrigger>
    </ComponentCard>
    
    <ComponentCard
      title="Disabled State"
      description="Prevent downloads with disabled prop"
      code={`<DownloadTrigger 
  url="/file.pdf" 
  disabled 
/>`}
    >
      <DownloadTrigger url="https://example.com/file.txt" disabled />
    </ComponentCard>
  </div>
);

// ============= ASPECT RATIO =============

const AspectRatioDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>Aspect Ratio</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">Components for displaying images, videos, and iframes with consistent aspect ratios.</Text>
    
    <ComponentCard
      title="Aspect Image"
      description="Image with aspect ratio control"
      code={`import { AspectImage } from '@indokudev/indoui'

<AspectImage 
  src="/image.jpg" 
  alt="Description" 
  ratio="16:9" 
  w="300px"
/>`}
    >
      <AspectImage 
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" 
        alt="Mountain landscape" 
        ratio={16/9}
        w="300px"
        objectFit="cover"
        rounded="lg"
      />
    </ComponentCard>
    
    <ComponentCard
      title="Aspect Video"
      description="Embedded video with aspect ratio"
      code={`<AspectVideo 
  src="https://example.com/video.mp4" 
  ratio="16:9"
  controls
/>`}
    >
      <AspectVideo 
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        ratio={16/9}
        controls
        w="300px"
        rounded="lg"
      />
    </ComponentCard>
    
    <ComponentCard
      title="Aspect Iframe"
      description="Embedded iframe with aspect ratio"
      code={`<AspectIframe 
  src="https://example.com" 
  ratio="4:3"
  title="Embedded content"
/>`}
    >
      <AspectIframe 
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        ratio={16/9}
        title="YouTube Video"
        w="300px"
        rounded="lg"
      />
    </ComponentCard>
    
    <ComponentCard
      title="Different Ratios"
      description="Use any numeric ratio (width/height)"
      code={`<AspectImage ratio={1} />     // Square (1:1)
<AspectImage ratio={4/3} />   // Standard
<AspectImage ratio={16/9} />  // Widescreen
<AspectImage ratio={9/16} />  // Portrait`}
    >
      <HStack gap={4} className="flex-wrap">
        <VStack gap={1}>
          <AspectImage 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100" 
            alt="1:1" 
            ratio={1}
            w="80px"
            rounded="md"
          />
          <Text size="xs">1:1</Text>
        </VStack>
        <VStack gap={1}>
          <AspectImage 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100" 
            alt="4:3" 
            ratio={4/3}
            w="100px"
            rounded="md"
          />
          <Text size="xs">4:3</Text>
        </VStack>
        <VStack gap={1}>
          <AspectImage 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100" 
            alt="16:9" 
            ratio={16/9}
            w="120px"
            rounded="md"
          />
          <Text size="xs">16:9</Text>
        </VStack>
      </HStack>
    </ComponentCard>
  </div>
);

// ============= VIDEO CALL =============

const VideoCallDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>Video Call</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">Components for simple video calling with room codes in XXX-XXX-XXX format.</Text>
    
    <ComponentCard
      title="Simple Video Call"
      description="Live video call with your camera - test code: TEST-123-DEMO"
      code={`import { SimpleVideoCall, useLocalMedia } from '@indokudev/indoui'

const { localStream, startMedia, toggleVideo, toggleMic } = useLocalMedia();

<SimpleVideoCall 
  localStream={localStream}
  onToggleVideo={toggleVideo}
  onToggleMic={toggleMic}
/>`}
    >
      <LiveVideoDemo />
    </ComponentCard>
    
    <ComponentCard
      title="Room Code Display"
      description="Display shareable room code"
      code={`import { RoomCodeDisplay } from '@indokudev/indoui'

<RoomCodeDisplay 
  code="ABC-123-XYZ" 
  onCopy={() => toast.success('Copied!')}
/>`}
    >
      <RoomCodeDisplay code="ABC-123-XYZ" />
    </ComponentCard>
    
    <ComponentCard
      title="Join Room Form"
      description="Input for joining a room by code"
      code={`import { JoinRoomForm } from '@indokudev/indoui'

<JoinRoomForm 
  onJoin={(code) => console.log('Joining:', code)}
/>`}
    >
      <JoinRoomForm onJoin={(code) => alert(`Joining room: ${code}`)} />
    </ComponentCard>
  </div>
);

// ============= CHAT ROOM =============

const ChatRoomDocs = () => (
  <div>
    <Heading as="h1" size="3xl" className="mb-4">
      <GradientText>Chat Room</GradientText>
    </Heading>
    <Text className="text-muted-foreground mb-8">Simple chat component for real-time messaging with replies.</Text>
    
    <ComponentCard
      title="Basic Chat Room"
      description="Complete chat interface"
      code={`import { ChatRoom } from '@indokudev/indoui'

<ChatRoom 
  roomCode="ABC-123-XYZ"
  username="User"
  h="400px"
/>`}
    >
      <Box w="full">
        <ChatRoom 
          roomCode="demo-room"
          username="Demo User"
          h="300px"
        />
      </Box>
    </ComponentCard>
    
    <ComponentCard
      title="With Custom Size"
      description="Adjust chat dimensions"
      code={`<ChatRoom 
  roomCode="my-room"
  username="John"
  h="500px"
  w="full"
/>`}
    >
      <Text className="text-muted-foreground text-sm">
        ChatRoom supports layout props like w, h, minH, maxH for sizing.
      </Text>
    </ComponentCard>
  </div>
);

// ============= COMPONENT MAPPING =============

const componentDocs: Record<string, React.FC> = {
  installation: InstallationDocs,
  theming: ThemingDocs,
  colorscheme: ColorSchemeDocs,
  usecolormode: UseColorModeDocs,
  usecolormodevalue: UseColorModeValueDocs,
  usebreakpointvalue: UseBreakpointValueDocs,
  usethemetoken: UseThemeTokenDocs,
  box: BoxDocs,
  flex: FlexDocs,
  stack: StackDocs,
  grid: GridDocs,
  container: ContainerDocs,
  divider: DividerDocs,
  center: CenterDocs,
  splitter: SplitterDocs,
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
  menu: MenuDocs,
  toast: ToastDocs,
  tabs: TabsDocs,
  accordion: AccordionDocs,
  breadcrumb: BreadcrumbDocs,
  steps: StepsDocs,
  codeeditor: CodeEditorDocs,
  webplayer: WebPlayerDocs,
  downloadtrigger: DownloadTriggerDocs,
  aspectratio: AspectRatioDocs,
  videocall: VideoCallDocs,
  chatroom: ChatRoomDocs,
};

// ============= MAIN DOCS PAGE =============

const Docs: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('installation');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
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

  // Keyboard shortcuts: "/" or Ctrl+F to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" key to open search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setSearchModalOpen(true);
        }
      }
      // Ctrl+F to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      {/* Search Modal */}
      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />

      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-xl z-[100]">
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
              <a 
                href="https://github.com/indokudev/indoui" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                GitHub
              </a>
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
