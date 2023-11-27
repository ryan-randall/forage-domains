"use client";
import { Input } from "@chakra-ui/react";
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
} from "@chakra-ui/react";
import { Search2Icon, ExternalLinkIcon } from "@chakra-ui/icons";
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

const defaultResults = [
  {
    siteName: "DinoDate",
    tlds: [".io", ".net"],
    link: "https://www.namecheap.com/domains/registration/results/?domain=DinoDate",
  },
  {
    siteName: "JurassicMingle",
    tlds: [".com", ".io", ".net"],
    link: "https://www.namecheap.com/domains/registration/results/?domain=JurassicMingle",
  },
  {
    siteName: "LoveSaurus",
    tlds: [".com", ".io", "net"],
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

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [domains, setDomains] = useState<DomainTableItem[]>(defaultResults);
  const searchDomains = async () => {
    if (searchInput && searchInput.length >= 20 && searchInput.length <= 150) {
      setErrorText("");
      setIsLoadingDomains(true);
      await fetch("/api/domains", {
        method: "POST",
        body: JSON.stringify({
          prompt: searchInput,
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
    description:
      "Find the perfect domain name in seconds with the help of AI.",
    url: "https://www.forage.domains",
    robots: "all",
    image:
      "https://firebasestorage.googleapis.com/v0/b/forage-domains.appspot.com/o/forage-domains.png?alt=media&token=4c34b1f8-0e31-4907-959b-05688111a2a7",
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
                <InputLeftAddon
                  bg="gray.800"
                  color="white"
                  fontWeight="semibold"
                >
                  Domain names for:
                </InputLeftAddon>
                <Input
                  id="prompt"
                  name="prompt"
                  backgroundColor={"white"}
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
            {isLoadingDomains ? (
              <Spinner />
            ) : (
              <TableContainer
                backgroundColor={"white"}
                mt={4}
                style={{ borderRadius: "6px" }}
              >
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
            <Link href="https://www.kocobee.com/privacy" isExternal>Privacy</Link>
            <Link href="https://www.kocobee.com/terms" isExternal>Terms</Link>
          </HStack>
        </>
      </Section>
    </main>
  );
}
