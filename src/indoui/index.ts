// ============================================================
// @indoui/react - A Chakra UI-like component library
// ============================================================

// Theme & Tokens
export * from './theme/tokens';
export * from './theme/variants';

// Providers
export { IndoUIProvider } from './providers/IndoUIProvider';

// Hooks
export { useColorMode } from './hooks/useColorMode';
export { useColorModeValue, useColorModeValueRaw } from './hooks/useColorModeValue';
export { useThemeToken } from './hooks/useThemeToken';
export { useBreakpointValue, useBreakpoint, useBreakpointUp, useBreakpointDown } from './hooks/useBreakpointValue';

// Utils
export { resolveColor, resolveColorWithTheme, getColorValue, getColorHSL } from './utils/resolveColor';

// Primitives
export { Box } from './components/primitives/Box';
export { Flex, HStack, VStack } from './components/primitives/Flex';
export { Stack } from './components/primitives/Stack';
export { Grid, GridItem } from './components/primitives/Grid';
export { Container } from './components/primitives/Container';
export { Divider, Spacer } from './components/primitives/Divider';
export { ScrollArea, Float, Center, Bleed, Wrap } from './components/primitives/Layout';
export { Splitter } from './components/primitives/Splitter';

// Typography
export { Heading } from './components/typography/Heading';
export { Text } from './components/typography/Text';
export { Link } from './components/typography/Link';
export { Mark, Highlight, Blockquote, Prose, Em } from './components/typography/Prose';

// Forms
export { Button } from './components/forms/Button';
export { Input } from './components/forms/Input';
export { Textarea } from './components/forms/Textarea';
export { Select } from './components/forms/Select';
export { Checkbox } from './components/forms/Checkbox';
export { Radio, RadioGroup } from './components/forms/Radio';
export { Switch } from './components/forms/Switch';
export { Slider, RangeSlider } from './components/forms/Slider';
export { PinInput } from './components/forms/PinInput';
export { NumberInput } from './components/forms/NumberInput';
export { FileUpload } from './components/forms/FileUpload';
export { ColorPicker } from './components/forms/ColorPicker';
export { DatePicker } from './components/forms/DatePicker';
export { PasswordInput } from './components/forms/PasswordInput';
export { SegmentedControl } from './components/forms/SegmentedControl';
export { IconButton } from './components/forms/IconButton';
export { DownloadTrigger } from './components/forms/DownloadTrigger';

// Feedback
export { Alert } from './components/feedback/Alert';
export { Badge } from './components/feedback/Badge';
export { Progress } from './components/feedback/Progress';
export { Skeleton, SkeletonText, SkeletonCircle } from './components/feedback/Skeleton';
export { Tooltip } from './components/feedback/Tooltip';
export { Toast, ToastContainer } from './components/feedback/Toast';
export { Spinner } from './components/feedback/Spinner';
export { EmptyState } from './components/feedback/EmptyState';

// Data Display
export { Avatar, AvatarGroup } from './components/data-display/Avatar';
export { Tag, TagLabel, TagCloseButton } from './components/data-display/Tag';
export { Code, Kbd } from './components/data-display/Code';
export { Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup } from './components/data-display/Stat';
export { Table, TableContainer, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption } from './components/data-display/Table';
export { TextEditor } from './components/data-display/TextEditor';
export { Clipboard, ClipboardButton } from './components/data-display/Clipboard';
export { Timeline } from './components/data-display/Timeline';
export { Pagination } from './components/data-display/Pagination';
export { FileTree } from './components/data-display/FileTree';
export type { FileNode } from './components/data-display/FileTree';
export { Carousel } from './components/data-display/Carousel';
export { Image } from './components/data-display/Image';
export { List, ListItem } from './components/data-display/List';
export { QRCode } from './components/data-display/QRCode';
export { SyntaxHighlighter, CodeBlock } from './components/data-display/SyntaxHighlighter';
export type { Language } from './components/data-display/SyntaxHighlighter';

// Overlay
export { Modal, ModalHeader, ModalBody, ModalFooter } from './components/overlay/Modal';
export { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from './components/overlay/Drawer';
export { Menu, ContextMenu, MenuDivider } from './components/overlay/Menu';

// Navigation
export { Tabs, TabList, Tab, TabPanels, TabPanel } from './components/navigation/Tabs';
export { Accordion, AccordionItem, AccordionButton, AccordionPanel } from './components/navigation/Accordion';
export { Steps } from './components/navigation/Steps';
export { Breadcrumb } from './components/navigation/Breadcrumb';

// Utilities
export { ColorModeSwitch } from './components/ColorModeSwitch';
export { ColorModeButton, LightMode, DarkMode } from './components/ColorMode';
