"use client";
import { Input, TagRightIcon } from "@chakra-ui/react";
import {
  Heading,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
  IconButton,
  Spinner,
  Tag,
  Text,
  Link,
  Container,
  Box,
  Flex,
  ContainerProps,
  InputGroup,
  InputLeftAddon,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { Search2Icon, ExternalLinkIcon, AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import Head from "next/head";
type DomainResult = {
  domains: DomainTableItem[];
};

type DomainTableItem = {
  siteName: string;
  tlds: string[];
  link: string;
};

const MAX_TLDS = 2;

const TLDS = [".com", ".io", ".net", ".ai", ".co"];

const defaultResults = [
  {
    siteName: "DinoDate",
    tlds: [".io"],
    link: "https://www.namecheap.com/domains/registration/results/?domain=DinoDate",
  },
  {
    siteName: "JurassicMingle",
    tlds: [".com", ".io"],
    link: "https://www.namecheap.com/domains/registration/results/?domain=JurassicMingle",
  },
  {
    siteName: "LoveSaurus",
    tlds: [".com", ".io"],
    link: "https://www.namecheap.com/domains/registration/results/?domain=LoveSaurus",
  },
];

interface Props extends ContainerProps {
  children: React.ReactElement;
}

function Section(props: Props) {
  const { children, ...rest } = props;
  return (
    <Container maxW={"5xl"} {...rest}>
      <Flex
        minH={"100vh"}
        justifyContent="center"
        direction="column"
        align="center"
      >
        {children}
      </Flex>
    </Container>
  );
}

type TLD = {
  name: string;
  active: boolean;
};

const defaultTlds = TLDS.map((tld, index) => {
  if (index >= MAX_TLDS) {
    return {
      name: tld,
      active: false,
    };
  } else {
    return {
      name: tld,
      active: true,
    };
  }
});

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [tlds, setTLDs] = useState<TLD[]>(defaultTlds);
  const [domains, setDomains] = useState<DomainTableItem[]>(defaultResults);
  const searchDomains = async () => {
    const activeTlds = tlds.filter((tld) => tld.active).map(tld => tld.name);
    if (searchInput && searchInput.length >= 20 && searchInput.length <= 150) {
      setErrorText("");
      setIsLoadingDomains(true);
      await fetch("/api/domains", {
        method: "POST",
        body: JSON.stringify({
          prompt: searchInput,
          tlds: activeTlds,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((result) => result.json())
        .then((result: unknown) => {
          const resp: DomainResult = result as DomainResult;
          setIsLoadingDomains(false);
          setDomains(resp.domains);
        });
    } else {
      setErrorText("Search input must be between 20 and 150 characters");
    }
  };

  const metaData = {
    title: "Find your next domain name",
    description: "Find the perfect domain name in seconds with the help of AI.",
    url: "https://www.forage.domains",
    robots: "all",
    image:
      "https://firebasestorage.googleapis.com/v0/b/forage-domains.appspot.com/o/forage-domains.png?alt=media&token=4c34b1f8-0e31-4907-959b-05688111a2a7",
  };

  const handleTagRemove = (name: string) => {
    const newTlds = tlds.map((tld) => {
      if (tld.name === name) {
        return {
          name,
          active: false,
        };
      }
      return { ...tld };
    });
    setTLDs(newTlds);
  };

  const handleTagAdd = (name: string) => {
    const totalActive = tlds.filter((tld) => tld.active);
    const newTlds = tlds.map((tld) => {
      if (tld.name === name && totalActive.length < MAX_TLDS) {
        return {
          name,
          active: true,
        };
      }
      return { ...tld };
    });
    setTLDs(newTlds);
  };

  return (
    <main>
      <Section>
        <>
          <Head>
            <title>{metaData.title}</title>
            <meta name="description" content={metaData.description} />
            <link rel="canonical" href={metaData.url} />
            <meta name="robots" content={metaData.robots} />
            <meta property="og:title" content={metaData.title} />
            <meta property="og:description" content={metaData.description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={metaData.url} />
            <meta property="og:image" content={metaData.image} />
          </Head>
          <Heading as="h1" size="3xl" mb={4}>
            Find your next domain here
          </Heading>
          <Heading as="h2" size="lg" mb={4}>
            You describe the business. We&apos;ll find the domain names.
          </Heading>
          <Box w="100%">
            <HStack>
              <InputGroup size={{ md: "lg", sm: "sm" }} mt={4}>
                <Input
                  id="prompt"
                  name="prompt"
                  placeholder="A dating app exclusively for dinosaur lovers."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
                <IconButton
                  colorScheme="yellow"
                  aria-label="Search Domains"
                  icon={<Search2Icon />}
                  onClick={searchDomains}
                />{" "}
              </InputGroup>
            </HStack>
            {errorText && (
              <Text color="red.400" fontSize="sm">
                {errorText}
              </Text>
            )}
            <HStack spacing={4} mt={4}>
              <Text fontWeight={"semibold"}>{`TLDs (Max ${MAX_TLDS}):`}</Text>
              {tlds.map((tld) => (
                <Tag
                  size={"md"}
                  key={tld.name}
                  variant="subtle"
                  colorScheme={tld.active ? "cyan" : "gray"}
                >
                  <TagLabel>{tld.name}</TagLabel>
                  {tld.active ? (
                    <TagCloseButton onClick={() => handleTagRemove(tld.name)} />
                  ) : (
                    <TagRightIcon
                      boxSize="12px"
                      as={AddIcon}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleTagAdd(tld.name)}
                    />
                  )}
                </Tag>
              ))}
            </HStack>
            {isLoadingDomains ? (
              <Spinner />
            ) : (
              <TableContainer mt={4} style={{ borderRadius: "6px" }}>
                <Table variant="simple">
                  <TableCaption>Available Domains</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Domain</Th>
                      <Th>TLDs</Th>
                      <Th>Link</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {domains.map((domain) => (
                      <Tr key={domain.siteName}>
                        <Td>{domain.siteName}</Td>
                        <Td>
                          <HStack spacing={1}>
                            {domain.tlds.map((tld) => (
                              <Tag key={tld}>{tld}</Tag>
                            ))}
                          </HStack>
                        </Td>
                        <Td>
                          <Link
                            isExternal
                            href={`${domain.link}${domain.tlds[0]}`}
                          >
                            Buy now <ExternalLinkIcon mx="4px" />
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Box>
          <HStack mt={8}>
            <Link href="https://www.kocobee.com/privacy" isExternal>
              Privacy
            </Link>
            <Link href="https://www.kocobee.com/terms" isExternal>
              Terms
            </Link>
          </HStack>
        </>
      </Section>
    </main>
  );
}
