/* eslint-disable react/prop-types */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Icon,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  FileAddedIcon,
  GlobeIcon,
  LinkIcon,
  ListUnorderedIcon,
  PackageIcon,
  PlugIcon,
  PlusIcon,
  RedoIcon,
  RocketIcon,
  SignOutIcon,
} from "@primer/octicons-react";

import Logo from "../assets/images/logo-full.png";
import { useState } from "react";

// Accordion use for collapse options
/**
 * Application Management
 * - Deployed Applications
 * - Deploy New Application
 * Domain Management
 * - Configure Domain
 * - Configure New Domain
 * Ingress Management
 * - Configured Rules
 * - Add New Rule
 * - Redirect Rules
 * - Add Redirect Rule
 **/

const LinkItems = [
  {
    index: 0,
    name: "Application Management",
    icon: PackageIcon,
    items: [
      {
        index: 0,
        name: "Deployed Applications",
        icon: ListUnorderedIcon,
        items: [],
      },
      {
        index: 1,
        name: "Deploy New Application",
        icon: RocketIcon,
        items: [],
      },
    ],
  },
  {
    index: 1,
    name: "Domain Management",
    icon: LinkIcon,
    items: [
      {
        index: 2,
        name: "Configured Domains",
        icon: ListUnorderedIcon,
        items: [],
      },
      {
        index: 3,
        name: "Configure New Domain",
        icon: FileAddedIcon,
        items: [],
      },
    ],
  },
  {
    index: 2,
    name: "Ingress Management",
    icon: GlobeIcon,
    items: [
      {
        index: 4,
        name: "Configured Rules",
        icon: PlugIcon,
        items: [],
      },
      {
        index: 5,
        name: "Add New Rule",
        icon: PlusIcon,
        items: [],
      },
      {
        index: 6,
        name: "Redirect Rules",
        icon: RedoIcon,
        items: [],
      },
      {
        index: 7,
        name: "Add Redirect Rule",
        icon: PlusIcon,
        items: [],
      },
    ],
  },
  { 
    index: 3, 
    name: "Logout", 
    icon: SignOutIcon,
    items: [] 
    },
];

export default function SimpleSidebar() {
  const [activeIndex, setActiveIndex] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [activeSubIndex, setActiveSubIndex] = useState(0);

  return (
    <Box
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w="80"
      pos="fixed"
      h="full"
    >
      <Flex
        h="20"
        alignItems="center"
        justifyContent="space-between"
        px="10"
        py="16"
      >
        <Image src={Logo} alt="Logo" w="auto" h="auto" />
      </Flex>
      <Accordion allowToggle ps="4" index={activeIndex}>
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            index={link.index}
            title={link.name}
            icon={link.icon}
            items={link.items}
            activeIndex={activeIndex}
            activeSubIndex={activeSubIndex}
            setActiveIndex={setActiveIndex}
          ></NavItem>
        ))}
      </Accordion>
    </Box>
  );
}

const NavItem = ({
  index,
  title,
  icon,
  items,
  activeIndex,
  activeSubIndex,
  setActiveIndex,
}) => {
  if (items.length > 0) {
    return (
      <NavItemWithSubMenu
        index={index}
        title={title}
        icon={icon}
        items={items}
        activeIndex={activeIndex}
        activeSubIndex={activeSubIndex}
        setActiveIndex={setActiveIndex}
      />
    );
  }
  return (
    <NavItemSingle
      index={index}
      title={title}
      icon={icon}
      activeIndex={activeIndex}
    />
  );
};

const NavItemSingle = ({ index, title, icon, activeIndex }) => {
  return (
    <Box
      alignItems="flex-start"
      py="2"
      px="4"
      borderRadius="full"
      borderEndRadius="0"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "gray.100",
        color: "brand.800",
      }}
      bg={activeIndex === index ? "gray.100" : "white"}
      color={activeIndex === index ? "brand.800" : "black"}
      fontWeight={activeIndex === index ? "700" : "normal"}
    >
      <Text
        _groupHover={{
          color: "brand.800",
        }}
      >
        <Icon as={icon} mr="2" />
        {title}
      </Text>
    </Box>
  );
};

const NavItemWithSubMenu = ({
  index,
  title,
  icon,
  items,
  activeIndex,
  activeSubIndex,
  setActiveIndex,
}) => {
  return (
    <AccordionItem border="none">
      <AccordionButton
        as={Box}
        alignItems="flex-start"
        py="2"
        px="4"
        borderRadius="full"
        borderEndRadius="0"
        role="group"
        cursor="pointer"
        bg={activeIndex === index ? "gray.100" : "white"}
        color={activeIndex === index ? "brand.800" : "black"}
        fontWeight={activeIndex === index ? "700" : "normal"}
        _hover={{
          bg: "gray.100",
          color: "brand.800",
        }}
        onClick={() => setActiveIndex(index)}
      >
        <Flex w="full" justifyContent="space-between">
          <Text
            _groupHover={{
              color: "brand.800",
            }}
          >
            <Icon as={icon} mr="2" />
            {title}
          </Text>
          <AccordionIcon float="right" />
        </Flex>
      </AccordionButton>
      <AccordionPanel pb={4} ps={4} pe={0}>
        {items.map((item) => (
          <NavItem
            key={item.name}
            index={item.index}
            icon={item.icon}
            title={item.name}
            items={item.items}
            activeIndex={activeSubIndex}
            activeSubIndex={-1}
          />
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};
