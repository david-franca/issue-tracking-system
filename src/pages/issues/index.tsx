import { SearchIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
  Button,
  Text,
  Input,
  Select,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { NextPage } from "next";
import { ChangeEventHandler, useMemo } from "react";
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import useAxios from "../../hooks/useAxios";
import { DefaultColumnFilter } from "./components/DefaultColumnFilter";

interface IssuesResponse {
  issues: IssuesType[];
}

interface IssuesType {
  id: number;
  issue: string;
  version: string;
  autor: string;
  description: string;
  priority: string;
  createdAt: string;
  status: string;
}

function fuzzyTextFilterFn(rows: any[], id: any, filterValue: any) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: any) => !val;

const Issues: NextPage = () => {
  const { response } = useAxios<IssuesResponse>({
    method: "get",
    url: "issues",
  });
  const columns = useMemo<Column[]>(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Problema", accessor: "issue" },
      { Header: "Versão", accessor: "version" },
      { Header: "Autor do Registro ", accessor: "autor" },
      { Header: "Descrição", accessor: "description" },
      { Header: "Prioridade", accessor: "priority" },
      { Header: "Data", accessor: "createdAt" },
      { Header: "Status", accessor: "status" },
    ],
    []
  );
  const dataCollumns = useMemo(
    () => response?.issues ?? [],
    [response?.issues]
  );
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any[], id: any, filterValue: any) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = useTable(
    {
      columns,
      data: dataCollumns,
      initialState: { pageIndex: 0 },
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  return (
    <Flex
      height="100vh"
      justifyContent="center"
      background="gray.500"
    >
      <Flex
        direction="column"
        background="gray.100"
        p={12}
        rounded={6}
        w="100%"
      >
        <Heading mb={6}>Issue Tracking System</Heading>
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <Flex alignItems="center" justifyContent="flex-start">
                      <Flex>{column.render("Header")}</Flex>
                      <Flex>
                        {column.canFilter ? column.render("Filter") : null}
                      </Flex>
                      <Flex>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                      </Flex>
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Flex justifyContent="space-around" alignItems="center">
          <Flex>
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </Button>{" "}
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </Button>{" "}
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </Button>{" "}
            <Button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </Button>
          </Flex>
          <Flex>
            <chakra.span>
              Página{" "}
              <Text as="strong">
                {state.pageIndex + 1} de {pageOptions.length}
              </Text>{" "}
            </chakra.span>
          </Flex>
          <Flex alignItems="center" justifyContent="space-around">
            <Text>Vá para a página:</Text>
            <Input
              type="number"
              w="60%"
              defaultValue={state.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />
          </Flex>
          <Flex alignItems="center">
            <Text marginRight={3}>Mostrando:</Text>
            <Select
              value={state.pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Issues;
