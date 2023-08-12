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
  GlobeIcon,
  LinkIcon,
  ListUnorderedIcon,
  PackageIcon,
  RedoIcon,
  RocketIcon,
  SignOutIcon,
} from "@primer/octicons-react";

import Logo from "../assets/images/logo-full.png";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
        index: 1,
        name: "Deployed Applications",
        icon: ListUnorderedIcon,
        items: [],
        link: "/application/deploy/list",
      },
      {
        index: 2,
        name: "Deploy New Application",
        icon: RocketIcon,
        items: [],
        link: "/application/deploy/new",
      },
    ],
  },
  {
    index: 3,
    name: "Domain Management",
    icon: LinkIcon,
    link: '/domain',
    items: [
    ],
  },
  {
    index: 4,
    name: "Ingress Rules",
    icon: GlobeIcon,
    link: "/ingress",
    items: [],
  },
  {
    index: 5,
    name: "Redirect Rules",
    icon: RedoIcon,
    items: [],
    link: "/redirect",
  },
  {
    index: 6,
    name: "Logout",
    icon: SignOutIcon,
    items: [],
    link: "/logout",
  },
];

export default function SimpleSidebar() {
  const location = useLocation();

  const [activeIndex, setActiveIndex] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [activeSubIndex, setActiveSubIndex] = useState(0);

  useEffect(() => {
    // Auto-highlight the active link
    const path = location.pathname;
    let index = -1;
    let subIndex = -1;
    for (let i = 0; i < LinkItems.length; i++) {
      const link = LinkItems[i];
      if (link.items.length == 0) {
        if (link.link == path) {
          index = link.index;
        }
      } else {
        for (let j = 0; j < link.items.length; j++) {
          const subLink = link.items[j];
          if (subLink.link == path) {
            index = link.index;
            subIndex = subLink.index;
            break;
          }
        }
      }
      if (index != -1) {
        break;
      }
    }
    setActiveIndex(index);
    setActiveSubIndex(subIndex);
  }, [location]);

  return (
    <Box
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w="100%"
      h="100vh"
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
            link={link.link}
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
  link,
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
      link={link}
      activeIndex={activeIndex}
    />
  );
};

const NavItemSingle = ({ index, title, icon, link, activeIndex }) => {
  return (
    <Link to={link}>
      <Box
        alignItems="flex-start"
        py="2"
        px="4"
        mb="1"
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
        borderWidth={activeIndex === index ? "1.5px" : "0px"}
        borderColor="brand.400"
        borderRightWidth="0px"
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
    </Link>
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
            link={item.link}
            activeIndex={activeSubIndex}
            activeSubIndex={-1}
          />
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};
