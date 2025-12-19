import { splitProps, type JSX, type ParentComponent } from 'solid-js'
import { cn } from '@/lib/utils'

const Table: ParentComponent<JSX.TableHTMLAttributes<HTMLTableElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div data-slot="table-container" class="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        class={cn('w-full caption-bottom text-sm', local.class)}
        {...others}
      >
        {local.children}
      </table>
    </div>
  )
}

const TableHeader: ParentComponent<JSX.HTMLAttributes<HTMLTableSectionElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <thead
      data-slot="table-header"
      class={cn('[&_tr]:border-b', local.class)}
      {...others}
    >
      {local.children}
    </thead>
  )
}

const TableBody: ParentComponent<JSX.HTMLAttributes<HTMLTableSectionElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <tbody
      data-slot="table-body"
      class={cn('[&_tr:last-child]:border-0', local.class)}
      {...others}
    >
      {local.children}
    </tbody>
  )
}

const TableFooter: ParentComponent<JSX.HTMLAttributes<HTMLTableSectionElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <tfoot
      data-slot="table-footer"
      class={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        local.class
      )}
      {...others}
    >
      {local.children}
    </tfoot>
  )
}

const TableRow: ParentComponent<JSX.HTMLAttributes<HTMLTableRowElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <tr
      data-slot="table-row"
      class={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        local.class
      )}
      {...others}
    >
      {local.children}
    </tr>
  )
}

const TableHead: ParentComponent<JSX.ThHTMLAttributes<HTMLTableCellElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <th
      data-slot="table-head"
      class={cn(
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        local.class
      )}
      {...others}
    >
      {local.children}
    </th>
  )
}

const TableCell: ParentComponent<JSX.TdHTMLAttributes<HTMLTableCellElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <td
      data-slot="table-cell"
      class={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        local.class
      )}
      {...others}
    >
      {local.children}
    </td>
  )
}

const TableCaption: ParentComponent<JSX.HTMLAttributes<HTMLTableCaptionElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <caption
      data-slot="table-caption"
      class={cn('text-muted-foreground mt-4 text-sm', local.class)}
      {...others}
    >
      {local.children}
    </caption>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
