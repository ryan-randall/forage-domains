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
  Text,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { useState } from "react";
import { getAvailableDomains } from "./api";

type DomainResult = {
  siteName: string;
  link: string;
};

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const [domains, setDomains] = useState<Array<DomainResult>>([]);
  const searchDomains = async () => {
    setIsLoadingDomains(true);
    const results = await getAvailableDomains(searchInput);
    setIsLoadingDomains(false);
    setDomains(results);
  };
  return (
    <main>
      <Heading as="h1" size="3xl">
        Find your next domain here
      </Heading>
      <Heading as="h2" size="md">
        You describe the business. We&apos;ll find the domain names.
      </Heading>
      <HStack>
        <Text style={{ whiteSpace: 'nowrap'}} fontWeight='bold'>Domain names for:</Text>
        <Input placeholder="A dating app exclusively for dinosaur lovers." />
        <IconButton
          colorScheme="blue"
          aria-label="Search Domains"
          onClick={searchDomains}
          icon={<Search2Icon />}
        />
      </HStack>
      {isLoadingDomains ? (
        <Spinner />
      ) : (
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Available Domains</TableCaption>
            <Thead>
              <Tr>
                <Th>Domain</Th>
                <Th>Link</Th>
              </Tr>
            </Thead>
            <Tbody>
              {domains.map((domain) => (
                <Tr key={domain.siteName}>
                  <Td>{domain.siteName}</Td>
                  <Td>{domain.link}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </main>
  );
}
